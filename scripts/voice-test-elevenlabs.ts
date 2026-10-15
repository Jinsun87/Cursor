/**
 * Listening test for the Sleep voice on ElevenLabs: Genesis 1:1-5 and 1:6-8 as
 * two requests joined with the chapter gap (as chapters are built), using
 * ElevenLabs' continuity (previous/next text and the previous request id) so
 * the tone carries across the join. Warm Sleep finish, same as the others.
 *
 *   npx tsx scripts/voice-test-elevenlabs.ts <voiceId> [--models=eleven_multilingual_v2,eleven_flash_v2_5] [--speed=1.0]
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { SLEEP_GENESIS_1 } from "../lib/sleep/genesis-1";
import { FINISH } from "./lib/sleep-voice";

const voiceId = process.argv[2];
if (!voiceId || voiceId.startsWith("--")) throw new Error("Usage: voice-test-elevenlabs.ts <voiceId>");
const models = (process.argv.find((a) => a.startsWith("--models="))?.split("=")[1] ?? "eleven_multilingual_v2,eleven_flash_v2_5").split(",");
const key =
  (existsSync(".env.local") ? readFileSync(".env.local", "utf8").match(/^ELEVENLABS_API_KEY=(.+)$/m)?.[1].trim() : undefined) ??
  process.env.ELEVENLABS_API_KEY;
if (!key) throw new Error("ELEVENLABS_API_KEY is missing from .env.local");

const RATE = 24000;
const silence = (s: number) => Buffer.alloc(Math.round(s * RATE) * 2);
const text = (from: number, to: number) =>
  SLEEP_GENESIS_1.verses
    .filter((v) => v.n >= from && v.n <= to)
    .map((v) => v.text)
    .join("\n\n");

// Calm and even: high stability keeps the delivery steady; no added style exaggeration.
const speed = Number(process.argv.find((a) => a.startsWith("--speed="))?.split("=")[1] ?? 0.95);
const VOICE_SETTINGS = { stability: 0.65, similarity_boost: 0.8, style: 0, use_speaker_boost: true, speed };

async function speak(model: string, body: Record<string, unknown>): Promise<{ pcm: Buffer; requestId: string | null }> {
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=pcm_24000`, {
        method: "POST",
        headers: { "xi-api-key": key!, "Content-Type": "application/json", Accept: "audio/pcm" },
        body: JSON.stringify({ model_id: model, voice_settings: VOICE_SETTINGS, ...body }),
        signal: AbortSignal.timeout(120_000),
      });
      if (!res.ok) throw new Error(`${res.status}: ${(await res.text()).slice(0, 300)}`);
      return { pcm: Buffer.from(await res.arrayBuffer()), requestId: res.headers.get("request-id") };
    } catch (e) {
      if (attempt >= 3) throw e;
      await new Promise((r) => setTimeout(r, 3000 * attempt));
    }
  }
}

async function main() {
  const info = await (await fetch(`https://api.elevenlabs.io/v1/voices/${voiceId}`, { headers: { "xi-api-key": key! } })).json();
  const name = String(info.name ?? voiceId).replace(/[^\w-]+/g, "-");
  console.log(`voice: ${info.name ?? "?"} (${[info.labels?.gender, info.labels?.accent, info.labels?.description ?? info.labels?.descriptive, info.labels?.use_case].filter(Boolean).join(", ")})`);
  mkdirSync("voice-samples", { recursive: true });

  for (const model of models) {
    try {
      const a = text(1, 5);
      const b = text(6, 8);
      const first = await speak(model, { text: a, next_text: b });
      const second = await speak(model, {
        text: b,
        previous_text: a,
        ...(first.requestId ? { previous_request_ids: [first.requestId] } : {}),
      });
      const pcm = Buffer.concat([silence(2), first.pcm, silence(2.4), second.pcm]);
      const raw = join("voice-samples", `tmp-el-${model}.pcm`);
      const out = join("voice-samples", `sleep-elevenlabs-${name}-${model.replace("eleven_", "")}-x${speed}.mp3`);
      writeFileSync(raw, pcm);
      execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-f", "s16le", "-ar", String(RATE), "-ac", "1", "-i", raw, "-af", FINISH, "-codec:a", "libmp3lame", "-b:a", "64k", out]);
      rmSync(raw);
      console.log(`${model}: ${(pcm.length / (RATE * 2)).toFixed(0)}s, join at ~${(2 + first.pcm.length / (RATE * 2) + 1.2).toFixed(0)}s, continuity: ${first.requestId ? "previous request linked" : "text only"} → ${out}`);
    } catch (e) {
      console.log(`${model}: failed (${e instanceof Error ? e.message : e})`);
    }
  }
  const sub = await (await fetch("https://api.elevenlabs.io/v1/user/subscription", { headers: { "xi-api-key": key! } })).json().catch(() => ({}));
  if (sub.character_limit) console.log(`credits used: ${sub.character_count} of ${sub.character_limit}`);
}

main();
