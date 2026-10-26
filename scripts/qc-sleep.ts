/**
 * Quality check for every recorded Walk and Sleep chapter (or one book). Free: it
 * reads local files, asks ffmpeg about the audio and asks R2 only for file sizes.
 *
 *   npx tsx scripts/qc-sleep.ts            # every chapter in the catalogue
 *   npx tsx scripts/qc-sleep.ts genesis    # only slugs starting with this
 *   npx tsx scripts/qc-sleep.ts --transcribe   # first fetch Whisper transcripts for recordings
 *                                              # that have none (paid: about $0.006 a minute)
 *
 * Checks, per chapter:
 *   text      verses match the BSB word for word, nothing missing or extra
 *   images    every painting the chapter shows exists and is not tiny
 *   timing    Sleep and Walk timing cover every verse, in order, inside the audio
 *   pace      no verse runs far faster or slower than the chapter's own pace
 *             (a sign of a misaligned or estimated verse start)
 *   audio     local MP3 length matches timing.json and the catalogue
 *   silence   no gap of 6 s or more inside the reading (a dropout or cut)
 *   loudness  each recording near the -16 LUFS it was mastered to
 *   lengths   Walk about 60-95% as long as Sleep (otherwise one was cut short or repeated)
 *   r2        the MP3 the app streams is on R2 and the same size as the local one
 *   words     every word of the text was said (from the Whisper transcript kept when the
 *             chapter was voiced; chapters voiced before that have no transcript yet)
 *
 * Writes a report to qc-report.md (git-ignored) and exits 1 if anything failed.
 */
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { getChapter } from "../lib/bible/bsb";
import { SLEEP_CHAPTERS, SLEEP_SECONDS, WALK_SECONDS } from "../lib/sleep/chapters";
import type { SleepChapter, SleepTiming } from "../lib/sleep/types";
import { checkCoverage } from "../lib/sleep/coverage";
import { confirmSkipped, transcribe, transcriptPath } from "./lib/sleep-voice";

const only = process.argv.slice(2).find((a) => !a.startsWith("--")) ?? "";
const fetchTranscripts = process.argv.includes("--transcribe");
const audioBase = (() => {
  const env = existsSync(".env.local") ? readFileSync(".env.local", "utf8") : "";
  const m = env.match(/^NEXT_PUBLIC_AUDIO_BASE_URL=(.*)$/m);
  return (process.env.NEXT_PUBLIC_AUDIO_BASE_URL || m?.[1] || "").trim().replace(/^["']|["']$/g, "").replace(/\/$/, "");
})();

type Finding = { slug: string; check: string; level: "fail" | "warn"; note: string };
const findings: Finding[] = [];
const fail = (slug: string, check: string, note: string) => findings.push({ slug, check, level: "fail", note });
const warn = (slug: string, check: string, note: string) => findings.push({ slug, check, level: "warn", note });

const probeSeconds = (file: string) =>
  Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file], { encoding: "utf8" }).trim());

/** Silences of `min` seconds or more, ignoring the quiet lead-in and fade-out. */
function longSilences(file: string, duration: number, min = 6): { start: number; length: number }[] {
  // silencedetect reports on stderr.
  const { stderr } = spawnSync("ffmpeg", ["-hide_banner", "-nostats", "-i", file, "-af", `silencedetect=noise=-45dB:d=${min}`, "-f", "null", "-"], {
    encoding: "utf8",
  });
  return parseSilences(stderr ?? "", duration);
}

function parseSilences(log: string, duration: number) {
  const starts = [...log.matchAll(/silence_start: ([\d.]+)/g)].map((m) => Number(m[1]));
  const lengths = [...log.matchAll(/silence_duration: ([\d.]+)/g)].map((m) => Number(m[1]));
  return starts
    .map((start, i) => ({ start, length: lengths[i] ?? duration - start }))
    .filter((s) => s.start > 3 && s.start + s.length < duration - 3);
}

