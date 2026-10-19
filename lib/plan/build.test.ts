import { describe, expect, it } from "vitest";
import { BOOKS } from "./books";
import { buildPlan, dayVerseCount, packIntoDays, readingsFor } from "./build";

describe("readingsFor", () => {
  it("covers every chapter of the Protestant canon once", () => {
    const readings = readingsFor("bible", "canonical");
    const expected = BOOKS.reduce((n, b) => n + b.verseCounts.length, 0);
    expect(readings).toHaveLength(expected);
    expect(readings[0]).toMatchObject({ book: "Genesis", chapter: 1, verses: 31 });
    expect(readings.at(-1)).toMatchObject({ book: "Revelation", chapter: 22 });
    expect(BOOKS.find((b) => b.name === "Psalm")?.verseCounts).toHaveLength(150);
  });

  it("puts the Gospels first when asked", () => {
    const readings = readingsFor("bible", "gospels-first");
    expect(readings[0].book).toBe("Matthew");
    expect(readings.find((r) => r.book === "Genesis")!.chapter).toBe(1);
    expect(readings.map((r) => `${r.book} ${r.chapter}`).sort()).toEqual(
      readingsFor("bible", "canonical").map((r) => `${r.book} ${r.chapter}`).sort(),
    );
  });
});

describe("buildPlan", () => {
  it("spreads the whole Bible over 365 days without splitting or dropping a chapter", () => {
    const days = buildPlan({
      scope: "bible",
      order: "canonical",
      readingDays: 365,
      start: "2026-01-01",
      skipWeekdays: [],
    });
    expect(days).toHaveLength(365);
    expect(days[0].date).toBe("2026-01-01");
    expect(days[0].readings[0]).toMatchObject({ book: "Genesis", chapter: 1 });
    const flat = days.flatMap((d) => d.readings);
    expect(flat).toHaveLength(readingsFor("bible", "canonical").length);
    expect(new Set(flat.map((r) => `${r.book} ${r.chapter}`)).size).toBe(flat.length);
    const loads = days.map(dayVerseCount);
    const mean = loads.reduce((n, v) => n + v, 0) / loads.length;
    expect(Math.max(...loads)).toBeLessThan(mean * 4);
  });

  it("gives each day an Old Testament reading and a New Testament reading", () => {
    const days = buildPlan({
      scope: "bible",
      order: "ot-and-nt",
      readingDays: 365,
      start: "2026-01-05",
      skipWeekdays: [0],
    });
    expect(days[0].readings.some((r) => r.book === "Genesis")).toBe(true);
    expect(days[0].readings.some((r) => r.book === "Matthew")).toBe(true);
    expect(days[0].date).toBe("2026-01-05");
    expect(days.find((d) => d.date === "2026-01-11")).toBeUndefined();
    const monday = days.find((d) => d.date === "2026-01-12");
    expect(monday).toBeTruthy();
  });

  it("does not invent empty days when the book is shorter than the request", () => {
    const days = buildPlan({
      scope: "gospels",
      order: "canonical",
      readingDays: 400,
      start: "2026-03-01",
      skipWeekdays: [],
    });
    expect(days.length).toBe(readingsFor("gospels", "canonical").length);
    expect(days.every((d) => d.readings.length === 1)).toBe(true);
  });

  it("keeps Psalm 119 in one sitting", () => {
    const days = buildPlan({
      scope: "psalms",
      order: "canonical",
      readingDays: 30,
      start: "2026-04-01",
      skipWeekdays: [],
    });
    const holders = days.filter((d) => d.readings.some((r) => r.chapter === 119));
    expect(holders).toHaveLength(1);
    expect(holders[0].readings.filter((r) => r.chapter === 119)[0].verses).toBe(176);
  });
});

describe("packIntoDays", () => {
  it("puts one item on each day when there are more days than items", () => {
    const packed = packIntoDays(
      [
        { book: "Genesis", chapter: 1, verses: 31 },
        { book: "Genesis", chapter: 2, verses: 25 },
      ],
      5,
    );
    expect(packed[0]).toHaveLength(1);
    expect(packed[1]).toHaveLength(1);
    expect(packed[4]).toHaveLength(0);
  });
});
