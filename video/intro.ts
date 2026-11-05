/**
 * The spoken opening of each long YouTube video: a welcome to tonight's reading, a short note about
 * Lampstand with a QR code on screen, then "Now, just breathe" and the first chapter.
 *
 * Narrated by ElevenLabs (Theo Silk, the Sleep voice) with character timestamps for the captions.
 * Cached in video/.work/intro/ by its words, so re-rendering the same video costs nothing.
 */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import QRCode from "qrcode";
import type { VideoIntro } from "./src/types";

const ROOT = resolve(__dirname, "..");
const CACHE = join(ROOT, "video", ".work", "intro");
const CLIPS = join(ROOT, "video", "assets", "intro");

const VOICE = "UmQN7jS1Ee8B1czsUtQh"; // Theo Silk, the app's Sleep voice
const MODEL = "eleven_multilingual_v2";
const SETTINGS = { stability: 0.6, similarity_boost: 0.8, style: 0.1, use_speaker_boost: true, speed: 0.95 };
const FINISH =
  "highpass=f=70,lowpass=f=6500,equalizer=f=3500:t=q:w=1.2:g=-4,equalizer=f=180:t=q:w=1:g=2,loudnorm=I=-16:TP=-1.5:LRA=7";

/** Where the QR code and the description link send people, tagged so sign-ups from YouTube can be counted. */
export const INTRO_LINK = "https://lampstandbible.com/?utm_source=youtube&utm_medium=video&utm_campaign=long-form-intro";

/** Played in turn behind the welcome, at a slower pace. */
const CLIP_FILES = ["scene5-window.mp4", "scene1-bedroom.mp4", "scene3-lake.mp4", "scene2-path.mp4", "scene4-lantern.mp4"];

/** The first sentence of the app note: the QR code appears as it is spoken. */
const NOTE_START = "Before we begin";

export type IntroFor =
  | { kind: "chapters"; mode: "sleep" | "walk"; book: string; from: number; to: number }
  | { kind: "story"; title: string; book: string }
  | { kind: "series"; book: string; count: number };

const NUMBERS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"];
const say = (n: number) => NUMBERS[n] ?? String(n);

export function introScript(v: IntroFor): string {
  const walk = v.kind === "chapters" && v.mode === "walk";
  const welcome =
    v.kind === "chapters"
      ? `${walk ? "Today" : "Tonight"}, ${v.book} ${v.from === v.to ? `chapter ${say(v.from)}` : `chapters ${say(v.from)} to ${say(v.to)}`}, read ${walk ? "aloud" : "softly"}, word for word. `
      : v.kind === "story"
        ? `Tonight's story is ${v.title}, from ${v.book}, told gently from Scripture. `
        : `Tonight, ${say(v.count)} stories from ${v.book}, told gently from Scripture, one after another. `;
  const settle = walk
    ? "Take it with you, on a walk, on the way to work, or wherever your day takes you. "
    : "You don't have to stay awake for any of it. The reading will carry on, gently, while you rest. ";
  const note =
    "Before we begin, a quiet word about where this reading comes from. " +
    "Lampstand is a Bible app made for moments like this one. Every chapter of the Bible, read aloud, with a painting for every passage. " +
    "A softer reading for sleep, with gentle rain and a sleep timer. And it keeps your place, so you can pick up right where you left off. " +
    "Genesis is free to hear, every chapter, and you can try everything free for seven days. " +
    "Open lampstandbible.com in your phone's browser, or scan the code on your screen. The link is below this video, too. " +
    "That's all. ";
  return welcome + settle + note + (walk ? "Now, let's begin." : "Now, just breathe.");
}

const spoken = (s: string) => s.replace(/lampstandbible\.com/g, "lampstandbible dot com");

function elevenKey(): string {
  const key = readFileSync(join(ROOT, ".env.local"), "utf8").match(/^ELEVENLABS_API_KEY=(.+)$/m)?.[1].trim();
  if (!key) throw new Error("ELEVENLABS_API_KEY is missing from .env.local");
  return key;
}

type Alignment = { characters: string[]; character_start_times_seconds: number[]; character_end_times_seconds: number[] };

/** Builds the intro into the render folder `work`: narration, captions, QR code and clips. */
export async function buildIntro(v: IntroFor, work: string): Promise<VideoIntro> {
  mkdirSync(CACHE, { recursive: true });
  const script = introScript(v);
  const text = spoken(script);
  const hash = createHash("sha1").update(`${VOICE}|${MODEL}|${JSON.stringify(SETTINGS)}|${text}`).digest("hex").slice(0, 12);
  const raw = join(CACHE, `${hash}-raw.mp3`);
  const timing = join(CACHE, `${hash}.json`);
  if (!existsSync(raw) || !existsSync(timing)) {
    console.log(`  intro: narrating (${text.length} characters)…`);
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}/with-timestamps?output_format=mp3_44100_128`, {
      method: "POST",
      headers: { "xi-api-key": elevenKey(), "Content-Type": "application/json" },
      body: JSON.stringify({ text, model_id: MODEL, voice_settings: SETTINGS }),
    });
    if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const body = (await res.json()) as { audio_base64: string; alignment: Alignment };
    writeFileSync(raw, Buffer.from(body.audio_base64, "base64"));
    writeFileSync(timing, JSON.stringify(body.alignment));
  }
  const alignment: Alignment = JSON.parse(readFileSync(timing, "utf8"));
  if (alignment.characters.join("") !== text) throw new Error("ElevenLabs timings do not match the intro script");

  // Caption words come from what was spoken, so "lampstandbible dot com" shows as the address.
  const lead = 1.0;
  const words = [...text.matchAll(/\S+/g)].map((m) => {
    const first = m.index!;
    const last = first + m[0].length - 1;
    return { text: m[0], start: alignment.character_start_times_seconds[first] + lead, end: alignment.character_end_times_seconds[last] + lead };
  });
  for (let i = 0; i < words.length - 2; i++) {
    if (words[i].text === "lampstandbible" && words[i + 1].text === "dot" && /^com/.test(words[i + 2].text)) {
      words.splice(i, 3, { text: `lampstandbible.${words[i + 2].text}`, start: words[i].start, end: words[i + 2].end });
    }
  }
  const noteWord = NOTE_START.split(" ")[0];
  const noteIndex = words.findIndex((w, i) => w.text === noteWord && words[i + 1]?.text === NOTE_START.split(" ")[1]);
  if (noteIndex < 0) throw new Error("The intro script has no app note");

  const duration = words[words.length - 1].end + 1.5;
  const audio = "intro.mp3";
  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error", "-i", raw,
    "-af", `adelay=${lead * 1000}:all=1,${FINISH},apad,atrim=0:${duration.toFixed(2)}`,
    join(work, audio),
  ]);

  const qr = "intro-qr.png";
  await QRCode.toFile(join(work, qr), INTRO_LINK, { width: 600, margin: 2, color: { dark: "#0c0a09", light: "#f1ebdd" } });
  for (const c of CLIP_FILES) copyFileSync(join(CLIPS, c), join(work, `intro-${c}`));

  return { audio, duration, words, clips: CLIP_FILES.map((c) => `intro-${c}`), noteAt: words[noteIndex].start, qr };
}
