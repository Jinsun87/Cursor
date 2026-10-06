import { describe, expect, it } from "vitest";
import { getPassageText } from "./bible/bsb";
import { dailyVersePool, pickDailyVerse } from "./verse-of-day";

describe("verse for today", () => {
  const pool = dailyVersePool();

  it("has a good-sized pool of short, exact BSB verses", () => {
    expect(pool.length).toBeGreaterThan(60);
    for (const v of pool) {
      expect(v.text).toBe(getPassageText(v.reference));
      expect(v.text.length).toBeLessThanOrEqual(200);
    }
  });

  it("keeps one verse all day and changes the next day", () => {
    const morning = pickDailyVerse(pool, new Date(2026, 9, 5, 6, 0));
    const night = pickDailyVerse(pool, new Date(2026, 9, 5, 23, 30));
    const tomorrow = pickDailyVerse(pool, new Date(2026, 9, 6, 6, 0));
    expect(night).toEqual(morning);
    expect(tomorrow).not.toEqual(morning);
  });
});
