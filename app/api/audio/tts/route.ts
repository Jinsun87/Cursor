import { NextRequest, NextResponse } from "next/server";
import { DAILY_LISTEN_TRACKS } from "@/components/home/DailyListens";

// Standard ElevenLabs Voices
const ELEVENLABS_VOICES = {
  adam: "pNInz6obpgDQGcFmaJgB", // Warm, deep American podcaster / narrator
  george: "JBFqnCBsd6RMkjVDRZzb", // Contemplative, warm British/transatlantic elder
  antoni: "ErXwobaYiN019PkySvjV", // Friendly, crisp conversational
  will: "bIHbv24MWmeRgasZH58o", // Relaxed casual podcast
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const trackId = searchParams.get("trackId") || "spark";
  const provider = searchParams.get("provider") || "openai";
  const voice = searchParams.get("voice");

  const track = DAILY_LISTEN_TRACKS.find((t) => t.id === trackId);
  if (!track) {
    return NextResponse.json({ error: "Track not found" }, { status: 404 });
  }

  const text = track.conversationalTalk;

  // 1. OPENAI TTS-1-HD
  if (provider === "openai") {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error: "OPENAI_API_KEY is not configured.",
          hint: "Add OPENAI_API_KEY to your .env.local file.",
        },
        { status: 400 },
      );
    }

    try {
      const response = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "tts-1-hd",
          voice: voice || "onyx", // onyx is the deep, warm baritone podcast voice
          input: text,
          response_format: "mp3",
          speed: 0.95,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json(
          { error: "OpenAI TTS error", details: errorText },
          { status: response.status },
        );
      }

      const audioBuffer = await response.arrayBuffer();
      return new NextResponse(audioBuffer, {
        headers: {
          "Content-Type": "audio/mpeg",
          "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        },
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Internal error";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  // 2. ELEVENLABS MULTILINGUAL V2
  if (provider === "elevenlabs") {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error: "ELEVENLABS_API_KEY is not configured.",
          hint: "Add ELEVENLABS_API_KEY to your .env.local file.",
        },
        { status: 400 },
      );
    }

    const voiceId =
      voice && voice in ELEVENLABS_VOICES
        ? ELEVENLABS_VOICES[voice as keyof typeof ELEVENLABS_VOICES]
        : voice || ELEVENLABS_VOICES.adam;

    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
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
              stability: 0.5,
              similarity_boost: 0.8,
              style: 0.15,
              use_speaker_boost: true,
            },
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json(
          { error: "ElevenLabs error", details: errorText },
          { status: response.status },
        );
      }

      const audioBuffer = await response.arrayBuffer();
      return new NextResponse(audioBuffer, {
        headers: {
          "Content-Type": "audio/mpeg",
          "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        },
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Internal error";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Invalid provider specified" }, { status: 400 });
}
