/**
 * Narration for one chapter, one request per passage so the voice keeps one
 * breath and tone. Sleep: ElevenLabs Flash (Theo Silk) with continuity between passages and
 * a warm, soft finish (OpenAI onyx and Gemini voices on Vertex AI can still be tried
 * via --voice). Walk: Gemini Flash TTS (Iapetus) at a brisk
 * audiobook pace with a bright finish. Verse start times come from a
 * word-timestamped transcript, matched to each verse's opening words.
 *
 * Needs OPENAI_API_KEY in .env.local (verse timing), the Google Cloud login
 * (gcloud auth application-default login) and ffmpeg/ffprobe on the PATH.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { GoogleAuth } from "google-auth-library";
import { alignVerses } from "../../lib/sleep/align";
import { checkCoverage, spokenWords, type CoverageIssue } from "../../lib/sleep/coverage";

export type VoiceVerse = { n: number; text: string; heading?: string };

const INSTRUCTIONS =
  "Voice: low, warm and unhurried, like a calm elder reading Scripture aloud to someone falling asleep. " +
  "Tone: soothing and reverent, never dramatic, no performance. " +
  "Pacing: slow and even, with a long natural pause between verses. " +
  "Let the end of every verse settle and fall softly, as if trailing toward rest.";
/**
 * Sleep voice, chosen 2026-10-15: Theo Silk ("British Deep Sleep & Calm") on
 * ElevenLabs Flash v2.5 at 1.0x, each passage linked to its neighbours so the
 * tone carries across joins. Gemini voices were dropped on 2026-10-14 (tone
 * shifts between requests and after pauses); OpenAI voices such as onyx still
 * work via --voice=onyx.
 */
export const SLEEP_VOICE = "elevenlabs:UmQN7jS1Ee8B1czsUtQh";
const ELEVEN_MODEL = "eleven_flash_v2_5";
// High stability keeps the delivery even; no style exaggeration; normal speed.
const ELEVEN_SETTINGS = { stability: 0.65, similarity_boost: 0.8, style: 0, use_speaker_boost: true, speed: 1.0 };
const SLEEP_MODEL = "gemini-2.5-pro-tts";
// Calm and close, but at a natural pace: "slow" makes Gemini drag.
export const SLEEP_STYLE =
  "Read the following Scripture aloud for someone settling down to sleep. Speak gently and warmly, close to the microphone, " +
  "at a calm, natural reading pace: unhurried, but never slow or dragged. Keep an even, quiet volume and never sound dramatic. " +
  "Take one relaxed breath between verses, and let each verse end softly. " +
  "Keep exactly the same voice, pitch, warmth and pace from the first word to the last, as one continuous reading.";
const OPENAI_VOICES = new Set(["alloy", "ash", "ballad", "coral", "echo", "fable", "nova", "onyx", "sage", "shimmer", "verse"]);
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
  const token = await googleToken();
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

async function googleToken(): Promise<string> {
  const auth = new GoogleAuth({ scopes: ["https://www.googleapis.com/auth/cloud-platform"] });
  const token = (await (await auth.getClient()).getAccessToken()).token;
  if (!token) throw new Error("No Google Cloud access token; run gcloud auth application-default login");
  return token;
}

/** Sleep: Gemini Pro TTS on Vertex AI. Returns 24 kHz 16-bit mono PCM. */
async function vertexSpeak(text: string, voice: string): Promise<Buffer> {
  const url = `https://aiplatform.googleapis.com/v1/projects/${googleProject()}/locations/global/publishers/google/models/${SLEEP_MODEL}:generateContent`;
  const res = await post(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${await googleToken()}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: `${SLEEP_STYLE}

${text}` }] }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        // Each passage is its own request; a low temperature and a fixed seed keep the
        // delivery the same from passage to passage instead of drifting every minute.
        temperature: 0.3,
        seed: 1105,
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } },
      },
    }),
  });
  const json = await res.json();
  const data = json?.candidates?.[0]?.content?.parts?.find((p: { inlineData?: { data: string } }) => p.inlineData)?.inlineData?.data;
  if (!data) throw new Error(`Vertex returned no audio: ${JSON.stringify(json).slice(0, 200)}`);
  return softenEdges(Buffer.from(data, "base64"));
}

/**
 * Gemini stops the audio the instant the last word ends, which sounds like a
 * cut. Fade the last 0.3 s and add 0.4 s of quiet, and ease in the first
 * 0.05 s, so each passage settles like a breath instead of stopping dead.
 */
export function softenEdges(pcm: Buffer): Buffer {
  const samples = new Int16Array(pcm.buffer.slice(pcm.byteOffset, pcm.byteOffset + pcm.length - (pcm.length % 2)));
  const fadeOut = Math.min(samples.length, Math.round(RATE * 0.3));
  const fadeIn = Math.min(samples.length, Math.round(RATE * 0.05));
  for (let i = 0; i < fadeIn; i++) samples[i] = Math.round(samples[i] * (i / fadeIn));
  for (let i = 0; i < fadeOut; i++) {
    const k = samples.length - fadeOut + i;
    samples[k] = Math.round(samples[k] * (1 - i / fadeOut) ** 2);
  }
  return Buffer.concat([Buffer.from(samples.buffer), Buffer.alloc(Math.round(RATE * 0.4) * 2)]);
}

