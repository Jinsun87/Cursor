/**
 * "Why …?" Bible fact reels for the Sleep Bible (Sleep & Walk) Facebook page: one surprising,
 * checkable fact, readable on mute, over our paintings. Format modelled on what performs best
 * for Bible pages on Facebook (question bar, whole fact on screen), in our own words and art.
 *
 *   npx tsx video/facts.ts                 # every fact
 *   npx tsx video/facts.ts psalm-119-long  # one
 *
 * Narration: ElevenLabs (the Walk voice, Eric) with character timestamps, cached by script in
 * video/.work/facts/. Scripture is quoted word for word from the Berean Standard Bible.
 * No links: the bar names the app only. Writes video/out/facts/<id>.mp4, a Facebook-size copy in
 * fb/, and <id>.txt (caption).
 */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { wordsFrom } from "./clips";
import type { FactProps } from "./src/types";

const ROOT = resolve(__dirname, "..");
const WORK = join(ROOT, "video", ".work", "facts");
const OUT = join(ROOT, "video", "out", "facts");
const VOICE = "cjVigY5qzO86Huf0OWal"; // Eric, the Walk reels voice
const MODEL = "eleven_multilingual_v2";
const SETTINGS = { stability: 0.5, similarity_boost: 0.8, style: 0.2, use_speaker_boost: true, speed: 1.05 };
const FINISH = "highpass=f=70,loudnorm=I=-15:TP=-1.5:LRA=9";
const FOOTER = "Every chapter read aloud · free in the Lampstand app";
const END_LINE = "Follow for tomorrow's";

type Fact = {
  id: string;
  question: string;
  reference: string;
  /** Spoken and shown on screen, sentence by sentence. */
  script: string;
  /** Paintings, each from the first word of its phrase (the first from the start). */
  images: { src: string; from?: string }[];
  caption: string;
};

export const FACTS: Fact[] = [
  {
    id: "psalm-119-long",
    question: "Why is Psalm 119 so long?",
    reference: "Psalm 119 · Berean Standard Bible",
    script:
      "Psalm 119 is the longest chapter in the Bible, with a hundred and seventy-six verses. But it isn't long by accident. " +
      "In Hebrew it's an acrostic, written in twenty-two sections, one for every letter of the Hebrew alphabet. " +
      "Each section has eight verses, and every verse in a section begins with that same letter. " +
      "It's a love poem to God's Word, from the first letter to the last. " +
      "Including the line you probably know: “Your word is a lamp to my feet and a light to my path.”",
    images: [
      { src: "/images/sleep/psalm-119/s2.jpg" },
      { src: "/images/sleep/psalm-119/s4.jpg", from: "Each section" },
      { src: "/images/sleep/psalm-119/s1.jpg", from: "Including the line" },
    ],
    caption: "22 letters, 8 verses each, 176 verses. Psalm 119 was written from the first letter to the last. 📖",
  },
  {
    id: "lord-in-capitals",
    question: "Why is “LORD” in capital letters?",
    reference: "Exodus 3:14–15 · Berean Standard Bible",
    script:
      "In most English Bibles you'll see LORD printed in capital letters. It's not a typo. " +
      "At the burning bush, God told Moses His personal name, written in Hebrew with four letters, Y, H, W, H. " +
      "Out of reverence, Jewish readers did not say the name aloud. They read Adonai, which means Lord, instead. " +
      "Translators kept that tradition. So when you see LORD in capitals, the Hebrew behind it is God's own name. " +
      "The name He explained to Moses: “I AM WHO I AM.”",
    images: [
      { src: "/images/sleep/exodus-3/s2.jpg" },
      { src: "/images/sleep/exodus-3/s3.jpg", from: "Out of reverence" },
      { src: "/images/sleep/exodus-3/s1.jpg", from: "The name He explained" },
    ],
    caption: "Every time you read LORD in capitals, you're reading God's own name. Exodus 3 🔥",
  },
  {
    id: "jacob-new-name",
    question: "Why did Jacob get a new name?",
    reference: "Genesis 25:26 · 32:22–28 · Berean Standard Bible",
    script:
      "Jacob was born grasping his twin brother's heel, and the name Jacob echoes that word, heel. " +
      "For years he lived up to it, grabbing what wasn't his. " +
      "Then one night, alone by the river Jabbok, a man wrestled with him until daybreak. " +
      "Jacob said, “I will not let you go unless you bless me.” " +
      "And he was given a new name. “Your name will no longer be Jacob, but Israel, because you have struggled with God and with men, and you have prevailed.”",
    images: [
      { src: "/images/sleep/genesis-32/s3.jpg" },
      { src: "/images/sleep/genesis-32/s4.jpg", from: "Then one night" },
      { src: "/images/sleep/genesis-32/s5.jpg", from: "And he was given" },
    ],
    caption: "The heel-grabber who wrestled until dawn, and the nation that still carries his new name. Genesis 32 🌅",
  },
];

