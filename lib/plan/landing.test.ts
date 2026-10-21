import { describe, expect, it } from "vitest";
import { PRESETS } from "./build";
import { PLAN_PAGES, compactReadings, planFaq, presetSchedule, scheduleStats } from "./landing";

describe("plan pages", () => {
  it("has a public page for every preset, with a unique address", () => {
    expect(PLAN_PAGES.map((p) => p.presetId).sort()).toEqual(PRESETS.map((p) => p.id).sort());
    expect(new Set(PLAN_PAGES.map((p) => p.slug)).size).toBe(PLAN_PAGES.length);
  });

  it("keeps titles and descriptions within what search results show", () => {
    for (const p of PLAN_PAGES) {
      expect(`${p.metaTitle} · Lampstand`.length, p.slug).toBeLessThanOrEqual(62);
      expect(p.description.length, p.slug).toBeLessThanOrEqual(170);
    }
  });

  it("schedules every chapter of each preset, six days a week", () => {
    const whole = scheduleStats(presetSchedule(PLAN_PAGES[0]));
    expect(whole.chapters).toBe(1189);
    expect(whole.days).toBeLessThanOrEqual(313);
    expect(whole.minutesPerDay).toBeGreaterThan(5);
  });
});

describe("compactReadings", () => {
  it("shows runs of chapters as ranges", () => {
    expect(
      compactReadings([
        { book: "Genesis", chapter: 1, verses: 31 },
        { book: "Genesis", chapter: 2, verses: 25 },
        { book: "Genesis", chapter: 3, verses: 24 },
        { book: "Matthew", chapter: 1, verses: 25 },
      ]),
    ).toBe("Genesis 1–3 · Matthew 1");
  });

  it("names a run of psalms in the plural and keeps gaps apart", () => {
    expect(
      compactReadings([
        { book: "Psalm", chapter: 1, verses: 6 },
        { book: "Psalm", chapter: 2, verses: 12 },
        { book: "Psalm", chapter: 119, verses: 176 },
      ]),
    ).toBe("Psalms 1–2 · Psalm 119");
  });
});

describe("planFaq", () => {
  it("states the real daily length of the year plan", () => {
    const { minutesPerDay, versesPerDay } = scheduleStats(presetSchedule(PLAN_PAGES[0]));
    const answer = planFaq().find((f) => f.q.startsWith("How long"))!.a;
    expect(answer).toContain(`${versesPerDay} verses`);
    expect(answer).toContain(`${minutesPerDay} minutes`);
  });
});
