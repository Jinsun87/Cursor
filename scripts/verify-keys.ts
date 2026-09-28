import fs from "fs";
import path from "path";

// Load .env.local manually if running in tsx
function loadEnv() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key, ...rest] = trimmed.split("=");
    if (key && rest.length > 0) {
      const val = rest.join("=").trim().replace(/^["']|["']$/g, "");
      process.env[key.trim()] = val;
    }
  }
}

loadEnv();

async function verifyOpenAI(): Promise<boolean> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    console.log("❌ OpenAI: OPENAI_API_KEY is not found in .env.local");
    return false;
  }

  const masked = key.slice(0, 7) + "..." + key.slice(-4);
  console.log(`🔍 Testing OpenAI key (${masked})...`);

  // First try tts-1-hd
  try {
    let res = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "tts-1-hd",
        voice: "onyx",
        input: "Grace and peace to you.",
        response_format: "mp3",
      }),
    });

    if (res.ok) {
      console.log("✅ OpenAI TTS-1-HD: Model access is active and working!");
      return true;
    }

    const errHd = await res.json().catch(() => null);

    // If tts-1-hd is not permitted on this project, test standard tts-1
    if (errHd?.error?.code === "model_not_found" || res.status === 403) {
      console.log("ℹ️ tts-1-hd not enabled on this project key. Testing standard tts-1...");
      const resStandard = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "tts-1",
          voice: "onyx",
          input: "Grace and peace to you.",
          response_format: "mp3",
        }),
      });

      if (resStandard.ok) {
        console.log("✅ OpenAI TTS-1 (Standard): Key is VALID and working!");
        console.log("👉 Tip: To use tts-1-hd, enable the model under Project Settings > Models in platform.openai.com");
        return true;
      } else {
        const errStd = await resStandard.text();
        console.error(`❌ OpenAI TTS-1 failed (${resStandard.status}):`, errStd);
        return false;
      }
    } else {
      console.error(`❌ OpenAI failed (${res.status}):`, JSON.stringify(errHd, null, 2));
      return false;
    }
  } catch (err: any) {
    console.error("❌ OpenAI connection error:", err.message);
    return false;
  }
}

async function verifyElevenLabs(): Promise<boolean> {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) {
    console.log("❌ ElevenLabs: ELEVENLABS_API_KEY is not found in .env.local");
    return false;
  }

  const masked = key.slice(0, 5) + "..." + key.slice(-4);
  console.log(`🔍 Testing ElevenLabs key (${masked}) with direct TTS call...`);

  try {
    // Perform a 1-word TTS call directly
    const res = await fetch("https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB?output_format=mp3_44100_128", {
      method: "POST",
      headers: {
        "xi-api-key": key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: "Peace.",
        model_id: "eleven_multilingual_v2",
      }),
    });

    if (res.ok) {
      const buffer = await res.arrayBuffer();
      console.log(`✅ ElevenLabs: Key is VALID and generated ${buffer.byteLength} bytes of audio!`);
      return true;
    } else {
      const err = await res.text();
      console.error(`❌ ElevenLabs TTS failed (${res.status}):`, err);
      return false;
    }
  } catch (err: any) {
    console.error("❌ ElevenLabs connection error:", err.message);
    return false;
  }
}

async function main() {
  console.log("==========================================");
  console.log("🔑 Verifying Audio Provider API Keys");
  console.log("==========================================\n");

  const openaiOk = await verifyOpenAI();
  console.log("");
  const elevenOk = await verifyElevenLabs();

  console.log("\n==========================================");
  if (openaiOk && elevenOk) {
    console.log("🎉 ALL KEYS VERIFIED! Ready for generation.");
  } else {
    console.log("⚠️ One or more keys need attention.");
  }
  console.log("==========================================");
}

main();
