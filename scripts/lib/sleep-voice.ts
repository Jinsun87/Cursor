/**
 * Narration for one chapter, one request per passage so the voice keeps one
 * breath and tone. Sleep: gpt-4o-mini-tts (onyx) with bedtime delivery
 * instructions and a warm, soft finish. Walk: Google Gemini TTS (Iapetus) at a
 * brisk audiobook pace with a bright finish. Verse start times come from a
 * word-timestamped transcript, matched to each verse's opening words.
 *
 * Needs OPENAI_API_KEY in .env.local, the Google Cloud login for Walk
 * (gcloud auth application-default login) and ffmpeg/ffprobe on the PATH.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { GoogleAuth } from "google-auth-library";

export type VoiceVerse = { n: number; text: string; heading?: string };

const INSTRUCTIONS =
  "Voice: low, warm and unhurried, like a calm elder reading Scripture aloud to someone falling asleep. " +
  "Tone: soothing and reverent, never dramatic, no performance. " +
  "Pacing: slow and even, with a long natural pause between verses. " +
  "Let the end of every verse settle and fall softly, as if trailing toward rest.";
const LEAD_SECONDS = 2;
const SECTION_GAP_SECONDS = 2.4;
const MAX_PASSAGE_CHARS = 2400; // well inside the speech API's input limit
const RATE = 24000; // OpenAI "pcm": 24 kHz, 16-bit, mono
// Warm and soft: trim the highs, dip the 3.5 kHz band where harshness lives, add a little body.
export const FINISH =
  "highpass=f=70,lowpass=f=6500,equalizer=f=3500:t=q:w=1.2:g=-4,equalizer=f=180:t=q:w=1:g=2," +
  "loudnorm=I=-16:TP=-1.5:LRA=7";

/** Walk, for daylight: a clear male voice at a lively audiobook pace. */
export const WALK_PROMPT =
  "You are a clear, warm narrator reading the Bible aloud for a morning walk. " +
  "Read at a lively, confident audiobook pace, a little quicker than conversation, with energy and warmth. " +
  "Sound awake and engaged but never theatrical or preachy. Keep an even volume, and move from verse to verse with only a short breath.";
// Daytime: keep the voice bright (no warm EQ), just clean up and level it.
export const DAY_FINISH = "highpass=f=70,loudnorm=I=-16:TP=-1.5:LRA=7";
const WALK_GAP_SECONDS = 1.2;

/** Google Cloud project for Gemini TTS: GCP_PROJECT_ID, else the one the paintings use. */
function googleProject(): string {
  const fromFile = existsSync(".env.local")
    ? readFileSync(".env.local", "utf8").match(/^GCP_PROJECT_ID=(.+)$/m)?.[1].trim()
    : undefined;
  return process.env.GCP_PROJECT_ID || fromFile || "nascar-auto";
}

async function geminiSpeak(text: string, voice: string): Promise<Buffer> {
  const auth = new GoogleAuth({ scopes: ["https://www.googleapis.com/auth/cloud-platform"] });
  const token = (await (await auth.getClient()).getAccessToken()).token;
  if (!token) throw new Error("No Google Cloud access token; run gcloud auth application-default login");
  const res = await post("https://texttospeech.googleapis.com/v1/text:synthesize", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "x-goog-user-project": googleProject(), "Content-Type": "application/json" },
    body: JSON.stringify({
      input: { text, prompt: WALK_PROMPT },
      voice: { languageCode: "en-US", name: voice, modelName: "gemini-2.5-flash-tts" },
      audioConfig: { audioEncoding: "LINEAR16", sampleRateHertz: RATE },
    }),
  });
  return Buffer.from((await res.json()).audioContent, "base64").subarray(44); // drop the WAV header
}

function openAiKey(): string {
  // .env.local wins over any OPENAI_API_KEY already set in the shell.
  const fileKey = existsSync(".env.local")
    ? readFileSync(".env.local", "utf8").match(/^OPENAI_API_KEY=(.+)$/m)?.[1].trim()
    : undefined;
  const key = fileKey ?? process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is missing from .env.local");
  return key;
}

async function post(url: string, init: RequestInit): Promise<Response> {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(url, init);
    if (res.ok) return res;
    if (attempt >= 3 || res.status < 500) throw new Error(`${res.status}: ${await res.text()}`);
  }
}

