import type { EBook } from "./types";
import { BIBLE_FOUNDATIONS_EBOOK } from "./bible-foundations";

export const EBOOKS: EBook[] = [BIBLE_FOUNDATIONS_EBOOK];

export function getEBookBySlug(slug: string): EBook | undefined {
  return EBOOKS.find((e) => e.slug === slug);
}