/**
 * Sleep: ElevenLabs. Each passage is told what came before and after it, and
 * linked to the previous requests, so the voice keeps one tone across joins.
 * Returns 24 kHz 16-bit mono PCM.
 */
async function elevenSpeak(
  voiceId: string,
  text: string,
  ctx: { previousText?: string; nextText?: string; previousRequestIds?: string[] },
): Promise<{ pcm: Buffer; requestId: string | null }> {
  const fromFile = existsSync(".env.local")
    ? readFileSync(".env.local", "utf8").match(/^ELEVENLABS_API_KEY=(.+)$/m)?.[1].trim()
    : undefined;
  const key = fromFile ?? process.env.ELEVENLABS_API_KEY;
  if (!key) throw new Error("ELEVENLABS_API_KEY is missing from .env.local");
  const res = await post(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=pcm_24000`, {
    method: "POST",
    headers: { "xi-api-key": key, "Content-Type": "application/json", Accept: "audio/pcm" },
    body: JSON.stringify({
      text,
      model_id: ELEVEN_MODEL,
      voice_settings: ELEVEN_SETTINGS,
      // The API caps context; the last few thousand characters are what matter for continuity.
      ...(ctx.previousText ? { previous_text: ctx.previousText.slice(-3000) } : {}),
      ...(ctx.nextText ? { next_text: ctx.nextText.slice(0, 3000) } : {}),
      ...(ctx.previousRequestIds?.length ? { previous_request_ids: ctx.previousRequestIds } : {}),
    }),
  });
  return { pcm: Buffer.from(await res.arrayBuffer()), requestId: res.headers.get("request-id") };
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

/** Whisper's word-by-word transcript of an MP3, with each word's start time. */
export async function transcribe(mp3: string): Promise<{ word: string; start: number }[]> {
  const form = new FormData();
  form.append("file", new Blob([readFileSync(mp3)], { type: "audio/mpeg" }), "chapter.mp3");
  form.append("model", "whisper-1");
  form.append("response_format", "verbose_json");
  form.append("timestamp_granularities[]", "word");
  const res = await post("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${openAiKey()}` },
    body: form,
  });
  return (await res.json()).words;
}

/**
 * Whisper sometimes drops words from a long recording, especially in repetitive passages,
 * so a "skipped" flag is checked again on a short clip around it (transcribed on its own,
 * which is far more reliable). True when the words really are missing from the audio.
 */
export async function confirmSkipped(mp3: string, at: number, words: string): Promise<boolean> {
  const clip = join(tmpdir(), `skip-check-${Date.now()}-${Math.round(at)}.mp3`);
  try {
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-ss", String(Math.max(0, at - 15)), "-t", "50", "-i", mp3, "-c:a", "libmp3lame", "-b:a", "64k", clip]);
    const heard = ` ${(await transcribe(clip)).flatMap((w) => spokenWords(w.word)).join(" ")} `;
    return !heard.includes(` ${spokenWords(words).join(" ")} `);
  } catch {
    return true; // could not check: keep the flag
  } finally {
    rmSync(clip, { force: true });
  }
}

/** POST with a 2-minute limit per try; retries dropped connections and server errors. */
async function post(url: string, init: RequestInit): Promise<Response> {
  for (let attempt = 1; ; attempt++) {
    let res: Response;
    try {
      res = await fetch(url, { ...init, signal: AbortSignal.timeout(120_000) });
    } catch (e) {
      if (attempt >= 4) throw e;
      await new Promise((r) => setTimeout(r, 3000 * attempt));
      continue;
    }
    if (res.ok) return res;
    if (attempt >= 4 || (res.status < 500 && res.status !== 429)) throw new Error(`${res.status}: ${await res.text()}`);
    await new Promise((r) => setTimeout(r, (res.status === 429 ? 15000 : 3000) * attempt));
  }
}

const silence = (seconds: number) => Buffer.alloc(Math.round(seconds * RATE) * 2);
const ff = (args: string[]) => execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...args], { stdio: "inherit" });

/** Passages: a new one at every heading, and long ones split at a verse boundary. */
export function passages(verses: VoiceVerse[], max = MAX_PASSAGE_CHARS): VoiceVerse[][] {
  const out: VoiceVerse[][] = [];
  let size = 0;
  for (const v of verses) {
    if (!out.length || v.heading || size + v.text.length > max) {
      out.push([]);
      size = 0;
    }
    out[out.length - 1].push(v);
    size += v.text.length;
  }
  return out;
}

