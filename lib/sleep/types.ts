/** A Sleep chapter: a whole chapter of Scripture read word for word, no commentary. */
export interface SleepVerse {
  n: number;
  text: string;
  /** Section heading from the translation that begins at this verse, e.g. "The First Day". */
  heading?: string;
  /** Painting shown while this verse is read; consecutive verses share one. */
  image: string;
}

export interface SleepChapter {
  slug: string;
  /**
   * "story": a retold Bible story episode (content/stories), not a chapter of Scripture.
   * Then `book` is the series, `chapter` the episode number and each "verse" a spoken
   * passage of the story, and it plays only in Sleep.
   */
  kind?: "story";
  book: string;
  chapter: number;
  title: string;
  translation: string;
  /**
   * One continuous recording of the whole chapter. Played by a plain <audio>
   * element so it keeps going with the screen locked; the visuals follow it.
   */
  audioSrc: string;
  /** Verse start times within audioSrc (see SleepTiming). */
  timingSrc: string;
  verses: SleepVerse[];
}

/** timing.json: total length and each verse's start time in seconds, keyed by verse number. */
export interface SleepTiming {
  duration: number;
  verses: Record<string, number>;
}
