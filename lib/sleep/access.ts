import { SHELF, STORY_SERIES } from "./books";

/**
 * Psalms anyone may hear, so a first-time listener who came for "the Psalms for sleep" has
 * somewhere to start. The rest of the Psalms stay Premium.
 */
export const FREE_PSALMS: readonly number[] = [4, 23, 27, 34, 46, 62, 63, 91, 121, 139];

/**
 * Who may listen to what. The shelf decides: a book or story series marked `premium` there
 * (Exodus onwards, and the stories) needs Premium; the rest (Genesis) is free. Anything not
 * on the shelf is treated as Premium. The reading plan and every player entry point use this one rule.
 */
export function isPremiumBook(book: string): boolean {
  const shelf = SHELF.find((b) => (b.book ?? b.name) === book) ?? STORY_SERIES.find((s) => s.name === book);
  return shelf ? Boolean(shelf.premium) : true;
}

/** A single chapter that is free even though its book is Premium (the free Psalms). */
export function isFreeChapter(book: string, chapter?: number): boolean {
  return (book === "Psalm" || book === "Psalms") && chapter !== undefined && FREE_PSALMS.includes(chapter);
}

export function canListen(chapter: { book: string; chapter?: number; kind?: string }, premium: boolean): boolean {
  if (premium || !isPremiumBook(chapter.book)) return true;
  return chapter.kind !== "story" && isFreeChapter(chapter.book, chapter.chapter);
}
