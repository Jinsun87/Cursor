import { describe, expect, it } from "vitest";
import { getEBookBySlug, EBOOKS } from "./catalog";
import { BIBLE_FOUNDATIONS_EBOOK } from "./bible-foundations";

describe("lib/ebooks", () => {
  it("contains the Bible Foundations eBook with 100 total facts", () => {
    expect(EBOOKS.length).toBeGreaterThan(0);
    const bibleFoundations = getEBookBySlug("bible-foundations");
    expect(bibleFoundations).toBeDefined();
    expect(bibleFoundations?.title).toBe("Bible Foundations");

    const totalFacts = bibleFoundations?.chapters.reduce(
      (acc, ch) => acc + ch.facts.length,
      0,
    );
    expect(totalFacts).toBe(100);
  });

  it("has 5 structured chapters with facts and references", () => {
    expect(BIBLE_FOUNDATIONS_EBOOK.chapters.length).toBe(5);

    BIBLE_FOUNDATIONS_EBOOK.chapters.forEach((ch) => {
      expect(ch.title).toBeTruthy();
      expect(ch.facts.length).toBe(20);
      ch.facts.forEach((fact) => {
        expect(fact.id).toBeGreaterThan(0);
        expect(fact.title).toBeTruthy();
        expect(fact.fact).toBeTruthy();
        expect(fact.biblicalReference).toBeTruthy();
      });
    });
  });

  it("returns undefined for unknown ebook slug", () => {
    const unknown = getEBookBySlug("non-existent-ebook");
    expect(unknown).toBeUndefined();
  });
});
