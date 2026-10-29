/**
 * Voices a Bible story script with its narrator (the script's "voice:" line) on
 * ElevenLabs Flash, checks every piece word for word, and writes
 * public/stories/<slug>/story.mp3 (uploaded to R2, gitignored) and
 * public/stories/<slug>/sections.json (when each section starts). Then run
 * scripts/story-build.ts to put the episode in the app.
 *
 *   npx tsx scripts/story-voice.ts content/stories/women-of-the-bible/sarah.md [--redo] [--no-upload]
 *
 * Each piece between [pause] markers is one request, told the text before and after it
 * and linked to the previous requests so the voice keeps one tone. Each piece is then
 * transcribed on its own (short clips are far more reliable than a whole file) and
 * compared with the script; a piece with more than one word out is voiced again, up to
 * twice, keeping the best take. Takes are cached in voice-transcripts/stories/<slug>/,
 * so a rerun only voices what is missing; --redo starts over.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import { spokenWords } from "../lib/sleep/coverage";
import { LEAD_SECONDS, parseStory, PCM_RATE as RATE, voiceId } from "../lib/stories/script";
import { elevenSpeak, FINISH, transcribe } from "./lib/sleep-voice";
import { r2Env, uploadToR2 } from "./upload-audio-r2";

const MAX_TAKES = 3;
/** Theo keeps the Sleep chapters' warm finish; Leona's lighter voice keeps more of its top. */
const FINISHES: Record<string, string> = {
  UmQN7jS1Ee8B1czsUtQh: FINISH,
  "9BDgg2Q7WSrW0x8naPLw": "highpass=f=70,lowpass=f=9000,equalizer=f=3500:t=q:w=1.2:g=-2,loudnorm=I=-16:TP=-1.5:LRA=7",
};

const file = process.argv[2];
if (!file) {
  console.error("Usage: npx tsx scripts/story-voice.ts <script.md> [--redo] [--no-upload]");
  process.exit(2);
}
const slug = basename(file, ".md");
const { meta, pieces } = parseStory(readFileSync(file, "utf8"));
const voice = voiceId(meta);
const work = join("voice-transcripts", "stories", slug);
if (process.argv.includes("--redo")) rmSync(work, { recursive: true, force: true });
mkdirSync(work, { recursive: true });

const ff = (args: string[]) => execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...args]);
const silence = (seconds: number) => Buffer.alloc(Math.round(seconds * RATE) * 2);

/** Words in the script but not heard, and heard but not in the script (longest common subsequence). */
function wordDiff(expected: string[], heard: string[]) {
  const n = expected.length;
  const m = heard.length;
  const dp = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));
  for (let i = n - 1; i >= 0; i--)
    for (let k = m - 1; k >= 0; k--) dp[i][k] = expected[i] === heard[k] ? dp[i + 1][k + 1] + 1 : Math.max(dp[i + 1][k], dp[i][k + 1]);
  const missing: string[] = [];
  const extra: string[] = [];
  let i = 0;
  let k = 0;
  while (i < n && k < m) {
    if (expected[i] === heard[k]) (i++, k++);
    else if (dp[i + 1][k] >= dp[i][k + 1]) missing.push(expected[i++]);
    else extra.push(heard[k++]);
  }
  return { missing: [...missing, ...expected.slice(i)], extra: [...extra, ...heard.slice(k)] };
}

/** Letters that differ between two strings (edit distance). */
function editDistance(a: string, b: string): number {
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[b.length];
}

/**
 * Words out in a take. A difference that is only spelling ("for ever"/"forever", "favor"/"favour",
 * "Ramah"/"Rama") is Whisper's, not the voice's, so it counts as none; a skipped or added
 * phrase still counts in full.
 */
function wordsOut({ missing, extra }: ReturnType<typeof wordDiff>): number {
  if (missing.length && extra.length && editDistance(missing.join(""), extra.join("")) <= 2) return 0;
  return missing.length + extra.length;
}

/**
 * Whisper spells some words differently from the script without the voice getting them
 * wrong ("good night", "Rebecca", "4 000"). Bring both sides to one spelling first, so
 * only real slips count.
 */
const SAME_WORDS: [RegExp, string][] = [
  [/\bgood night\b/g, "goodnight"],
  [/\bany more\b/g, "anymore"],
  [/\boh\b/g, "o"],
  [/\brebecca\b/g, "rebekah"],
  [/\bkinsmen\b/g, "kinsman"],
  [/\bmarlon(s?)\b/g, "mahlon$1"],
  [/\bmylons\b/g, "mahlons"],
  [/\b(neighb|hon|col|fav|lab|harb|behavi)our(s?)\b/g, "$1or$2"],
  [/\bsaviour\b/g, "savior"],
];
function words(s: string): string[] {
  let joined = spokenWords(s.replace(/(\d)[\s  ](\d{3})\b/g, "$1$2")).join(" ");
  for (const [from, to] of SAME_WORDS) joined = joined.replace(from, to);
  return joined.split(" ").filter(Boolean);
}

