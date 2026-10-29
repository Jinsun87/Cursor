import { SHELF, STORY_SERIES } from "./books";

/**
 * Who may listen to what. The shelf decides: a book or story series marked `premium` there
 * (Exodus onwards, and the stories) needs Premium; the rest (Genesis) is free. Anything not
 * on the shelf is treated as Premium. The reading plan and every player entry point use this one rule.
 */
export function isPremiumBook(book: string): boolean {
  const shelf = SHELF.find((b) => (b.book ?? b.name) === book) ?? STORY_SERIES.find((s) => s.name === book);
  return shelf ? Boolean(shelf.premium) : true;
}

export function canListen(chapter: { book: string }, premium: boolean): boolean {
  return premium || !isPremiumBook(chapter.book);
}