/** LORD and the spelled-out divine name, as the voice should say them (same length, so timings line up). */
const spoken = (s: string) => s.replace(/\bLORD\b/g, "Lord");

function elevenKey(): string {
  const key = readFileSync(join(ROOT, ".env.local"), "utf8").match(/^ELEVENLABS_API_KEY=(.+)$/m)?.[1].trim();
  if (!key) throw new Error("ELEVENLABS_API_KEY is missing from .env.local");
  return key;
}

type Alignment = { characters: string[]; character_start_times_seconds: number[]; character_end_times_seconds: number[] };

async function narrate(f: Fact): Promise<{ mp3: string; alignment: Alignment }> {
  const text = spoken(f.script);
  const hash = createHash("sha1").update(`${VOICE}|${MODEL}|${JSON.stringify(SETTINGS)}|${text}`).digest("hex").slice(0, 12);
  const raw = join(WORK, `${f.id}-${hash}-raw.mp3`);
  const timing = join(WORK, `${f.id}-${hash}.json`);
  if (!existsSync(raw) || !existsSync(timing)) {
    console.log(`  ${f.id}: narrating (${text.length} characters)…`);
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
  return { mp3: raw, alignment: JSON.parse(readFileSync(timing, "utf8")) };
}

const bare = (w: string) => w.toLowerCase().replace(/[^a-z']/g, "");

async function propsFor(f: Fact): Promise<FactProps> {
  const { mp3, alignment } = await narrate(f);
  const words = wordsFrom(f.script, alignment);
  const clip = words[words.length - 1].end + 0.6;
  const audio = `${f.id}.mp3`;
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", mp3, "-af", `${FINISH},apad,atrim=0:${(clip + 2.2).toFixed(2)},afade=t=out:st=${(clip + 1.4).toFixed(2)}:d=0.8`, join(WORK, audio)]);
  const images = f.images.map((im, i) => {
    let at = 0;
    if (im.from) {
      const want = im.from.split(" ").map(bare);
      const k = words.findIndex((_, j) => want.every((w, n) => bare(words[j + n]?.text ?? "") === w));
      if (k < 0) throw new Error(`${f.id}: "${im.from}" is not in the script`);
      at = words[k].start;
    }
    const name = `${f.id}-${i}-${basename(im.src)}`;
    copyFileSync(join(ROOT, "public", im.src), join(WORK, name));
    return { src: name, at };
  });
  return { question: f.question, reference: f.reference, audio, clip, words, images, footer: FOOTER, endLine: END_LINE };
}

async function main() {
  const only = process.argv.slice(2);
  const facts = only.length ? FACTS.filter((f) => only.includes(f.id)) : FACTS;
  if (!facts.length) throw new Error(`No fact named ${only.join(", ")}. Facts: ${FACTS.map((f) => f.id).join(", ")}`);
  mkdirSync(WORK, { recursive: true });
  mkdirSync(join(OUT, "fb"), { recursive: true });
  const all: [Fact, FactProps][] = [];
  for (const f of facts) all.push([f, await propsFor(f)]);
  const serveUrl = await bundle({ entryPoint: join(ROOT, "video", "src", "index.ts"), publicDir: WORK });
  for (const [f, props] of all) {
    const composition = await selectComposition({ serveUrl, id: "FactReel", inputProps: props });
    const out = join(OUT, `${f.id}.mp4`);
    await renderMedia({ composition, serveUrl, codec: "h264", outputLocation: out, inputProps: props, onProgress: ({ progress }) => process.stdout.write(`\r  ${f.id}: ${Math.round(progress * 100)}%   `) });
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", out, "-c:v", "libx264", "-crf", "25", "-maxrate", "1600k", "-bufsize", "3200k", "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", join(OUT, "fb", `${f.id}.mp4`)]);
    writeFileSync(join(OUT, `${f.id}.txt`), `Caption: ${f.caption}\n\nFollow for a new Bible fact every day. 📖\n\nHashtags: #Bible #BibleFacts #DidYouKnow #Faith #Scripture\n`);
    console.log(`\r  ${f.id}: video/out/facts/${f.id}.mp4 (${(props.clip + 2.2).toFixed(1)}s)`);
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
