import { describe, expect, it } from "vitest";
import {
  getChapterForIndex,
  getChapterNumber,
  getPreviousChapter,
  isChapterStart,
} from "./chapters";
import type { QuizChapter } from "./types";

const TEST_CHAPTERS: QuizChapter[] = [
  { title: "Act I: Patriarchs & Exodus", startIndex: 0 },
  { title: "Act II: Kings & Prophets", startIndex: 13 },
  { title: "Act III: Gospels", startIndex: 26 },
  { title: "Act IV: Epistles", startIndex: 40 },
];

describe("lib/chapters", () => {
  it("resolves the correct chapter for question indices", () => {
    expect(getChapterForIndex(TEST_CHAPTERS, 0)?.title).toBe("Act I: Patriarchs & Exodus");
    expect(getChapterForIndex(TEST_CHAPTERS, 5)?.title).toBe("Act I: Patriarchs & Exodus");
    expect(getChapterForIndex(TEST_CHAPTERS, 13)?.title).toBe("Act II: Kings & Prophets");
    expect(getChapterForIndex(TEST_CHAPTERS, 39)?.title).toBe("Act III: Gospels");
    expect(getChapterForIndex(TEST_CHAPTERS, 50)?.title).toBe("Act IV: Epistles");
  });

  it("calculates chapter numbers correctly", () => {
    expect(getChapterNumber(TEST_CHAPTERS, 0)).toBe(1);
    expect(getChapterNumber(TEST_CHAPTERS, 12)).toBe(1);
    expect(getChapterNumber(TEST_CHAPTERS, 13)).toBe(2);
    expect(getChapterNumber(TEST_CHAPTERS, 26)).toBe(3);
    expect(getChapterNumber(TEST_CHAPTERS, 40)).toBe(4);
  });

  it("identifies chapter boundary starts correctly", () => {
    expect(isChapterStart(TEST_CHAPTERS, 0)).toBe(false); // First question is start of quiz, not a mid-quiz transition
    expect(isChapterStart(TEST_CHAPTERS, 12)).toBe(false);
    expect(isChapterStart(TEST_CHAPTERS, 13)).toBe(true);
    expect(isChapterStart(TEST_CHAPTERS, 26)).toBe(true);
    expect(isChapterStart(TEST_CHAPTERS, 40)).toBe(true);
  });

  it("gets the previous chapter on transition", () => {
    expect(getPreviousChapter(TEST_CHAPTERS, 0)).toBeUndefined();
    expect(getPreviousChapter(TEST_CHAPTERS, 13)?.title).toBe("Act I: Patriarchs & Exodus");
    expect(getPreviousChapter(TEST_CHAPTERS, 26)?.title).toBe("Act II: Kings & Prophets");
  });
});
