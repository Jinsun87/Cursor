import { describe, it, expect } from "vitest";
import {
  BOOKS,
  CHAPTERS,
  READING_PLANS,
  getChapter,
  getAdjacentChapters,
  getBook,
} from "./catalog";
import { calculateStreak } from "./reading-store";

describe("Bible Catalog & Chapters", () => {
  it("contains books with valid metadata", () => {
    expect(BOOKS.length).toBeGreaterThanOrEqual(6);
    for (const book of BOOKS) {
      expect(book.slug).toBeTruthy();
      expect(book.title).toBeTruthy();
      expect(book.totalChapters).toBeGreaterThan(0);
      expect(book.featuredChapterNumbers.length).toBeGreaterThan(0);
    }
  });

  it("contains chapters with complete text, artwork, and questions", () => {
    expect(CHAPTERS.length).toBeGreaterThanOrEqual(5);

    for (const ch of CHAPTERS) {
      expect(ch.bookSlug).toBeTruthy();
      expect(ch.chapterNumber).toBeGreaterThan(0);
      expect(ch.title).toBeTruthy();
      expect(ch.verses.length).toBeGreaterThan(0);
      expect(ch.artworkUrl).toBeTruthy();

      // Check-in questions
      expect(ch.checkInQuestions.length).toBe(3);
      for (const q of ch.checkInQuestions) {
        expect(q.prompt).toBeTruthy();
        expect(q.choices.length).toBeGreaterThanOrEqual(3);
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThan(q.choices.length);
        expect(q.explanation).toBeTruthy();
      }

      // WhatsApp/Instagram Story Slides
      expect(ch.storySlides.length).toBeGreaterThanOrEqual(4);
      const questionSlide = ch.storySlides.find((s) => s.type === "question");
      expect(questionSlide).toBeDefined();
      expect(questionSlide?.question).toBeDefined();
    }
  });

  it("finds specific chapters via getChapter", () => {
    const gen1 = getChapter("genesis", 1);
    expect(gen1).toBeDefined();
    expect(gen1?.title).toContain("Creation");

    const ps23 = getChapter("psalms", 23);
    expect(ps23).toBeDefined();
    expect(ps23?.title).toContain("Shepherd");

    const nonExistent = getChapter("genesis", 999);
    expect(nonExistent).toBeUndefined();
  });

  it("navigates adjacent chapters properly", () => {
    const gen1Nav = getAdjacentChapters("genesis", 1);
    expect(gen1Nav.prev).toBeUndefined();
    expect(gen1Nav.next).toBeDefined();
    expect(gen1Nav.next?.chapterNumber).toBe(3); // Day 2: Genesis 3

    const gen12Nav = getAdjacentChapters("genesis", 12);
    expect(gen12Nav.prev?.chapterNumber).toBe(3); // Day 2: Genesis 3
    expect(gen12Nav.next?.chapterNumber).toBe(22); // Day 4: Genesis 22
  });

  it("retrieves books via getBook", () => {
    const book = getBook("john");
    expect(book).toBeDefined();
    expect(book?.title).toBe("John");
    expect(book?.testament).toBe("NT");
  });

  it("has valid reading plans including 30-day Anchors course", () => {
    expect(READING_PLANS.length).toBeGreaterThan(0);
    const anchors = READING_PLANS.find((p) => p.slug === "anchors-of-scripture");
    expect(anchors).toBeDefined();
    expect(anchors?.days).toBe(30);
    expect(anchors?.chapters.length).toBe(30);
    expect(CHAPTERS.length).toBe(30);

    // Verify all 30 days are sequential from 1 to 30
    const dayNumbers = CHAPTERS.map((c) => c.dayNumber);
    expect(dayNumbers).toEqual(Array.from({ length: 30 }, (_, i) => i + 1));
  });
});

describe("Reading Streak Calculation", () => {
  it("starts a streak at 1 if never read before", () => {
    expect(calculateStreak(null, 0)).toBe(1);
  });

  it("keeps current streak if read again on the same day", () => {
    const today = new Date().toISOString().split("T")[0];
    expect(calculateStreak(today, 5)).toBe(5);
  });

  it("increments streak by 1 if read on the consecutive day", () => {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    expect(calculateStreak(yesterday, 3)).toBe(4);
  });

  it("resets streak to 1 if more than one day has elapsed", () => {
    const threeDaysAgo = new Date(Date.now() - 86400000 * 3).toISOString().split("T")[0];
    expect(calculateStreak(threeDaysAgo, 10)).toBe(1);
  });
});
