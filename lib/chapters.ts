import type { QuizChapter } from "./types";

export function getChapterForIndex(
  chapters: QuizChapter[] | undefined,
  index: number,
): QuizChapter | undefined {
  if (!chapters || chapters.length === 0) return undefined;
  let current = chapters[0];
  for (const ch of chapters) {
    if (index >= ch.startIndex) {
      current = ch;
    } else {
      break;
    }
  }
  return current;
}

export function getChapterNumber(
  chapters: QuizChapter[] | undefined,
  index: number,
): number {
  if (!chapters || chapters.length === 0) return 1;
  let num = 1;
  for (let i = 0; i < chapters.length; i++) {
    if (index >= chapters[i].startIndex) {
      num = i + 1;
    } else {
      break;
    }
  }
  return num;
}

export function isChapterStart(
  chapters: QuizChapter[] | undefined,
  index: number,
): boolean {
  if (!chapters || chapters.length === 0 || index === 0) return false;
  return chapters.some((ch) => ch.startIndex === index);
}

export function getPreviousChapter(
  chapters: QuizChapter[] | undefined,
  index: number,
): QuizChapter | undefined {
  if (!chapters || chapters.length === 0) return undefined;
  const currentNum = getChapterNumber(chapters, index);
  if (currentNum <= 1) return undefined;
  return chapters[currentNum - 2];
}