function checkTiming(c: SleepChapter, mode: "sleep" | "walk") {
  const dir = join("public", mode, c.slug);
  const tFile = join(dir, "timing.json");
  const mp3 = join(dir, "chapter.mp3");
  if (!existsSync(tFile)) return fail(c.slug, `${mode} timing`, "timing.json missing");
  const t: SleepTiming = JSON.parse(readFileSync(tFile, "utf8"));
  const starts = c.verses.map((v) => t.verses[String(v.n)]);
  const missing = c.verses.filter((_, i) => typeof starts[i] !== "number").map((v) => v.n);
  if (missing.length) fail(c.slug, `${mode} timing`, `no start for verse ${missing.join(", ")}`);
  const extra = Object.keys(t.verses).filter((k) => !c.verses.some((v) => String(v.n) === k));
  if (extra.length) fail(c.slug, `${mode} timing`, `starts for verses not in the chapter: ${extra.join(", ")}`);
  for (let i = 1; i < starts.length; i++) {
    if (!(starts[i] > starts[i - 1])) fail(c.slug, `${mode} timing`, `verse ${c.verses[i].n} does not start after verse ${c.verses[i - 1].n}`);
  }
  if (starts.at(-1)! >= t.duration) fail(c.slug, `${mode} timing`, `last verse starts after the audio ends`);

  // Pace: seconds per character for each verse against the chapter's own median.
  const rates = c.verses.slice(0, -1).map((v, i) => ({ n: v.n, rate: (starts[i + 1] - starts[i]) / Math.max(20, v.text.length) }));
  const sorted = rates.map((r) => r.rate).sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  const odd = rates.filter((r) => r.rate > median * 2.6 || r.rate < median * 0.35);
  if (odd.length) {
    const list = odd.map((r) => `${r.n} (${(r.rate / median).toFixed(1)}×)`).join(", ");
    (odd.length > 3 ? fail : warn)(c.slug, `${mode} pace`, `verses read at an unlikely pace, so their start is probably off: ${list}`);
  }

  if (!existsSync(mp3)) return fail(c.slug, `${mode} audio`, "chapter.mp3 missing locally");
  const secs = probeSeconds(mp3);
  if (Math.abs(secs - t.duration) > 1.5) fail(c.slug, `${mode} audio`, `MP3 is ${secs.toFixed(1)} s but timing says ${t.duration} s`);
  const listed = (mode === "sleep" ? SLEEP_SECONDS : WALK_SECONDS)[c.slug];
  if (Math.abs((listed ?? 0) - t.duration) > 1.5) fail(c.slug, `${mode} catalogue`, `catalogue says ${listed} s, timing says ${t.duration} s`);
  for (const s of longSilences(mp3, secs)) {
    warn(c.slug, `${mode} silence`, `${s.length.toFixed(1)} s of silence at ${Math.floor(s.start / 60)}:${String(Math.round(s.start % 60)).padStart(2, "0")}`);
  }
  return mp3;
}

let noTranscript = 0;

/** Word for word, from the transcript kept when the chapter was voiced. */
async function checkWords(c: SleepChapter, mode: "sleep" | "walk") {
  const file = transcriptPath(mode, c.slug);
  if (!existsSync(file)) return void noTranscript++;
  const { duration, words } = JSON.parse(readFileSync(file, "utf8"));
  const mp3 = join("public", mode, c.slug, "chapter.mp3");
  for (const x of checkCoverage(c.verses, words, duration)) {
    const where = `verse ${x.verse} at ${Math.floor(x.at / 60)}:${String(Math.round(x.at % 60)).padStart(2, "0")}`;
    if (x.kind === "skipped") {
      // Whisper drops words in long, repetitive readings: listen again to just that stretch.
      if (existsSync(mp3) && !(await confirmSkipped(mp3, x.at, x.words))) {
        warn(c.slug, `${mode} words`, `flagged at ${where} but the words are there when that stretch is checked on its own: "${x.words}"`);
      } else fail(c.slug, `${mode} words`, `skipped at ${where}: "${x.words}"`);
    } else if (x.kind === "extra") fail(c.slug, `${mode} words`, `said but not in the text at ${where}: "${x.words}"`);
  }
}

/** Integrated loudness (LUFS) of a file, from ffmpeg's EBU R128 meter. */
function loudness(file: string): number | null {
  const { stderr } = spawnSync("ffmpeg", ["-hide_banner", "-nostats", "-i", file, "-af", "ebur128=framelog=quiet", "-f", "null", "-"], { encoding: "utf8" });
  const m = [...(stderr ?? "").matchAll(/I:\s+(-?[\d.]+) LUFS/g)].pop();
  return m ? Number(m[1]) : null;
}

function checkLoudness(slug: string, mode: string, mp3: string) {
  const lufs = loudness(mp3);
  if (lufs === null) warn(slug, `${mode} loudness`, "could not measure");
  else if (lufs < -19 || lufs > -13) warn(slug, `${mode} loudness`, `${lufs} LUFS, mastered for -16`);
}

function checkLengths(c: SleepChapter) {
  const sleep = SLEEP_SECONDS[c.slug];
  const walk = WALK_SECONDS[c.slug];
  if (!sleep || !walk) return;
  const ratio = walk / sleep;
  if (ratio < 0.6 || ratio > 0.95) warn(c.slug, "lengths", `Walk is ${Math.round(ratio * 100)}% of Sleep (usually 70-85%): one reading may be cut short or repeat a passage`);
}

