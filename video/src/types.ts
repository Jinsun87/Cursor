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
};

export type VideoProps = {
  /** "Genesis 1–3" */
  title: string;
  /** "Read softly for sleep" or "Read for your walk" */
  subtitle: string;
  chapters: VideoChapter[];
  /** Total length in seconds. */
  duration: number;
};

export const FPS = 30;
