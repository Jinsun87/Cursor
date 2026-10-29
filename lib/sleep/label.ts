import type { SleepChapter } from "./types";

type Labelled = Pick<SleepChapter, "kind" | "book" | "chapter" | "title">;

/** What the player calls an item: "Genesis 3", or a story episode's own title. */
export function chapterLabel(c: Labelled): string {
  return c.kind === "story" ? c.title : `${c.book} ${c.chapter}`;
}

/** The section of a story the passage at `index` belongs to (its nearest heading at or before it). */
export function storySection(c: SleepChapter, index: number): string {
  for (let k = Math.min(index, c.verses.length - 1); k >= 0; k--) if (c.verses[k].heading) return c.verses[k].heading!;
  return c.title;
}
