/**
 * "Pause for a moment" ad (1080×1920): a calm narrated invitation over animated paintings (Google Flow / Veo
 * clips, muted), Psalm 4:8, then the app itself in a phone, then the end card. One script, two voices.
 *
 *   npx tsx video/calm.ts            # both voices
 *   npx tsx video/calm.ts renee
 *
 * Uses the animated scenes in video/assets/intro/ (also behind the YouTube intro) and the app
 * screenshots in video/.work/pov/shots/ (from pov.ts). Narration is cached by voice and script in video/.work/calm-ad/,
 * so a re-render costs nothing unless the words change.
 * Writes video/out/ads/calm-<voice>.mp4.
 */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { wordsFrom } from "./clips";
import { END_CARD, type AdProps, type AdWord } from "./src/types";

const ROOT = resolve(__dirname, "..");
const WORK = join(ROOT, "video", ".work", "calm-ad");
const SHOTS = join(ROOT, "video", ".work", "pov", "shots");
const SCENE_DIR = join(ROOT, "video", "assets", "intro");
const OUT = join(ROOT, "video", "out", "ads");

const MODEL = "eleven_multilingual_v2";
const SETTINGS = { stability: 0.6, similarity_boost: 0.8, style: 0.1, use_speaker_boost: true, speed: 0.95 };
const FINISH =
  "highpass=f=70,lowpass=f=6500,equalizer=f=3500:t=q:w=1.2:g=-4,equalizer=f=180:t=q:w=1:g=2,loudnorm=I=-16:TP=-1.5:LRA=7";

const VOICES: Record<string, string> = {
  theo: "UmQN7jS1Ee8B1czsUtQh", // Theo Silk, the app's Sleep voice
  renee: "mgpcWiEXIWuENJCy8ADX", // Relaxed Renee, gentle American
};

const SCRIPT =
  "If this video found you tonight, it's no accident. Maybe God wanted you to hear this. " +
  "Pause for a moment. Close your eyes. Take a slow breath… and receive His peace. " +
  "“I will lie down and sleep in peace, for You alone, O LORD, make me dwell in safety.” " +
  "This is Lampstand: the whole Bible, read aloud softly. Every Psalm. The Bible stories. A sleep timer and gentle rain. " +
  "Press play, and put your phone down. Try it free for seven days.";

/** Animated paintings, each from the first word of its phrase. */
const SCENES: { phrase: string; src: string }[] = [
  { phrase: "If this video", src: "scene5-window.mp4" },
  { phrase: "Pause for a moment", src: "scene1-bedroom.mp4" },
  { phrase: "I will lie down", src: "scene3-lake.mp4" },
  { phrase: "make me dwell", src: "scene2-path.mp4" },
  { phrase: "This is Lampstand", src: "scene4-lantern.mp4" },
];

/** App screens in the phone, each from the first word of its phrase. */
const PHONES: { phrase: string; src: string }[] = [
  { phrase: "This is Lampstand", src: "a-home.png" },
  { phrase: "Every Psalm", src: "c-psalms.png" },
  { phrase: "The Bible stories", src: "e-controls.png" },
  { phrase: "A sleep timer", src: "g-timer.png" },
  { phrase: "and gentle rain", src: "rain-12.png" },
  { phrase: "Press play", src: "i-closed.png" },
];

const CLIP_SECONDS = 7.9; // length of each generated scene

