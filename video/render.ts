/**
 * Renders Walk or Sleep chapters as a long-form video for YouTube, on this computer.
 * Uses what the app already has: the paintings, the narration MP3s and the verse timings.
 *
 *   npx tsx video/render.ts "Genesis 1"            # one chapter, Sleep
 *   npx tsx video/render.ts "Genesis 1-11"         # several chapters in one video
 *   npx tsx video/render.ts "Exodus 14" --walk     # the Walk reading instead
 *   npx tsx video/render.ts "Genesis 1" --seconds=60   # a short test
 *   --concurrency=8  (render threads; defaults to half the CPU threads)
 *
 * Writes video/out/<name>.mp4, <name>.jpg (thumbnail) and <name>.txt (title, description and
 * chapter timestamps for YouTube). Scratch files go to video/.work/. Neither is committed.
 * Run `npm install` in video/ once first.
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import { SLEEP_CHAPTERS } from "../lib/sleep/chapters";
import type { SleepChapter, SleepTiming } from "../lib/sleep/types";
import type { VideoChapter, VideoProps } from "./src/types";

const ROOT = resolve(__dirname, "..");
const args = process.argv.slice(2);
const ref = args.find((a) => !a.startsWith("--"));
const mode = args.includes("--walk") ? "walk" : "sleep";
const limit = Number(args.find((a) => a.startsWith("--seconds="))?.split("=")[1]) || 0;
const concurrency = Number(args.find((a) => a.startsWith("--concurrency="))?.split("=")[1]) || undefined;

const LEAD = 2; // seconds before the first chapter starts
const GAP = 3; // seconds of quiet between chapters
const TAIL = 5; // seconds after the last chapter

function chaptersFor(text: string): SleepChapter[] {
  const m = text.match(/^(.+?) (\d+)(?:\s*[-–]\s*(\d+))?$/);
  if (!m) throw new Error(`Give a book and chapter or range, e.g. "Genesis 1-3" (got "${text}")`);
  const [book, from, to] = [m[1], Number(m[2]), Number(m[3] ?? m[2])];
  const out: SleepChapter[] = [];
  for (let n = from; n <= to; n++) {
    const c = SLEEP_CHAPTERS.find((x) => x.book === book && x.chapter === n);
    if (!c) throw new Error(`${book} ${n} has no recording yet`);
    out.push(c);
  }
  return out;
}

const audioBase = () => {
  const env = existsSync(join(ROOT, ".env.local")) ? readFileSync(join(ROOT, ".env.local"), "utf8") : "";
  return (env.match(/^NEXT_PUBLIC_AUDIO_BASE_URL=(.*)$/m)?.[1] ?? "").trim().replace(/^["']|["']$/g, "").replace(/\/$/, "");
};

/** The narration MP3 on this computer, fetched from R2 if it isn't here. */
async function narration(slug: string, into: string): Promise<string> {
  const local = join(ROOT, "public", mode, slug, "chapter.mp3");
  const name = `${slug}.mp3`;
  if (existsSync(local)) copyFileSync(local, join(into, name));
  else {
    const base = audioBase();
    if (!base) throw new Error(`${local} is missing and NEXT_PUBLIC_AUDIO_BASE_URL is not set`);
    const res = await fetch(`${base}/${mode}/${slug}/chapter.mp3`);
    if (!res.ok) throw new Error(`Could not download ${slug} narration: ${res.status}`);
    writeFileSync(join(into, name), Buffer.from(await res.arrayBuffer()));
  }
  return name;
}

/** Copy a painting into the render folder, with a blurred full-screen background made once. */
function painting(src: string, into: string, slug: string) {
  const image = `${slug}-${basename(src)}`;
  const background = `bg-${image}`;
  if (!existsSync(join(into, image))) copyFileSync(join(ROOT, "public", src), join(into, image));
  if (!existsSync(join(into, background))) {
    execFileSync("ffmpeg", [
      "-y", "-loglevel", "error", "-i", join(into, image),
      "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,gblur=sigma=30,eq=brightness=-0.32:saturation=0.9",
      "-q:v", "3", join(into, background),
    ]);
  }
  return { image, background };
}

