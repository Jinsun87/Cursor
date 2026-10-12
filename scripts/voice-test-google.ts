/**
 * Listening test: Genesis 1 voiced by Google (Gemini TTS or Chirp 3 HD) with
 * the same passages, pauses and warm finish as the Sleep narration, so only
 * the voice differs. Writes <out>/<name>.mp3. Uses the Google Cloud login
 * (gcloud auth application-default login) and GCP_PROJECT_ID from .env.local.
 *
 *   npx tsx scripts/voice-test-google.ts --engine=gemini --voice=Algieba --out=<folder>
 *   npx tsx scripts/voice-test-google.ts --engine=chirp --voice=Algieba --out=<folder>
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { GoogleAuth } from "google-auth-library";
import { SLEEP_GENESIS_1 } from "../lib/sleep/genesis-1";
import { FINISH, passages } from "./lib/sleep-voice";

const arg = (name: string) => process.argv.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];
const engine = arg("engine") ?? "gemini";
const voice = arg("voice") ?? "Algieba";
const out = arg("out");
if (!out) throw new Error("--out=<folder> is required");

// Same project as the paintings (lib/ai/vertex-imagen.ts falls back to it too).
const project =
  process.env.GCP_PROJECT_ID ||
  (existsSync(".env.local") ? readFileSync(".env.local", "utf8").match(/^GCP_PROJECT_ID=(.+)$/m)?.[1].trim() : undefined) ||
  "nascar-auto";

const PROMPTS: Record<string, string> = {
  // First try: followed "unhurried" so literally it read at half speed.
  slow:
    "Read this Scripture aloud to someone falling asleep: low, warm and unhurried, soothing and reverent, " +
    "never dramatic. Leave a long, gentle pause between verses, and let the end of each verse fall softly.",
  // Calm and warm, but at a natural reading pace.
  natural:
    "You are a calm, warm narrator reading the Bible aloud for a bedtime listening app. " +
    "Read at a natural, steady pace, the speed of a thoughtful audiobook reader: do not slow down or drag the words. " +
    "Keep the tone gentle, quiet and reverent, close to the microphone, never dramatic or theatrical. " +
    "Keep an even volume. Take one relaxed breath between verses, and let each verse end softly.",
};
const PROMPT = PROMPTS[arg("style") ?? "natural"];
const RATE = 24000;
const silence = (s: number) => Buffer.alloc(Math.round(s * RATE) * 2);

async function synth(token: string, text: string): Promise<Buffer> {
  const body =
    engine === "gemini"
      ? {
          input: { text, prompt: PROMPT },
          voice: { languageCode: "en-US", name: voice, modelName: "gemini-2.5-flash-tts" },
          audioConfig: { audioEncoding: "LINEAR16", sampleRateHertz: RATE },
        }
      : {
          input: { text },
          voice: { languageCode: "en-US", name: `en-US-Chirp3-HD-${voice}` },
          audioConfig: { audioEncoding: "LINEAR16", sampleRateHertz: RATE, speakingRate: 0.9 },
        };
  const res = await fetch("https://texttospeech.googleapis.com/v1/text:synthesize", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "x-goog-user-project": project!, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${res.status}: ${(await res.text()).slice(0, 600)}`);
  const wav = Buffer.from((await res.json()).audioContent, "base64");
  return wav.subarray(44); // drop the WAV header; the rest is 16-bit mono PCM
}

async function main() {
  const token = (await (await new GoogleAuth({ scopes: ["https://www.googleapis.com/auth/cloud-platform"] }).getClient()).getAccessToken()).token;
  if (!token) throw new Error("No Google Cloud access token; run gcloud auth application-default login");
  mkdirSync(out!, { recursive: true });
  const parts: Buffer[] = [silence(2)];
  const list = passages(SLEEP_GENESIS_1.verses);
  for (const [i, p] of list.entries()) {
    // Chirp has no style prompt, so give it the pauses between verses as paragraph breaks.
    parts.push(await synth(token, p.map((v) => v.text).join("\n\n")), silence(2.4));
    process.stdout.write(`\r  passage ${i + 1}/${list.length}`);
  }
  const name = `${engine}-${voice}${engine === "gemini" ? `-${arg("style") ?? "natural"}` : ""}`;
  const raw = join(out!, `${name}.pcm`);
  writeFileSync(raw, Buffer.concat(parts));
  const mp3 = join(out!, `${name}.mp3`);
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-f", "s16le", "-ar", String(RATE), "-ac", "1", "-i", raw, "-af", FINISH, "-codec:a", "libmp3lame", "-b:a", "64k", mp3]);
  console.log(`\n${engine} ${voice}: ${(Buffer.concat(parts).length / (RATE * 2)).toFixed(1)}s → ${mp3}`);
}

main().catch((e) => {
  console.error(`\n${e instanceof Error ? e.message : e}`);
  process.exit(1);
});
