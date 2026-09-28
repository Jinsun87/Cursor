import fs from "fs";
import path from "path";
import { DAILY_LISTEN_TRACKS } from "../components/home/DailyListens";

// Voice configurations
const OPENAI_VOICE = "onyx"; // Deep, warm studio baritone podcast tone
const ELEVENLABS_VOICE_ID = "pNInz6obpgDQGcFmaJgB"; // Adam - deep, warm, conversational American host

async function generateOpenAIAudio(text: string, apiKey: string): Promise<Buffer> {
  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "tts-1-hd",
      voice: OPENAI_VOICE,
      input: text,
      response_format: "mp3",
      speed: 0.95,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI TTS error (${response.status}): ${err}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function generateElevenLabsAudio(text: string, apiKey: string): Promise<Buffer> {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.45,
          similarity_boost: 0.85,
          style: 0.2,
          use_speaker_boost: true,
        },
      }),
    },
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`ElevenLabs error (${response.status}): ${err}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function main() {
  console.log("🎙️ Lampstand Daily Listens Audio Generator\n");

  const openAiKey = process.env.OPENAI_API_KEY;
  const elevenLabsKey = process.env.ELEVENLABS_API_KEY;

  const outputDir = path.join(process.cwd(), "public", "audio", "daily-listens");
  fs.mkdirSync(outputDir, { recursive: true });

  for (const track of DAILY_LISTEN_TRACKS) {
    const targetFile = path.join(outputDir, `${track.id}.mp3`);
    console.log(`\n========================================`);
    console.log(`Track: ${track.title} (${track.category})`);
    console.log(`Target: public/audio/daily-listens/${track.id}.mp3`);

    if (track.id === "spark" || track.id === "prayer") {
      // 1 min and 2 min: OpenAI TTS-1-HD
      console.log(`Provider: OpenAI TTS-1-HD (Voice: ${OPENAI_VOICE})`);
      if (!openAiKey) {
        console.warn(`⚠️ Skipped: OPENAI_API_KEY is not set in environment or .env.local`);
        continue;
      }

      try {
        console.log(`Generating with OpenAI TTS-1-HD...`);
        const buffer = await generateOpenAIAudio(track.conversationalTalk, openAiKey);
        fs.writeFileSync(targetFile, buffer);
        console.log(`✅ Saved ${targetFile} (${(buffer.length / 1024).toFixed(1)} KB)`);
      } catch (err: any) {
        console.error(`❌ Failed:`, err.message);
      }
    } else if (track.id === "wisdom") {
      // 4 min: ElevenLabs Multilingual v2
      console.log(`Provider: ElevenLabs Multilingual v2 (Voice: Adam / ${ELEVENLABS_VOICE_ID})`);
      if (!elevenLabsKey) {
        console.warn(`⚠️ Skipped: ELEVENLABS_API_KEY is not set in environment or .env.local`);
        continue;
      }

      try {
        console.log(`Generating with ElevenLabs Multilingual v2...`);
        const buffer = await generateElevenLabsAudio(track.conversationalTalk, elevenLabsKey);
        fs.writeFileSync(targetFile, buffer);
        console.log(`✅ Saved ${targetFile} (${(buffer.length / 1024).toFixed(1)} KB)`);
      } catch (err: any) {
        console.error(`❌ Failed:`, err.message);
      }
    }
  }

  console.log(`\n🎉 Daily listens generation process complete.`);
}

main().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
