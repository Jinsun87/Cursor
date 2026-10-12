/**
 * Sleep narration: gpt-4o-mini-tts with delivery instructions, one request per
 * passage (a section of the chapter) so the voice keeps one breath and tone,
 * then a warm, soft finish (EQ and loudness). Verse start times are recovered by
 * transcribing the result with word timestamps and matching each verse's
 * opening words.
 *
 * Needs OPENAI_API_KEY in .env.local and ffmpeg/ffprobe on the PATH.
 *
 *   npx tsx scripts/sleep-openai-voice-v2.ts --voice=onyx --out=public/sleep/genesis-1
 *   (writes <out>/chapter.mp3 and <out>/timing.json)
 *
 *   --keep-plain   also write the unprocessed take as <out>/plain.mp3
 *   --plain=<mp3>  skip the speech API and re-finish and re-time an earlier plain take
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { SLEEP_GENESIS_1 } from "../lib/sleep/genesis-1";

const fileKey = existsSync(".env.local")
  ? readFileSync(".env.local", "utf8").match(/^OPENAI_API_KEY=(.+)$/m)?.[1].trim()
  : undefined;
const KEY = fileKey ?? process.env.OPENAI_API_KEY;
if (!KEY) throw new Error("OPENAI_API_KEY is missing from .env.local");

const arg = (name: string) => process.argv.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];
const VOICE = arg("voice") ?? "onyx";
const OUT = arg("out");
if (!OUT) throw new Error("--out=<folder> is required");

const INSTRUCTIONS =
  "Voice: low, warm and unhurried, like a calm elder reading Scripture aloud to someone falling asleep. " +
  "Tone: soothing and reverent, never dramatic, no performance. " +
  "Pacing: slow and even, with a long natural pause between verses. " +
  "Let the end of every verse settle and fall softly, as if trailing toward rest.";
const LEAD_SECONDS = 2;
const SECTION_GAP_SECONDS = 2.4;
const RATE = 24000; // OpenAI "pcm": 24 kHz, 16-bit, mono
// Warm and soft: trim the highs, dip the 3.5 kHz band where harshness lives, add a little body.
const FINISH =
  "highpass=f=70,lowpass=f=6500,equalizer=f=3500:t=q:w=1.2:g=-4,equalizer=f=180:t=q:w=1:g=2," +
  "loudnorm=I=-16:TP=-1.5:LRA=7";

const chapter = SLEEP_GENESIS_1;
const work = join(tmpdir(), `sleep-v2-${VOICE}`);
mkdirSync(work, { recursive: true });
mkdirSync(OUT, { recursive: true });

// A section starts at each verse with a heading (and at verse 1).
const sections: (typeof chapter.verses)[] = [];
for (const v of chapter.verses) {
  if (!sections.length || v.heading) sections.push([]);
  sections[sections.length - 1].push(v);
}

async function post(url: string, init: RequestInit): Promise<Response> {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(url, init);
    if (res.ok) return res;
    if (attempt >= 3 || res.status < 500) throw new Error(`${res.status}: ${await res.text()}`);
  }
}

async function speak(text: string): Promise<Buffer> {
  const res = await post("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "gpt-4o-mini-tts", voice: VOICE, input: text, instructions: INSTRUCTIONS, response_format: "pcm" }),
  });
  return Buffer.from(await res.arrayBuffer());
}

const silence = (seconds: number) => Buffer.alloc(Math.round(seconds * RATE) * 2);
const words = (s: string) => s.toLowerCase().replace(/[^a-z\s']/g, " ").split(/\s+/).filter(Boolean);
const ff = (args: string[]) => execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...args], { stdio: "inherit" });

async function main() {
  // --plain=<mp3> reuses an earlier unprocessed take instead of calling the speech API again.
  let plain = arg("plain") ?? "";
  let duration = 0;
  if (plain) {
    duration = Number(
      execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", plain], { encoding: "utf8" }).trim(),
    );
  } else {
    const parts: Buffer[] = [silence(LEAD_SECONDS)];
    for (const [i, section] of sections.entries()) {
      parts.push(await speak(section.map((v) => v.text).join("\n\n")), silence(SECTION_GAP_SECONDS));
      process.stdout.write(`\rsection ${i + 1}/${sections.length}`);
    }
    const raw = join(work, "raw.pcm");
    plain = join(work, "plain.mp3");
    writeFileSync(raw, Buffer.concat(parts));
    ff(["-f", "s16le", "-ar", String(RATE), "-ac", "1", "-i", raw, "-codec:a", "libmp3lame", "-b:a", "64k", plain]);
    duration = Buffer.concat(parts).length / (RATE * 2);
  }

  // Word timestamps → verse start times.
  const form = new FormData();
  form.append("file", new Blob([readFileSync(plain)], { type: "audio/mpeg" }), "chapter.mp3");
  form.append("model", "whisper-1");
  form.append("response_format", "verbose_json");
  form.append("timestamp_granularities[]", "word");
  const tr = await (await post("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}` },
    body: form,
  })).json();
  const heard: { word: string; start: number }[] = tr.words.map((w: { word: string; start: number }) => ({
    word: words(w.word).join("").replace(/'/g, ""),
    start: w.start,
  }));

  // Each verse starts where its first words are heard, nearest to where the running word count
  // says it should be. Whisper can merge or drop words, so search a window either side, accept
  // 2 of the first 3 words, and re-sync the cursor on every match.
  const timing: Record<string, number> = {};
  let cursor = 0;
  let lastStart = -1;
  let missed = 0;
  for (const v of chapter.verses) {
    const toks = words(v.text).map((t) => t.replace(/'/g, ""));
    const probe = toks.slice(0, 3);
    const need = Math.min(2, probe.length);
    let at = -1;
    let best = 0;
    for (let i = Math.max(0, cursor - 15); i < Math.min(heard.length, cursor + 40); i++) {
      if (heard[i].start <= lastStart) continue;
      const score = probe.filter((t, k) => heard[i + k]?.word === t).length;
      if (score >= need && (score > best || (score === best && Math.abs(i - cursor) < Math.abs(at - cursor)))) {
        best = score;
        at = i;
      }
    }
    if (at < 0) {
      missed++;
      at = Math.min(cursor, heard.length - 1);
    }
    lastStart = heard[at].start;
    timing[String(v.n)] = Math.round(lastStart * 100) / 100;
    cursor = at + toks.length;
  }

  duration = Math.round(duration * 100) / 100;
  if (process.argv.includes("--keep-plain") && !arg("plain")) writeFileSync(join(OUT!, "plain.mp3"), readFileSync(plain));
  ff(["-i", plain, "-af", FINISH, "-codec:a", "libmp3lame", "-b:a", "64k", join(OUT!, "chapter.mp3")]);
  writeFileSync(join(OUT!, "timing.json"), JSON.stringify({ duration, verses: timing }, null, 2) + "\n");
  rmSync(work, { recursive: true, force: true });
  console.log(`\n${VOICE}: ${chapter.verses.length} verses, ${duration}s, ${missed} verse starts estimated → ${OUT}`);
}

main();