async function checkR2(slug: string, mode: string, mp3: string) {
  if (!audioBase) return warn(slug, `${mode} r2`, "NEXT_PUBLIC_AUDIO_BASE_URL not set; skipped");
  try {
    const res = await fetch(`${audioBase}/${mode}/${slug}/chapter.mp3`, { method: "HEAD" });
    if (!res.ok) return fail(slug, `${mode} r2`, `R2 answered ${res.status}`);
    const size = Number(res.headers.get("content-length"));
    if (size !== statSync(mp3).size) fail(slug, `${mode} r2`, `R2 copy is ${size} bytes, local is ${statSync(mp3).size}`);
  } catch (e) {
    fail(slug, `${mode} r2`, `could not reach R2: ${e instanceof Error ? e.message : e}`);
  }
}

/** Transcribe recordings that have no transcript yet, a few at a time. */
async function backfillTranscripts(chapters: SleepChapter[]) {
  const todo = chapters.flatMap((c) =>
    (["sleep", "walk"] as const)
      .map((mode) => ({ slug: c.slug, mode, mp3: join("public", mode, c.slug, "chapter.mp3") }))
      .filter((x) => existsSync(x.mp3) && !existsSync(transcriptPath(x.mode, x.slug))),
  );
  let done = 0;
  let minutes = 0;
  const next = async (): Promise<void> => {
    const job = todo.shift();
    if (!job) return;
    const duration = probeSeconds(job.mp3);
    const words = await transcribe(job.mp3);
    mkdirSync(dirname(transcriptPath(job.mode, job.slug)), { recursive: true });
    writeFileSync(transcriptPath(job.mode, job.slug), JSON.stringify({ duration, words }) + "\n");
    minutes += duration / 60;
    process.stdout.write(`\r  transcribed ${++done} recordings (${Math.round(minutes)} min, about $${(minutes * 0.006).toFixed(2)})   `);
    return next();
  };
  await Promise.all([next(), next(), next(), next()]);
  if (done) console.log("");
}

async function main() {
  const chapters = SLEEP_CHAPTERS.filter((c) => c.slug.startsWith(only));
  if (fetchTranscripts) await backfillTranscripts(chapters);
  for (const [i, c] of chapters.entries()) {
    process.stdout.write(`\r  checking ${c.slug} (${i + 1}/${chapters.length})      `);

    // Text: word for word against the BSB.
    const bsb = getChapter(c.book, c.chapter);
    if (bsb.length !== c.verses.length) fail(c.slug, "text", `${c.verses.length} verses, the BSB has ${bsb.length}`);
    for (const v of bsb) {
      const ours = c.verses.find((x) => x.n === v.n);
      if (!ours) fail(c.slug, "text", `verse ${v.n} missing`);
      else if (ours.text !== v.text) fail(c.slug, "text", `verse ${v.n} differs from the BSB`);
    }

    // Paintings.
    for (const img of new Set(c.verses.map((v) => v.image))) {
      const file = join("public", img);
      if (!existsSync(file)) fail(c.slug, "images", `${img} missing`);
      else if (statSync(file).size < 30_000) warn(c.slug, "images", `${img} is only ${Math.round(statSync(file).size / 1000)} KB`);
    }
    if (!c.verses[0].heading && c.slug !== "genesis-1") warn(c.slug, "headings", "the chapter does not open with a section heading");

    checkLengths(c);
    for (const mode of ["sleep", "walk"] as const) {
      await checkWords(c, mode);
      const mp3 = checkTiming(c, mode);
      if (typeof mp3 === "string") {
        checkLoudness(c.slug, mode, mp3);
        await checkR2(c.slug, mode, mp3);
      }
    }
  }

  const fails = findings.filter((f) => f.level === "fail");
  const warns = findings.filter((f) => f.level === "warn");
  const lines = [
    `# Walk and Sleep QC${only ? `: ${only}` : ""}`,
    "",
    `${chapters.length} chapters checked: ${fails.length} failures, ${warns.length} warnings.`,
    ...(noTranscript ? ["", `Word check skipped for ${noTranscript} recordings voiced before transcripts were kept.`] : []),
    "",
    ...(findings.length
      ? ["| Chapter | Check | Level | Note |", "|---|---|---|---|", ...findings.map((f) => `| ${f.slug} | ${f.check} | ${f.level} | ${f.note} |`)]
      : ["Everything passed."]),
    "",
  ];
  writeFileSync("qc-report.md", lines.join("\n"));
  console.log(`\r  ${chapters.length} chapters checked: ${fails.length} failures, ${warns.length} warnings. Report: qc-report.md`);
  process.exit(fails.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
