import counts from "./verse-counts.json";
import { isFreeChapter, isPremiumBook } from "@/lib/sleep/access";

export type Testament = "Old Testament" | "New Testament";

/** Protestant canon in Berean Standard Bible book order. */
const ORDER = Object.keys(counts) as (keyof typeof counts)[];
const OLD_TESTAMENT = 39;

export type BibleBook = {
  name: string;
  testament: Testament;
  /** Matches recorded audio slugs: "1 Samuel" → "1-samuel". */
  slug: string;
  /** Verse count of each chapter, index 0 is chapter 1. */
  verseCounts: number[];
};

export const BOOKS: BibleBook[] = ORDER.map((name, i) => ({
  name,
  testament: i < OLD_TESTAMENT ? "Old Testament" : "New Testament",
  slug: name.toLowerCase().replace(/ /g, "-"),
  verseCounts: counts[name],
}));

export function bookByName(name: string): BibleBook | undefined {
  return BOOKS.find((b) => b.name === name);
}

export function chapterSlug(book: string, chapter: number): string {
  const found = bookByName(book);
  return `${(found?.slug ?? book.toLowerCase().replace(/ /g, "-"))}-${chapter}`;
}

/**
 * Whether a book's Walk and Sleep readings are free: the same rule as the shelf on the Walk
 * and Sleep tabs (lib/sleep/access.ts), so Genesis and the free Psalms are free and other
 * premium books need Premium. Books not on the shelf yet are treated as Premium.
 */
export function voiceIsFree(book: string, chapter?: number): boolean {
  return !isPremiumBook(book) || isFreeChapter(book, chapter);
}
