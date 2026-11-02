/** What render.ts hands the video: chapters laid end to end, times in seconds from the start. */
export type VideoVerse = { n: number; text: string; start: number; image: string; background: string };

export type VideoChapter = {
  /** "Genesis 1" */
  label: string;
  /** "In the Beginning" */
  title: string;
  /** Narration file in the render's public folder. */
  audio: string;
  /** When this chapter's narration starts in the video, and how long it runs. */
  start: number;
  duration: number;
  verses: VideoVerse[];
  /** Show verse numbers: false for stories, whose text appears a sentence or two at a time. */
  numbered: boolean;
};

export type VideoProps = {
  /** "Genesis 1–3" */
  title: string;
  /** "Read softly for sleep" or "Read for your walk" */
  subtitle: string;
  /** Small line under the thumbnail subtitle: "Word for word · Lampstand". */
  tagline: string;
  chapters: VideoChapter[];
  /** Total length in seconds. */
  duration: number;
};

export const FPS = 30;

/** A short 9:16 ad: one clip of narration with timed captions, then an end card. Times in seconds from the clip's start. */
export type AdWord = { text: string; start: number; end: number };

export type AdProps = {
  /** The line on screen from the first frame, e.g. "Psalm 23, read slowly for sleep". */
  hook: string;
  /** Small line above the hook, e.g. "Psalm 23 · Berean Standard Bible". */
  kicker: string;
  /** Narration clip in the render's public folder. */
  audio: string;
  /** Length of the narration clip. */
  clip: number;
  words: AdWord[];
  /** Paintings in the render's public folder, each shown from `at` until the next. */
  images: { src: string; at: number }[];
  /** End card lines. */
  cta: string;
  ctaSub: string;
};

export const END_CARD = 3.5;