const spoken = (script: string) => script.replace(/\bLORD\b/g, "Lord");
const bare = (w: string) => w.toLowerCase().replace(/[^a-z']/g, "");

/** When the first word of `phrase` is spoken. */
function at(words: AdWord[], phrase: string): number {
  const want = phrase.split(" ").map(bare);
  for (let i = 0; i + want.length <= words.length; i++) {
    if (want.every((w, j) => bare(words[i + j].text) === w)) return words[i].start;
  }
  throw new Error(`"${phrase}" is not in the script`);
}

function elevenKey(): string {
  const key = readFileSync(join(ROOT, ".env.local"), "utf8").match(/^ELEVENLABS_API_KEY=(.+)$/m)?.[1].trim();
  if (!key) throw new Error("ELEVENLABS_API_KEY is missing from .env.local");
  return key;
}

type Alignment = { characters: string[]; character_start_times_seconds: number[]; character_end_times_seconds: number[] };

async function narrate(voice: string): Promise<{ mp3: string; alignment: Alignment }> {
  const text = spoken(SCRIPT);
  const id = VOICES[voice];
  const hash = createHash("sha1").update(`${id}|${MODEL}|${JSON.stringify(SETTINGS)}|${text}`).digest("hex").slice(0, 12);
  const raw = join(WORK, `vo-${voice}-${hash}-raw.mp3`);
  const timing = join(WORK, `vo-${voice}-${hash}.json`);
  if (!existsSync(raw) || !existsSync(timing)) {
    console.log(`  ${voice}: narrating (${text.length} characters)…`);
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${id}/with-timestamps?output_format=mp3_44100_128`, {
      method: "POST",
      headers: { "xi-api-key": elevenKey(), "Content-Type": "application/json" },
      body: JSON.stringify({ text, model_id: MODEL, voice_settings: SETTINGS }),
    });
    if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const body = (await res.json()) as { audio_base64: string; alignment: Alignment };
    writeFileSync(raw, Buffer.from(body.audio_base64, "base64"));
    writeFileSync(timing, JSON.stringify(body.alignment));
  }
  return { mp3: raw, alignment: JSON.parse(readFileSync(timing, "utf8")) };
}

async function propsFor(voice: string): Promise<AdProps> {
  const { mp3, alignment } = await narrate(voice);
  const lead = 0.6;
  const words = wordsFrom(SCRIPT, alignment).map((w) => ({ ...w, start: w.start + lead, end: w.end + lead }));
  const length = words[words.length - 1].end + 0.9;
  const audio = `vo-${voice}.mp3`;
  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error", "-i", mp3,
    "-af", `adelay=${lead * 1000}:all=1,${FINISH},apad,atrim=0:${length.toFixed(2)},afade=t=out:st=${(length - 0.6).toFixed(2)}:d=0.6`,
    join(WORK, audio),
  ]);

  const starts = SCENES.map((s, i) => (i === 0 ? 0 : at(words, s.phrase)));
  const images = SCENES.map((s, i) => {
    // Each scene plays from a fade before it appears until a fade after the next one; slow it down if that is longer than the clip.
    const shown = (starts[i + 1] ?? length + END_CARD) + 0.8 - Math.max(0, starts[i] - 0.8);
    return { src: s.src, at: starts[i], video: true, rate: Math.min(1, (CLIP_SECONDS - 0.1) / shown) };
  });
  const phones = PHONES.map((p) => {
    copyFileSync(join(SHOTS, p.src), join(WORK, p.src));
    return { src: p.src, at: at(words, p.phrase) };
  });

  return {
    hook: "If this found you tonight, it's no accident",
    kicker: "Psalm 4:8 · a moment of peace",
    hookUntil: at(words, "Pause for a moment") - 0.3,
    audio,
    clip: length,
    words,
    images,
    phones,
    phonesUntil: length,
    cta: "Fall asleep to Scripture",
    ctaSub: "The whole Bible, read softly · 7 days free",
  };
}

async function main() {
  const only = process.argv.slice(2);
  const voices = only.length ? only : Object.keys(VOICES);
  for (const v of voices) if (!VOICES[v]) throw new Error(`No voice named ${v}. Voices: ${Object.keys(VOICES).join(", ")}`);
  mkdirSync(OUT, { recursive: true });
  mkdirSync(WORK, { recursive: true });
  copyFileSync(join(ROOT, "public", "icon-512.png"), join(WORK, "lampstand-icon.png"));
  for (const s of SCENES) copyFileSync(join(SCENE_DIR, s.src), join(WORK, s.src));

  const all: [string, AdProps][] = [];
  for (const v of voices) all.push([v, await propsFor(v)]);

  const serveUrl = await bundle({ entryPoint: join(ROOT, "video", "src", "index.ts"), publicDir: WORK });
  for (const [v, props] of all) {
    const composition = await selectComposition({ serveUrl, id: "AdReel", inputProps: props });
    const out = join(OUT, `calm-${v}.mp4`);
    await renderMedia({
      composition,
      serveUrl,
      codec: "h264",
      outputLocation: out,
      inputProps: props,
      onProgress: ({ progress }) => process.stdout.write(`\r  ${v}: ${Math.round(progress * 100)}%   `),
    });
    console.log(`\r  ${v}: video/out/ads/calm-${v}.mp4 (${(props.clip + END_CARD).toFixed(1)}s)`);
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