async function checkTake(pcm: Buffer, text: string) {
  const mp3 = join(tmpdir(), `story-${slug}-${Date.now()}.mp3`);
  const raw = `${mp3}.pcm`;
  writeFileSync(raw, pcm);
  try {
    ff(["-f", "s16le", "-ar", String(RATE), "-ac", "1", "-i", raw, "-codec:a", "libmp3lame", "-b:a", "64k", mp3]);
    const heard = words((await transcribe(mp3)).map((w) => w.word).join(" "));
    return wordDiff(words(text), heard);
  } finally {
    rmSync(mp3, { force: true });
    rmSync(raw, { force: true });
  }
}

async function main() {
  console.log(`${meta.title}: ${pieces.length} pieces, voice ${meta.voice}`);
  const requestIds: string[] = [];
  const audio: Buffer[] = [silence(LEAD_SECONDS)];
  const sections: { title: string; start: number }[] = [];
  let at = LEAD_SECONDS;
  let flagged = 0;

  for (const [i, piece] of pieces.entries()) {
    const take = join(work, `${String(i).padStart(3, "0")}.pcm`);
    const note = join(work, `${String(i).padStart(3, "0")}.json`);
    let pcm: Buffer;
    if (existsSync(take)) {
      pcm = readFileSync(take);
    } else {
      let best: { pcm: Buffer; issues: number; diff: ReturnType<typeof wordDiff>; requestId: string | null } | null = null;
      for (let t = 1; t <= MAX_TAKES; t++) {
        const { pcm: p, requestId } = await elevenSpeak(voice, piece.text, {
          previousText: pieces.slice(Math.max(0, i - 3), i).map((x) => x.text).join("\n\n") || undefined,
          nextText: pieces[i + 1]?.text,
          previousRequestIds: requestIds.slice(-3),
        });
        const diff = await checkTake(p, piece.text);
        const issues = wordsOut(diff);
        if (!best || issues < best.issues) best = { pcm: p, issues, diff, requestId };
        if (issues <= 1) break;
        process.stdout.write(`\n  piece ${i}: ${issues} words out (take ${t}), voicing again`);
      }
      pcm = best!.pcm;
      if (best!.requestId) requestIds.push(best!.requestId);
      writeFileSync(take, pcm);
      writeFileSync(note, JSON.stringify({ text: piece.text, ...best!.diff }, null, 2));
      if (best!.issues > 1) {
        flagged++;
        console.log(`\n  ⚠ piece ${i} still ${best!.issues} words out: missing [${best!.diff.missing.join(" ")}], extra [${best!.diff.extra.join(" ")}]`);
      }
    }
    if (!sections.length || sections[sections.length - 1].title !== piece.section) sections.push({ title: piece.section, start: Math.round(at * 10) / 10 });
    audio.push(pcm, silence(piece.pauseAfter));
    at += pcm.length / 2 / RATE + piece.pauseAfter;
    process.stdout.write(`\r  ${i + 1}/${pieces.length} pieces voiced and checked   `);
  }

  const outDir = join("public", "stories", slug);
  mkdirSync(outDir, { recursive: true });
  const raw = join(work, "story.pcm");
  writeFileSync(raw, Buffer.concat(audio));
  const out = join(outDir, "story.mp3");
  ff(["-f", "s16le", "-ar", String(RATE), "-ac", "1", "-i", raw, "-af", FINISHES[voice] ?? FINISH, "-codec:a", "libmp3lame", "-b:a", "64k", out]);
  rmSync(raw, { force: true });
  const duration = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", out]).toString());
  writeFileSync(join(outDir, "sections.json"), JSON.stringify({ title: meta.title, series: meta.series, duration: Math.round(duration * 10) / 10, sections }, null, 2) + "\n");
  console.log(`\n  ${out}: ${(duration / 60).toFixed(1)} min, ${sections.length} sections${flagged ? `, ${flagged} piece(s) to listen to` : ", every piece word-checked"}`);

  if (!process.argv.includes("--no-upload")) {
    const r2 = r2Env();
    if (!r2) console.log("  R2 keys missing: not uploaded");
    else console.log(`  ${(await uploadToR2(r2, out, true)) ? "uploaded to R2" : "already on R2"}`);
  }
}

main().catch((e) => {
  console.error(`\n${String(e).slice(0, 400)}`);
  process.exit(1);
});
