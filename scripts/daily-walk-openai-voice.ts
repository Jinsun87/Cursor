/**
 * Narration for a Daily Walk episode with OpenAI TTS (tts-1-hd, fable): one
 * MP3 per clip plus timing.json with each clip's duration in seconds, which is
 * all the Walk player needs.
 *
 * Needs OPENAI_API_KEY in .env.local and ffmpeg/ffprobe on the PATH.
 *
 *   npx tsx scripts/daily-walk-openai-voice.ts
 *   npx tsx scripts/daily-walk-openai-voice.ts --voice=nova --speed=0.95
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { GENESIS_1 } from "../lib/daily-walk/genesis-1";
import { episodeClips } from "../lib/daily-walk/types";

// .env.local wins over any OPENAI_API_KEY already set in the shell.
const fileKey = existsSync(".env.local")
  ? readFileSync(".env.local", "utf8").match(/^OPENAI_API_KEY=(.+)$/m)?.[1].trim()
  : undefined;
const KEY = fileKey ?? process.env.OPENAI_API_KEY;
if (!KEY) throw new Error("OPENAI_API_KEY is missing from .env.local");

const arg = (name: string) => process.argv.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];
const VOICE = arg("voice") ?? "fable"; // warm storyteller
const SPEED = Number(arg("speed") ?? 0.95);

const episode = GENESIS_1;
const outDir = join(process.cwd(), "public", episode.audioDir);
mkdirSync(outDir, { recursive: true });

async function speak(text: string): Promise<Buffer> {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "tts-1-hd", voice: VOICE, input: text, speed: SPEED, response_format: "mp3" }),
    });
    if (res.ok) return Buffer.from(await res.arrayBuffer());
    if (attempt >= 3 || res.status < 500) throw new Error(`TTS ${res.status}: ${await res.text()}`);
  }
}

function mp3Seconds(path: string): number {
  const out = execFileSync(
    "ffprobe",
    ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path],
    { encoding: "utf8" },
  );
  return Math.round(Number(out.trim()) * 100) / 100;
}

async function main() {
  const clips = episodeClips(episode);
  const timing: Record<string, number> = {};
  let characters = 0;
  for (const clip of clips) {
    characters += clip.text.length;
    const file = join(outDir, `${clip.name}.mp3`);
    writeFileSync(file, await speak(clip.text));
    timing[clip.name] = mp3Seconds(file);
    process.stdout.write(`\r${Object.keys(timing).length}/${clips.length}`);
  }
  writeFileSync(join(outDir, "timing.json"), JSON.stringify(timing, null, 2) + "\n");
  console.log(`\n${VOICE}: ${clips.length} clips, ${characters} characters → ${outDir}`);
}

main();
