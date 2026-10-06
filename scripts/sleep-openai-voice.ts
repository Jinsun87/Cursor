/**
 * Narration for a Sleep chapter with OpenAI TTS (tts-1-hd). Each verse is
 * spoken separately, joined with stillness between verses, and encoded to one
 * small MP3 plus timing.json with each verse's start time.
 *
 * Needs OPENAI_API_KEY in .env.local and ffmpeg on the PATH.
 *
 *   npx tsx scripts/sleep-openai-voice.ts            # onyx
 *   npx tsx scripts/sleep-openai-voice.ts --voice=fable --out=sample-fable.mp3
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { SLEEP_GENESIS_1 } from "../lib/sleep/genesis-1";

// .env.local wins over any OPENAI_API_KEY already set in the shell (loadEnvFile alone would not override it).
const fileKey = existsSync(".env.local")
  ? readFileSync(".env.local", "utf8").match(/^OPENAI_API_KEY=(.+)$/m)?.[1].trim()
  : undefined;
const KEY = fileKey ?? process.env.OPENAI_API_KEY;
if (!KEY) throw new Error("OPENAI_API_KEY is missing from .env.local");

const arg = (name: string) => process.argv.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];
const VOICE = arg("voice") ?? "onyx"; // deep, warm and unhurried
const SPEED = Number(arg("speed") ?? 0.9); // a little slower: this is read for falling asleep
const GAP_SECONDS = 1.6; // stillness between verses
const LEAD_SECONDS = 2; // quiet before the first verse
const SAMPLE_RATE = 24000; // OpenAI "pcm" is 24 kHz, 16-bit, mono
const BYTES_PER_SECOND = SAMPLE_RATE * 2;

const chapter = SLEEP_GENESIS_1;
const outDir = join(process.cwd(), "public", chapter.audioSrc.split("/").slice(0, -1).join("/"));
const outFile = arg("out") ?? chapter.audioSrc.split("/").pop()!;
const workDir = join(tmpdir(), `sleep-openai-${chapter.slug}`);
mkdirSync(outDir, { recursive: true });
mkdirSync(workDir, { recursive: true });

async function speak(text: string): Promise<Buffer> {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "tts-1-hd", voice: VOICE, input: text, speed: SPEED, response_format: "pcm" }),
    });
    if (res.ok) return Buffer.from(await res.arrayBuffer());
    if (attempt >= 3 || res.status < 500) throw new Error(`TTS ${res.status}: ${await res.text()}`);
  }
}

const silence = (seconds: number) => Buffer.alloc(Math.round(seconds * SAMPLE_RATE) * 2);

async function main() {
  const parts: Buffer[] = [silence(LEAD_SECONDS)];
  const timing: Record<string, number> = {};
  let cursor = LEAD_SECONDS;
  let characters = 0;
  for (const v of chapter.verses) {
    characters += v.text.length;
    const pcm = await speak(v.text);
    timing[String(v.n)] = Math.round(cursor * 100) / 100;
    parts.push(pcm, silence(GAP_SECONDS));
    cursor += pcm.length / BYTES_PER_SECOND + GAP_SECONDS;
    process.stdout.write(`\rverse ${v.n}/${chapter.verses.length}`);
  }

  const raw = join(workDir, "chapter.pcm");
  writeFileSync(raw, Buffer.concat(parts));
  execFileSync(
    "ffmpeg",
    ["-y", "-loglevel", "error", "-f", "s16le", "-ar", String(SAMPLE_RATE), "-ac", "1", "-i", raw,
     "-codec:a", "libmp3lame", "-b:a", "64k", join(outDir, outFile)],
    { stdio: "inherit" },
  );
  if (!arg("out"))
    writeFileSync(
      join(outDir, "timing.json"),
      JSON.stringify({ duration: Math.round(cursor * 100) / 100, verses: timing }, null, 2) + "\n",
    );
  rmSync(workDir, { recursive: true, force: true });
  console.log(`\n${VOICE}: ${chapter.verses.length} verses, ${cursor.toFixed(1)}s, ${characters} characters → ${join(outDir, outFile)}`);
}

main();
