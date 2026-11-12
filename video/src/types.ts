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

/** The spoken opening before the first chapter: a welcome, a short note about the app with a QR code, then the reading. */
export type VideoIntro = {
  /** Narration in the render's public folder, and its length. */
  audio: string;
  duration: number;
  words: { text: string; start: number; end: number }[];
  /** Animated paintings in the render's public folder, played in turn behind the welcome. */
  clips: string[];
  /** When the app note starts: the QR code shows from here. */
  noteAt: number;
  /** QR code image in the render's public folder. */
  qr: string;
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
  intro?: VideoIntro;
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
  /**
   * Paintings in the render's public folder, each shown from `at` until the next. A `video` is an
   * animated painting: played muted (at `rate`, default 1) and held on its last frame if it runs out.
   */
  images: { src: string; at: number; video?: boolean; rate?: number }[];
  /** A small pill above the kicker naming the series and episode, e.g. "Night 9 · Scripture for sleep". */
  badge?: string;
  /** A last line on the end card, e.g. "Follow for tomorrow's verse · Save this for tonight". */
  endNote?: string;
  /** Hide the hook and kicker from this time on (default: shown until the end card). */
  hookUntil?: number;
  /** App screenshots shown in a phone over the paintings, each from `at` until the next, until `phonesUntil`. */
  phones?: { src: string; at: number }[];
  phonesUntil?: number;
  /**
   * A scroll-stopping opening: the hook fills the middle of the screen for the first two seconds
   * (captions wait), the first painting pushes in fast, then the hook settles at the top.
   */
  punch?: boolean;
  /** Seconds of end card (default END_CARD). */
  endCard?: number;
  /** End card lines. */
  cta: string;
  ctaSub: string;
};

export const END_CARD = 3.5;

/** A "Why …?" Bible fact reel (FactReel.tsx). Times in seconds from the start. */
export type FactProps = {
  /** The question bar, e.g. "Why is Psalm 119 so long?" */
  question: string;
  /** Under the fact, e.g. "Psalm 119 · Berean Standard Bible". */
  reference: string;
  audio: string;
  /** Length of the narration. */
  clip: number;
  words: AdWord[];
  images: { src: string; at: number }[];
  /** Bottom bar, e.g. "Every chapter read aloud · free in the Lampstand app". */
  footer: string;
  /** End screen, e.g. "Follow for tomorrow's". */
  endLine: string;
};

/**
 * A POV screen-recording ad: screenshots of the app shown in order, with taps, a slow "camera"
 * that keeps the action clear of Instagram's buttons, step captions, then a dim and the end card.
 * Times in seconds; x and y in the phone's CSS pixels (390×844 screen).
 */
export type PovProps = {
  /** Screenshots in the render's public folder, each shown from `at` until the next. */
  screens: { src: string; at: number }[];
  taps: { at: number; x: number; y: number }[];
  drags: { from: number; to: number; x0: number; x1: number; y: number }[];
  /** Which screen y sits at the frame's focus line, over time. */
  camera: { at: number; y: number }[];
  /** White caption boxes, TikTok style; the first is the hook. */
  captions: { from: number; to: number; text: string }[];
  /** The narration starts at `at` in the video, `from` seconds into its file. */
  narration: { src: string; at: number; from: number };
  rain: { src: string; levels: { at: number; level: number }[] };
  /** The screen fades to black from `dim` to `dark`, then the end card. */
  dim: number;
  dark: number;
  cta: string;
  ctaSub: string;
};
