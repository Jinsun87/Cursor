/**
 * Listening test for the Sleep voice: Genesis 1:1-5 read by Gemini TTS voices
 * on Vertex AI, with the same delivery instruction and the warm Sleep finish,
 * so only the voice differs. Writes voice-samples/sleep-<model>-<voice>.mp3.
 * Uses the Google Cloud login (gcloud auth application-default login).
 *
 *   npx tsx scripts/voice-test-vertex.ts Enceladus Umbriel Achernar
 *   npx tsx scripts/voice-test-vertex.ts --model=gemini-2.5-flash-tts Algieba
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { GoogleAuth } from "google-auth-library";
import { SLEEP_GENESIS_1 } from "../lib/sleep/genesis-1";
import { FINISH } from "./lib/sleep-voice";

const arg = (name: string) => process.argv.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];
const model = arg("model") ?? "gemini-2.5-pro-tts";
const voices = process.argv.slice(2).filter((a) => !a.startsWith("--"));
if (!voices.length) throw new Error("Name at least one voice, e.g. Enceladus");

const fromFile = existsSync(".env.local") ? readFileSync(".env.local", "utf8").match(/^GCP_PROJECT_ID=(.+)$/m)?.[1].trim() : undefined;
const project = process.env.GCP_PROJECT_ID || fromFile || "nascar-auto";

// Calm and close, but at a natural pace: earlier tests showed "slow" makes Gemini drag.
const STYLE =
  "Read the following Scripture aloud for someone settling down to sleep. Speak gently and warmly, close to the microphone, " +
  "at a calm, natural reading pace: unhurried, but never slow or dragged. Keep an even, quiet volume and never sound dramatic. " +
  "Take one relaxed breath between verses, and let each verse end softly.";
const TEXT = SLEEP_GENESIS_1.verses
  .slice(0, 5)
  .map((v) => v.text)
  .join("\n\n");
const RATE = 24000;

async function main() {
  const token = (await (await new GoogleAuth({ scopes: ["https://www.googleapis.com/auth/cloud-platform"] }).getClient()).getAccessToken()).token;
  const url = `https://aiplatform.googleapis.com/v1/projects/${project}/locations/global/publishers/google/models/${model}:generateContent`;
  mkdirSync("voice-samples", { recursive: true });

  for (const voice of voices) {
    const body = JSON.stringify({
      contents: [{ role: "user", parts: [{ text: `${STYLE}\n\n${TEXT}` }] }],
      generationConfig: { responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } } },
    });
    // Slow connections drop requests now and then: try a few times before giving up on a voice.
    let res: Response | undefined;
    for (let attempt = 1; attempt <= 4 && !res; attempt++) {
      try {
        // A hung request otherwise waits forever: give each attempt two minutes.
        res = await fetch(url, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body,
          signal: AbortSignal.timeout(120_000),
        });
      } catch (e) {
        console.log(`${voice}: network error (${e instanceof Error ? e.message : e}), retry ${attempt}/4`);
        await new Promise((r) => setTimeout(r, 3000 * attempt));
      }
    }
    if (!res) continue;
    const json = await res.json();
    const data = json?.candidates?.[0]?.content?.parts?.find((p: { inlineData?: { data: string } }) => p.inlineData)?.inlineData?.data;
    if (!res.ok || !data) {
      console.log(`${voice}: failed ${res.status} ${JSON.stringify(json.error?.message ?? json).slice(0, 160)}`);
      continue;
    }
    // Two seconds of quiet first, like the chapters; then the warm Sleep finish.
    const pcm = Buffer.concat([Buffer.alloc(RATE * 2 * 2), Buffer.from(data, "base64")]);
    const raw = join("voice-samples", `tmp-${voice}.pcm`);
    const out = join("voice-samples", `sleep-${model.replace("gemini-2.5-", "").replace("-tts", "")}-${voice}.mp3`);
    writeFileSync(raw, pcm);
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-f", "s16le", "-ar", String(RATE), "-ac", "1", "-i", raw, "-af", FINISH, "-codec:a", "libmp3lame", "-b:a", "64k", out]);
    rmSync(raw);
    console.log(`${voice}: ${(pcm.length / (RATE * 2)).toFixed(1)}s → ${out}`);
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
