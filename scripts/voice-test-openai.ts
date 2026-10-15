/**
 * Listening test for the Sleep voice on OpenAI gpt-4o-mini-tts: Genesis 1:1-5
 * and 1:6-8 as two separate requests joined with the chapter gap, exactly as
 * chapters are built, so a change of tone at the join can be heard. Same
 * instructions and warm Sleep finish for every voice.
 *
 *   npx tsx scripts/voice-test-openai.ts onyx cedar ash ballad
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { SLEEP_GENESIS_1 } from "../lib/sleep/genesis-1";
import { FINISH } from "./lib/sleep-voice";

const voices = process.argv.slice(2).filter((a) => !a.startsWith("--"));
if (!voices.length) throw new Error("Name at least one voice, e.g. onyx cedar");
const key =
  (existsSync(".env.local") ? readFileSync(".env.local", "utf8").match(/^OPENAI_API_KEY=(.+)$/m)?.[1].trim() : undefined) ??
  process.env.OPENAI_API_KEY;
if (!key) throw new Error("OPENAI_API_KEY is missing from .env.local");

// OpenAI's recommended shape for gpt-4o-mini-tts instructions, written for sleep.
export const SLEEP_INSTRUCTIONS = [
  "Voice affect: calm, warm and intimate, like a trusted friend reading Scripture aloud at bedtime.",
  "Tone: peaceful, reverent and reassuring; never dramatic, never preachy.",
  "Pacing: steady and unhurried at a natural reading speed. Not slow, not rushed.",
  "Emotion: quiet warmth that stays the same from the first word to the last.",
  "Delivery: soft consonants, gentle and even emphasis, no sudden rises in pitch or volume.",
  "Pauses: a brief natural pause at commas, and one gentle breath at the end of each verse.",
  "Consistency: keep exactly the same voice, pitch, warmth and energy throughout, as one continuous reading.",
].join("\n");

const RATE = 24000;
const silence = (s: number) => Buffer.alloc(Math.round(s * RATE) * 2);
const verses = (from: number, to: number) =>
  SLEEP_GENESIS_1.verses
    .filter((v) => v.n >= from && v.n <= to)
    .map((v) => v.text)
    .join("\n\n");

async function speak(voice: string, text: string): Promise<Buffer> {
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: "gpt-4o-mini-tts", voice, input: text, instructions: SLEEP_INSTRUCTIONS, response_format: "pcm" }),
        signal: AbortSignal.timeout(120_000),
      });
      if (!res.ok) throw new Error(`${res.status}: ${(await res.text()).slice(0, 200)}`);
      return Buffer.from(await res.arrayBuffer());
    } catch (e) {
      if (attempt >= 4) throw e;
      await new Promise((r) => setTimeout(r, 3000 * attempt));
    }
  }
}

async function main() {
  mkdirSync("voice-samples", { recursive: true });
  for (const voice of voices) {
    try {
      const a = await speak(voice, verses(1, 5));
      const b = await speak(voice, verses(6, 8));
      // Two requests joined by the 2.4 s chapter gap: listen at the join for any change of tone.
      const pcm = Buffer.concat([silence(2), a, silence(2.4), b]);
      const raw = join("voice-samples", `tmp-${voice}.pcm`);
      const out = join("voice-samples", `sleep-openai-${voice}.mp3`);
      writeFileSync(raw, pcm);
      execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-f", "s16le", "-ar", String(RATE), "-ac", "1", "-i", raw, "-af", FINISH, "-codec:a", "libmp3lame", "-b:a", "64k", out]);
      rmSync(raw);
      const joinAt = (2 + a.length / (RATE * 2) + 1.2).toFixed(0);
      console.log(`${voice}: ${(pcm.length / (RATE * 2)).toFixed(0)}s, join at ~${joinAt}s → ${out}`);
    } catch (e) {
      console.log(`${voice}: failed (${e instanceof Error ? e.message : e})`);
    }
  }
}

main();