/** Where a recording's Whisper transcript is kept (git-ignored), for the word check in scripts/qc-sleep.ts. */
export const transcriptPath = (mode: "sleep" | "walk", slug: string) => join("voice-transcripts", mode, `${slug}.json`);

/** Where a new take waits (git-ignored) until it has been timed, so a failure after the speech API is not paid for twice. */
export const takePath = (mode: "sleep" | "walk", slug: string) => join("voice-transcripts", mode, `${slug}.take.mp3`);

/**
 * Voices a chapter into <outDir>/chapter.mp3 and <outDir>/timing.json.
 * With `plain`, skips the speech API and re-finishes and re-times that take.
 * With `takeFile`, the new take is saved there before timing and reused if a run stopped after it.
 * Returns the length in seconds, how many verse starts had to be estimated, and any words
 * skipped or added (see lib/sleep/coverage.ts).
 */
export async function voiceChapter(
  verses: VoiceVerse[],
  outDir: string,
  opts: {
    mode?: "sleep" | "walk";
    voice?: string;
    plain?: string;
    keepPlain?: boolean;
    label?: string;
    transcriptFile?: string;
    takeFile?: string;
    /** Shorter passages help a voice that loses its place in repetitive text (genealogies). */
    maxPassage?: number;
  } = {},
): Promise<{ duration: number; missed: number; issues: CoverageIssue[] }> {
  const key = openAiKey();
  const walk = opts.mode === "walk";
  const voice = opts.voice ?? (walk ? "Iapetus" : SLEEP_VOICE);
  const gap = walk ? WALK_GAP_SECONDS : SECTION_GAP_SECONDS;
  const work = join(tmpdir(), `sleep-voice-${Date.now()}`);
  mkdirSync(work, { recursive: true });
  mkdirSync(outDir, { recursive: true });

  // A take made by a run that stopped before timing it: use it rather than paying for another.
  const resumed = !opts.plain && opts.takeFile && existsSync(opts.takeFile) ? opts.takeFile : "";
  if (resumed) process.stdout.write(`  ${opts.label ?? ""} reusing the take saved before timing   `);
  let plain = opts.plain ?? resumed;
  let duration = 0;
  if (plain) {
    duration = Number(
      execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", plain], { encoding: "utf8" }).trim(),
    );
  } else {
    const parts: Buffer[] = [silence(LEAD_SECONDS)];
    const list = passages(verses, opts.maxPassage);
    const texts = list.map((p) => p.map((v) => v.text).join("\n\n"));
    const elevenIds: string[] = []; // request ids so far, for ElevenLabs continuity
    for (const [i, passage] of list.entries()) {
      const text = texts[i];
      if (walk) {
        parts.push(await geminiSpeak(text, voice), silence(gap));
      } else if (voice.startsWith("elevenlabs:")) {
        const spoken = await elevenSpeak(voice.slice("elevenlabs:".length), text, {
          previousText: texts.slice(0, i).join("\n\n") || undefined,
          nextText: texts[i + 1],
          previousRequestIds: elevenIds.slice(-3),
        });
        if (spoken.requestId) elevenIds.push(spoken.requestId);
        parts.push(spoken.pcm, silence(gap));
      } else if (!OPENAI_VOICES.has(voice)) {
        parts.push(await vertexSpeak(text, voice), silence(gap));
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
    if (opts.takeFile) {
      mkdirSync(dirname(opts.takeFile), { recursive: true });
      writeFileSync(opts.takeFile, readFileSync(plain));
    }
  }

  // Word timestamps → verse start times.
  const tr = { words: await transcribe(plain) };
  const { timing, missed } = alignVerses(verses, tr.words, duration);
  // Word for word: was every word of the text actually said?
  const flagged = checkCoverage(verses, tr.words, duration);
  // Before anyone pays to re-voice, make sure a "skipped" flag is not just Whisper missing words.
  const issues: CoverageIssue[] = [];
  for (const x of flagged) {
    if (x.kind === "skipped" && !(await confirmSkipped(plain, x.at, x.words))) issues.push({ ...x, kind: "unheard" });
    else issues.push(x);
  }
  if (opts.transcriptFile) {
    mkdirSync(dirname(opts.transcriptFile), { recursive: true });
    writeFileSync(opts.transcriptFile, JSON.stringify({ duration, words: tr.words }) + "\n");
  }

  duration = Math.round(duration * 100) / 100;
  if (opts.keepPlain && !opts.plain) writeFileSync(join(outDir, "plain.mp3"), readFileSync(plain));
  ff(["-i", plain, "-af", walk ? DAY_FINISH : FINISH, "-codec:a", "libmp3lame", "-b:a", "64k", join(outDir, "chapter.mp3")]);
  writeFileSync(join(outDir, "timing.json"), JSON.stringify({ duration, verses: timing }, null, 2) + "\n");
  rmSync(work, { recursive: true, force: true });
  if (opts.takeFile) rmSync(opts.takeFile, { force: true });
  return { duration, missed, issues };
}
