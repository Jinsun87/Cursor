/**
 * Renders the test Reels for Meta ads (1080×1920): one clip of narration, its words as captions,
 * the paintings behind it, and an end card. Uses only what the app already has; no paid APIs.
 *
 *   npx tsx video/ads.ts              # all ads
 *   npx tsx video/ads.ts hannah ruth  # some of them
 *
 * Psalm captions are timed from voice-transcripts/sleep/<slug>.json. Story captions are timed by
 * faster-whisper on this computer (video/words.py), cached in video/.work/ads/. Captions always show
 * the script's own words (Berean Standard Bible for Scripture); the transcript only times them.
 * Writes video/out/ads/<id>.mp4 and <id>.txt (ad copy to paste into Ads Manager).
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import type { SleepChapter } from "../lib/sleep/types";
import type { AdProps, AdWord } from "./src/types";

const ROOT = resolve(__dirname, "..");
const WORK = join(ROOT, "video", ".work", "ads");
const OUT = join(ROOT, "video", "out", "ads");

type Ad = {
  id: string;
  /** "sleep" chapter or "story". */
  kind: "sleep" | "story";
  slug: string;
  /** Clip of the recording, in seconds. */
  from: number;
  to: number;
  hook: string;
  kicker: string;
  ctaSub: string;
  /** Paintings by time in the recording; defaults to each verse or piece's own painting. */
  images?: { src: string; at: number }[];
  /** Ad copy for Ads Manager. */
  primary: string;
  headline: string;
};

const TRIAL = "Try it free for 7 days";

const ADS: Ad[] = [
  {
    id: "psalm-23",
    kind: "sleep",
    slug: "psalm-23",
    from: 1.2,
    to: 42.3,
    hook: "Psalm 23, read slowly for sleep",
    kicker: "Psalm 23 · word for word",
    ctaSub: "Every Psalm, read softly for sleep",
    primary: "The LORD is my shepherd. Psalm 23, read slowly and softly, word for word from the Berean Standard Bible. Put your phone down, close your eyes and listen.",
    headline: "Fall asleep to the Psalms",
  },
  {
    id: "psalm-91",
    kind: "sleep",
    slug: "psalm-91",
    from: 1.2,
    to: 32.2,
    hook: "Fall asleep to Psalm 91",
    kicker: "Psalm 91 · read softly",
    ctaSub: "Every Psalm, read softly for sleep",
    primary: "He who dwells in the shelter of the Most High will rest in the shadow of the Almighty. Psalm 91, read softly for the end of the day.",
    headline: "Scripture, read softly for sleep",
  },
  {
    id: "psalm-121",
    kind: "sleep",
    slug: "psalm-121",
    from: 1.2,
    to: 27.5,
    hook: "For nights when sleep won't come",
    kicker: "Psalm 121 · read softly",
    ctaSub: "Every Psalm, read softly for sleep",
    primary: "I lift up my eyes to the hills. Psalm 121, read slowly, with a sleep timer that fades the voice out when you drift off.",
    headline: "The Psalms, for the last minutes of the day",
  },
  {
    id: "hannah",
    kind: "story",
    slug: "hannah",
    from: 218.1,
    to: 259.3,
    hook: "The woman who prayed so hard the priest thought she was drunk",
    kicker: "Women of the Bible · Hannah",
    ctaSub: "Women of the Bible, told from Scripture",
    primary: "Hannah prayed without a sound, and Eli the priest thought she was drunk. Her story from 1 Samuel 1, told gently, with Scripture read word for word.",
    headline: "Women of the Bible, told gently",
  },
  {
    id: "ruth",
    kind: "story",
    slug: "ruth",
    from: 215.7,
    to: 243.9,
    hook: "She could have gone home. She chose to stay.",
    kicker: "Women of the Bible · Ruth",
    ctaSub: "Women of the Bible, told from Scripture",
    primary: "Wherever you go, I will go. Ruth's words to Naomi, in a story told gently from Ruth 1, with Scripture read word for word.",
    headline: "Women of the Bible, told gently",
  },
  {
    id: "storm",
    kind: "story",
    slug: "jesus-calms-the-storm",
    from: 405.6,
    to: 425.0,
    hook: "A Bible story to fall asleep to",
    kicker: "Bedtime Bible Stories",
    ctaSub: "Bedtime Bible Stories, read softly",
    images: [
      { src: "/images/story/jesus-calms-the-storm/storm.jpg", at: 405.6 },
      { src: "/images/story/jesus-calms-the-storm/calm.jpg", at: 420.6 },
    ],
    primary: "Jesus looked at the wind and the waves and said, Be still. A bedtime story from Luke 8, read softly so little ones drift off.",
    headline: "Bedtime Bible stories, read softly",
  },
];

const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, "");

/**
 * Times the script's own words from what Whisper heard: each heard word claims the next matching
 * script word within a few places. Returns only the stretch of script the clip covers.
 */
export function align(script: string[], heard: { word: string; start: number; end: number }[]): AdWord[] {
  const timed: (AdWord | null)[] = script.map(() => null);
  // Start where the first three heard words appear in a row, so a common first word ("She") cannot
  // latch onto an earlier sentence.
  const firstThree = heard.map((h) => norm(h.word)).filter(Boolean).slice(0, 3);
  let i = script.findIndex((_, k) => firstThree.every((n, j) => norm(script[k + j] ?? "") === n)) - 1;
  if (i < -1) i = -1;
  for (const h of heard) {
    const n = norm(h.word);
    if (!n) continue;
    const from = i + 1;
    const window = i < 0 ? script.length : 6;
    for (let k = from; k < Math.min(script.length, from + window); k++) {
      if (norm(script[k]) === n) {
        timed[k] = { text: script[k], start: h.start, end: h.end };
        i = k;
        break;
      }
    }
  }
  const first = timed.findIndex(Boolean);
  const last = timed.length - 1 - [...timed].reverse().findIndex(Boolean);
  const out: AdWord[] = [];
  for (let k = first; k <= last; k++) {
    // A script word Whisper heard differently takes the gap before the next timed word.
    const prev = out[out.length - 1];
    out.push(timed[k] ?? { text: script[k], start: prev?.end ?? 0, end: prev?.end ?? 0 });
  }
  return out;
}

