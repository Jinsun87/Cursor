import { BIBLE_TOPICS } from "./bible/topics";
import { getPassageText } from "./bible/bsb";

import type { DailyVerse } from "./daily-verse";
export { pickDailyVerse, type DailyVerse } from "./daily-verse";

const MAX_LENGTH = 200; // short enough to read at a glance on a phone

/**
 * The pool for "Verse for today": single verses from the life topics, in exact
 * BSB text, short enough for the home screen. Built on the server; the reader's
 * browser picks today's verse by its own local date.
 */
export function dailyVersePool(): DailyVerse[] {
  const seen = new Set<string>();
  const pool: DailyVerse[] = [];
  for (const topic of BIBLE_TOPICS) {
    for (const sub of topic.subSections) {
      const reference = sub.verse.reference;
      if (seen.has(reference) || /[-–]/.test(reference)) continue;
      seen.add(reference);
      const text = getPassageText(reference);
      // Skip psalm superscriptions ("A Psalm of David.") and long verses.
      if (text.length <= MAX_LENGTH && !/^(A Psalm|A Song|For the choirmaster)/.test(text))
        pool.push({ reference, text });
    }
  }
  return pool;
}