const clock = (s: number) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  return h ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}` : `${m}:${String(sec).padStart(2, "0")}`;
};

async function main() {
  if (!ref) throw new Error('Usage: npx tsx video/render.ts "Genesis 1-3" [--walk] [--seconds=60]');
  const chapters = chaptersFor(ref);
  const first = chapters[0];
  const last = chapters[chapters.length - 1];
  const range = first === last ? `${first.book} ${first.chapter}` : `${first.book} ${first.chapter}–${last.chapter}`;
  const name = `${first.slug}${first === last ? "" : `-${last.chapter}`}-${mode}${limit ? `-${limit}s` : ""}`;
  const work = join(ROOT, "video", ".work", name);
  const out = join(ROOT, "video", "out");
  mkdirSync(work, { recursive: true });
  mkdirSync(out, { recursive: true });

  // Lay the chapters end to end, with verse times from each recording's timing file.
  let at = LEAD;
  const laid: VideoChapter[] = [];
  for (const c of chapters) {
    const timing: SleepTiming = JSON.parse(readFileSync(join(ROOT, "public", mode, c.slug, "timing.json"), "utf8"));
    const audio = await narration(c.slug, work);
    laid.push({
      label: `${c.book} ${c.chapter}`,
      title: c.title,
      audio,
      start: at,
      duration: timing.duration,
      verses: c.verses.map((v) => ({ n: v.n, text: v.text, start: at + (timing.verses[String(v.n)] ?? 0), ...painting(v.image, work, c.slug) })),
    });
    at += timing.duration + GAP;
  }
  const full = at - GAP + TAIL;
  const duration = limit ? Math.min(limit, full) : full;
  const props: VideoProps = {
    title: range,
    subtitle: mode === "sleep" ? "Read softly for sleep" : "Read for your walk",
    chapters: laid.filter((c) => c.start < duration),
    duration,
  };

  console.log(`  ${range} (${mode}): ${clock(duration)} of video, ${props.chapters.length} chapter(s)`);
  const started = Date.now();
  const serveUrl = await bundle({ entryPoint: join(ROOT, "video", "src", "index.ts"), publicDir: work });
  const video = await selectComposition({ serveUrl, id: "SleepVideo", inputProps: props });
  await renderMedia({
    composition: video,
    serveUrl,
    codec: "h264",
    outputLocation: join(out, `${name}.mp4`),
    inputProps: props,
    concurrency,
    onProgress: ({ progress }) => process.stdout.write(`\r  rendering ${Math.round(progress * 100)}%   `),
  });
  const thumb = await selectComposition({ serveUrl, id: "Thumbnail", inputProps: props });
  await renderStill({ composition: thumb, serveUrl, output: join(out, `${name}.jpg`), inputProps: props, imageFormat: "jpeg" });

  // Title, description and YouTube chapters (each line "m:ss Title" becomes a clickable chapter).
  const stamps = props.chapters.map((c, i) => `${clock(i === 0 ? 0 : c.start)} ${c.label} · ${c.title}`);
  const description = [
    `${range}, read ${mode === "sleep" ? "softly for sleep" : "aloud for your walk"}, word for word from the Berean Standard Bible, with paintings for each passage.`,
    "",
    "Listen free and keep your place every night at https://lampstandbible.com",
    "",
    ...(stamps.length > 1 ? ["Chapters", ...stamps, ""] : []),
    "Scripture quotations are from the Berean Standard Bible (BSB), public domain.",
  ].join("\n");
  const title = `${range} · ${mode === "sleep" ? "Bible Reading for Sleep" : "Bible Reading"} · ${props.chapters.length > 1 ? clock(duration) : first.title}`;
  writeFileSync(join(out, `${name}.txt`), `${title}\n\n${description}\n`);

  const secs = Math.round((Date.now() - started) / 1000);
  console.log(`\r  done in ${clock(secs)}: video/out/${name}.mp4, .jpg thumbnail, .txt description`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