const chapterOf = (ad: Ad): SleepChapter =>
  ad.kind === "story"
    ? JSON.parse(readFileSync(join(ROOT, "lib", "stories", "chapters", `${ad.slug}.json`), "utf8"))
    : (require("../lib/sleep/chapters").SLEEP_CHAPTERS as SleepChapter[]).find((c) => c.slug === ad.slug)!;

function recording(ad: Ad): string {
  const file = ad.kind === "story" ? join(ROOT, "public", "stories", ad.slug, "story.mp3") : join(ROOT, "public", "sleep", ad.slug, "chapter.mp3");
  if (!existsSync(file)) throw new Error(`${file} is missing (download it from R2 first)`);
  return file;
}

function timingOf(ad: Ad): Record<string, number> {
  const dir = ad.kind === "story" ? "stories" : "sleep";
  return JSON.parse(readFileSync(join(ROOT, "public", dir, ad.slug, "timing.json"), "utf8")).verses;
}

function heardWords(ad: Ad, mp3: string): { word: string; start: number; end: number }[] {
  if (ad.kind === "sleep") return JSON.parse(readFileSync(join(ROOT, "voice-transcripts", "sleep", `${ad.slug}.json`), "utf8")).words;
  const cache = join(WORK, `${ad.id}-words.json`);
  if (!existsSync(cache)) execFileSync("python", [join(ROOT, "video", "words.py"), mp3, String(ad.from), String(ad.to), cache], { stdio: "inherit" });
  return JSON.parse(readFileSync(cache, "utf8")).words;
}

function propsFor(ad: Ad): AdProps {
  const chapter = chapterOf(ad);
  const starts = timingOf(ad);
  const mp3 = recording(ad);
  // The verses or pieces the clip touches.
  const inClip = chapter.verses.filter((v, i) => {
    const start = starts[String(v.n)] ?? 0;
    const end = starts[String(chapter.verses[i + 1]?.n)] ?? Infinity;
    return start < ad.to && end > ad.from;
  });
  const script = inClip.flatMap((v) => v.text.split(/\s+/).filter(Boolean));
  const heard = heardWords(ad, mp3).filter((w) => w.start >= ad.from - 0.2 && w.end <= ad.to + 0.3);
  const words = align(script, heard).map((w) => ({ ...w, start: w.start - ad.from, end: w.end - ad.from }));

  const clip = ad.to - ad.from;
  const audio = `${ad.id}.mp3`;
  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error", "-ss", String(ad.from), "-to", String(ad.to), "-i", mp3,
    "-af", `afade=t=in:d=0.3,afade=t=out:st=${(clip - 0.9).toFixed(2)}:d=0.9`, join(WORK, audio),
  ]);

  const paintings = ad.images ?? inClip.map((v) => ({ src: v.image, at: starts[String(v.n)] ?? ad.from }));
  const images: AdProps["images"] = [];
  for (const p of paintings) {
    const name = `${ad.id}-${basename(p.src)}`;
    copyFileSync(join(ROOT, "public", p.src), join(WORK, name));
    if (images[images.length - 1]?.src !== name) images.push({ src: name, at: Math.max(0, p.at - ad.from) });
  }
  images[0].at = 0;

  return { hook: ad.hook, kicker: ad.kicker, audio, clip, words, images, cta: TRIAL, ctaSub: ad.ctaSub };
}

async function main() {
  const only = process.argv.slice(2);
  const ads = only.length ? ADS.filter((a) => only.includes(a.id)) : ADS;
  if (!ads.length) throw new Error(`No ad named ${only.join(", ")}. Ads: ${ADS.map((a) => a.id).join(", ")}`);
  mkdirSync(WORK, { recursive: true });
  mkdirSync(OUT, { recursive: true });
  copyFileSync(join(ROOT, "public", "icon-512.png"), join(WORK, "lampstand-icon.png"));

  const all = ads.map((ad) => ({ ad, props: propsFor(ad) }));
  const serveUrl = await bundle({ entryPoint: join(ROOT, "video", "src", "index.ts"), publicDir: WORK });
  for (const { ad, props } of all) {
    const composition = await selectComposition({ serveUrl, id: "AdReel", inputProps: props });
    await renderMedia({
      composition,
      serveUrl,
      codec: "h264",
      outputLocation: join(OUT, `${ad.id}.mp4`),
      inputProps: props,
      onProgress: ({ progress }) => process.stdout.write(`\r  ${ad.id}: ${Math.round(progress * 100)}%   `),
    });
    writeFileSync(
      join(OUT, `${ad.id}.txt`),
      [`Primary text: ${ad.primary}`, `Headline: ${ad.headline}`, `Description: 7 days free, then $4.99 a month. Cancel anytime.`, "Call to action: Learn more", "Link: https://lampstandbible.com/pricing"].join("\n") + "\n",
    );
    console.log(`\r  ${ad.id}: video/out/ads/${ad.id}.mp4 (${(props.clip + 3.5).toFixed(1)}s, ${props.words.length} caption words)`);
  }
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  });
}
