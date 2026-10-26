import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getChapter } from "@/lib/bible/bsb";
import { audioUrl } from "@/lib/audio-url";
import type { SleepTiming } from "@/lib/sleep/types";

export type ClipMode = "walk" | "sleep";

/** A stretch of a recorded chapter, ready for VerseClip to play: where to start and stop, and each verse's start for highlighting. */
export type Clip = {
  src: string;
  start: number;
  end: number;
  verses: { n: number; text: string; at: number }[];
};

export type ClipSet = { ref: string; chapterLabel: string } & Partial<Record<ClipMode, Clip>>;

/**
 * Verses `from` to `to` of a chapter, cut from the Walk and Sleep recordings by their timing files.
 * Runs at build time (the timing files are in the repo); the audio itself streams from R2. A mode
 * that has not been recorded is left out.
 */
export function buildClip(book: string, chapter: number, from: number, to = from): ClipSet {
  const slug = `${book.toLowerCase().replace(/ /g, "-")}-${chapter}`;
  const text = getChapter(book, chapter).filter((v) => v.n >= from && v.n <= to);
  const set: ClipSet = { ref: `${book} ${chapter}:${from}${to > from ? `–${to}` : ""}`, chapterLabel: `${book} ${chapter}` };
  for (const mode of ["walk", "sleep"] as const) {
    let timing: SleepTiming;
    try {
      timing = JSON.parse(readFileSync(join(process.cwd(), "public", mode, slug, "timing.json"), "utf8"));
    } catch {
      continue;
    }
    const at = (n: number) => timing.verses[String(n)];
    if (at(from) === undefined) continue;
    set[mode] = {
      src: audioUrl(`/${mode}/${slug}/chapter.mp3`),
      start: at(from),
      end: at(to + 1) ?? timing.duration,
      verses: text.map((v) => ({ n: v.n, text: v.text, at: at(v.n) ?? at(from) })),
    };
  }
  return set;
}
