import { SHELF } from "./books";

/**
 * Who may listen to what. The shelf decides: a book marked `premium` there (Exodus onwards)
 * needs Premium; the rest (Genesis) is free. A book not on the shelf is treated as Premium.
 * The reading plan and every player entry point use this one rule.
 */
export function isPremiumBook(book: string): boolean {
  const shelf = SHELF.find((b) => b.name === book);
  return shelf ? Boolean(shelf.premium) : true;
}

export function canListen(chapter: { book: string }, premium: boolean): boolean {
  return premium || !isPremiumBook(chapter.book);
}
