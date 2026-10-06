import { describe, expect, it } from "vitest";
import { getChapter, getPassageText, getVerses, parseReference } from "./bsb";

describe("BSB lookup", () => {
  it("parses single verses and ranges", () => {
    expect(parseReference("Psalm 23:1")).toEqual({ book: "Psalm", chapter: 23, from: 1, to: 1 });
    expect(parseReference("1 Peter 5:2-3")).toEqual({ book: "1 Peter", chapter: 5, from: 2, to: 3 });
    expect(parseReference("Romans 8:1–2")).toEqual({ book: "Romans", chapter: 8, from: 1, to: 2 });
    expect(() => parseReference("John 3")).toThrow();
  });

  it("returns the exact BSB text", () => {
    expect(getPassageText("Genesis 1:1")).toBe("In the beginning God created the heavens and the earth.");
    expect(getVerses("Philippians 4:6-7").map((v) => v.n)).toEqual([6, 7]);
    expect(getPassageText("Philippians 4:6-7")).toMatch(/^Be anxious for nothing/);
  });

  it("reads whole chapters", () => {
    expect(getChapter("Genesis", 1)).toHaveLength(31);
    expect(getChapter("Psalm", 117)).toHaveLength(2);
  });

  it("refuses verses that do not exist rather than inventing text", () => {
    expect(() => getVerses("Genesis 1:32")).toThrow(/No BSB verse/);
    expect(() => getChapter("Genesis", 51)).toThrow();
  });
});
