import { describe, expect, it } from "vitest";
import { BOOKS } from "./books";
import {
  PRESETS,
  addCalendarDays,
  parseISODate,
  buildPlan,
  dayVerseCount,
  packIntoDays,
  readingDaysWithin,
  readingsFor,
  startForDayOn,
  type PlanInput,
  type Reading,
} from "./build";

const key = (r: Reading) => `${r.book} ${r.chapter}`;
const position = (r: Reading) => BOOKS.findIndex((b) => b.name === r.book) * 1000 + r.chapter;
const isInOrder = (list: Reading[]) => list.every((r, i) => i === 0 || position(r) > position(list[i - 1]));

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
    expect(readings.map(key).sort()).toEqual(readingsFor("bible", "canonical").map(key).sort());
  });

  it("reads every scope but the whole Bible in Bible order, whatever order is chosen", () => {
    expect(readingsFor("psalms", "gospels-first")).toEqual(readingsFor("psalms", "canonical"));
    expect(readingsFor("nt", "ot-and-nt")).toEqual(readingsFor("nt", "canonical"));
  });
});

describe("packIntoDays", () => {
  it("never moves a chapter out of order and never leaves a day empty", () => {
    const cases: [Reading[], number][] = [
      [readingsFor("nt", "canonical"), 200],
      [readingsFor("psalms", "canonical"), 100],
      [readingsFor("psalms", "canonical"), 30],
      [readingsFor("bible", "canonical"), 900],
      [readingsFor("bible", "canonical"), 365],
      [readingsFor("ot", "canonical"), 365],
    ];
    for (const [items, days] of cases) {
      const packed = packIntoDays(items, days);
      expect(packed).toHaveLength(days);
      expect(packed.every((d) => d.length > 0)).toBe(true);
      expect(isInOrder(packed.flat())).toBe(true);
      expect(packed.flat()).toHaveLength(items.length);
    }
  });

  it("keeps days roughly even", () => {
    const packed = packIntoDays(readingsFor("nt", "canonical"), 90);
    const loads = packed.map((d) => d.reduce((n, r) => n + r.verses, 0));
    const mean = loads.reduce((n, v) => n + v, 0) / loads.length;
    expect(Math.max(...loads)).toBeLessThan(mean * 2);
  });

  it("gives one chapter a day when there are more days than chapters", () => {
    const packed = packIntoDays(readingsFor("gospels", "canonical").slice(0, 2), 5);
    expect(packed).toEqual([[expect.objectContaining({ chapter: 1 })], [expect.objectContaining({ chapter: 2 })]]);
  });
});

describe("buildPlan", () => {
  const plan = (input: Partial<PlanInput>) =>
    buildPlan({ scope: "bible", order: "canonical", spanDays: 365, start: "2026-01-01", skipWeekdays: [], ...input });

  it("spreads the whole Bible over a year without splitting or dropping a chapter", () => {
    const days = plan({});
    expect(days).toHaveLength(365);
    expect(days[0].date).toBe("2026-01-01");
    const flat = days.flatMap((d) => d.readings);
    expect(flat).toHaveLength(readingsFor("bible", "canonical").length);
    expect(new Set(flat.map(key)).size).toBe(flat.length);
    expect(isInOrder(flat)).toBe(true);
  });

  it("finishes every preset within its span, Sundays off included", () => {
    for (const p of PRESETS) {
      const start = "2026-10-21";
      const days = buildPlan({ scope: p.scope, order: p.order, spanDays: p.spanDays, start, skipWeekdays: [0] });
      const lastAllowed = addCalendarDays(start, p.spanDays - 1);
      expect(days.at(-1)!.date <= lastAllowed, `${p.label} ends ${days.at(-1)!.date}`).toBe(true);
      expect(days.some((d) => parseISODate(d.date).getDay() === 0), p.label).toBe(false);
    }
  });

  it("gives each day an Old Testament reading and a New Testament reading", () => {
    const days = plan({ order: "ot-and-nt", start: "2026-01-05", skipWeekdays: [0] });
    expect(days[0].readings.some((r) => r.book === "Genesis")).toBe(true);
    expect(days[0].readings.some((r) => r.book === "Matthew")).toBe(true);
    expect(days.find((d) => d.date === "2026-01-11")).toBeUndefined();
    expect(days.find((d) => d.date === "2026-01-12")).toBeTruthy();
    const flat = days.flatMap((d) => d.readings);
    expect(isInOrder(flat.filter((r) => BOOKS.findIndex((b) => b.name === r.book) < 39))).toBe(true);
    expect(isInOrder(flat.filter((r) => BOOKS.findIndex((b) => b.name === r.book) >= 39))).toBe(true);
  });

  it("finishes early rather than inventing empty days", () => {
    const days = plan({ scope: "gospels", spanDays: 400 });
    expect(days.length).toBe(readingsFor("gospels", "canonical").length);
    expect(days.every((d) => d.readings.length === 1)).toBe(true);
  });

  it("keeps Psalm 119 in one sitting", () => {
    const days = plan({ scope: "psalms", spanDays: 30 });
    const holders = days.filter((d) => d.readings.some((r) => r.chapter === 119));
    expect(holders).toHaveLength(1);
    expect(dayVerseCount(holders[0])).toBeGreaterThanOrEqual(176);
  });

  it("re-dates the same days from a later start without changing what each day holds", () => {
    const input: PlanInput = { scope: "nt", order: "canonical", spanDays: 90, start: "2026-10-01", skipWeekdays: [0] };
    const original = buildPlan(input);
    const moved = buildPlan(input, "2026-10-20");
    expect(moved.map((d) => d.readings)).toEqual(original.map((d) => d.readings));
    expect(moved[0].date).toBe("2026-10-20");
  });
});

describe("dates", () => {
  it("counts reading days within a span, rest days excluded", () => {
    // 1–14 Jan 2026 holds two Sundays.
    expect(readingDaysWithin("2026-01-01", 14, [0])).toBe(12);
    expect(readingDaysWithin("2026-01-01", 14, [])).toBe(14);
  });

  it("finds the start that puts a given day on today", () => {
    // Wednesday 21 Oct 2026; Sundays off; day index 3 should land today.
    const start = startForDayOn("2026-10-21", 3, [0]);
    const days = buildPlan({ scope: "nt", order: "canonical", spanDays: 90, start: "2026-10-01", skipWeekdays: [0] }, start);
    expect(days[3].date).toBe("2026-10-21");
    // On a rest day, the day lands on the next reading day.
    expect(buildPlan({ scope: "nt", order: "canonical", spanDays: 90, start: "2026-10-01", skipWeekdays: [0] }, startForDayOn("2026-10-25", 0, [0]))[0].date).toBe("2026-10-26");
  });
});

describe("voiceIsFree", () => {
  it("follows the shelf: Genesis free, premium and unshelved books not", async () => {
    const { voiceIsFree } = await import("./books");
    expect(voiceIsFree("Genesis")).toBe(true);
    expect(voiceIsFree("Exodus")).toBe(false);
    expect(voiceIsFree("John")).toBe(false);
  });
});