const silence = (seconds: number) => Buffer.alloc(Math.round(seconds * RATE) * 2);
const words = (s: string) => s.toLowerCase().replace(/[^a-z\s']/g, " ").split(/\s+/).filter(Boolean);
const ff = (args: string[]) => execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...args], { stdio: "inherit" });

/** Passages: a new one at every heading, and long ones split at a verse boundary. */
export function passages(verses: VoiceVerse[]): VoiceVerse[][] {
  const out: VoiceVerse[][] = [];
  let size = 0;
  for (const v of verses) {
    if (!out.length || v.heading || size + v.text.length > MAX_PASSAGE_CHARS) {
      out.push([]);
      size = 0;
    }
    out[out.length - 1].push(v);
    size += v.text.length;
  }
  return out;
}

/**
 * Voices a chapter into <outDir>/chapter.mp3 and <outDir>/timing.json.
 * With `plain`, skips the speech API and re-finishes and re-times that take.
 * Returns the length in seconds and how many verse starts had to be estimated.
 */
export async function voiceChapter(
  verses: VoiceVerse[],
  outDir: string,
  opts: { mode?: "sleep" | "walk"; voice?: string; plain?: string; keepPlain?: boolean; label?: string } = {},
): Promise<{ duration: number; missed: number }> {
  const key = openAiKey();
  const walk = opts.mode === "walk";
  const voice = opts.voice ?? (walk ? "Iapetus" : "onyx");
  const gap = walk ? WALK_GAP_SECONDS : SECTION_GAP_SECONDS;
  const work = join(tmpdir(), `sleep-voice-${Date.now()}`);
  mkdirSync(work, { recursive: true });
  mkdirSync(outDir, { recursive: true });

  let plain = opts.plain ?? "";
  let duration = 0;
  if (plain) {
    duration = Number(
      execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", plain], { encoding: "utf8" }).trim(),
    );
  } else {
    const parts: Buffer[] = [silence(LEAD_SECONDS)];
    const list = passages(verses);
    for (const [i, passage] of list.entries()) {
      const text = passage.map((v) => v.text).join("\n\n");
      if (walk) {
        parts.push(await geminiSpeak(text, voice), silence(gap));
      } else {
        const res = await post("https://api.openai.com/v1/audio/speech", {
          method: "POST",
          headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify({ model: "gpt-4o-mini-tts", voice, input: text, instructions: INSTRUCTIONS, response_format: "pcm" }),
        });
        parts.push(Buffer.from(await res.arrayBuffer()), silence(gap));
      }
      process.stdout.write(`\r  ${opts.label ?? ""} passage ${i + 1}/${list.length}   `);
    }
    const raw = join(work, "raw.pcm");
    plain = join(work, "plain.mp3");
    const all = Buffer.concat(parts);
    writeFileSync(raw, all);
    ff(["-f", "s16le", "-ar", String(RATE), "-ac", "1", "-i", raw, "-codec:a", "libmp3lame", "-b:a", "64k", plain]);
    duration = all.length / (RATE * 2);
  }

  // Word timestamps → verse start times.
  const form = new FormData();
  form.append("file", new Blob([readFileSync(plain)], { type: "audio/mpeg" }), "chapter.mp3");
  form.append("model", "whisper-1");
  form.append("response_format", "verbose_json");
  form.append("timestamp_granularities[]", "word");
  const tr = await (
    await post("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}` },
      body: form,
    })
  ).json();
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
  for (const v of verses) {
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
    // Never step backwards, even when a verse had to be estimated.
    lastStart = Math.max(heard[at].start, lastStart + 0.5);
    timing[String(v.n)] = Math.round(lastStart * 100) / 100;
    cursor = at + toks.length;
  }

  duration = Math.round(duration * 100) / 100;
  if (opts.keepPlain && !opts.plain) writeFileSync(join(outDir, "plain.mp3"), readFileSync(plain));
  ff(["-i", plain, "-af", walk ? DAY_FINISH : FINISH, "-codec:a", "libmp3lame", "-b:a", "64k", join(outDir, "chapter.mp3")]);
  writeFileSync(join(outDir, "timing.json"), JSON.stringify({ duration, verses: timing }, null, 2) + "\n");
  rmSync(work, { recursive: true, force: true });
  return { duration, missed };
}
