import { SLEEP_CHAPTERS, WALK_SECONDS } from "./chapters";
import { STORY_CHAPTERS } from "../stories/chapters";
import type { SleepChapter } from "./types";

/**
 * The chapter after this one that has a recording in this mode (Walk stays Walk, Sleep stays
 * Sleep), running on into the next book; null after the last recorded chapter. A story
 * episode plays on to the next episode of the same series, and stops at the series' end.
 */
export function nextChapter(
  slug: string,
  mode: "walk" | "sleep",
  chapters: SleepChapter[] = SLEEP_CHAPTERS,
  walkSeconds: Record<string, number> = WALK_SECONDS,
  stories: SleepChapter[] = STORY_CHAPTERS,
): SleepChapter | null {
  const story = stories.find((c) => c.slug === slug);
  if (story) return stories.find((c) => c.book === story.book && c.chapter === story.chapter + 1) ?? null;
  const k = chapters.findIndex((c) => c.slug === slug);
  if (k < 0) return null;
  return chapters.slice(k + 1).find((c) => mode === "sleep" || walkSeconds[c.slug] > 0) ?? null;
}
