import { describe, expect, it } from "vitest";
import { FEELINGS, PRACTICES, getFeeling, practiceMeta } from "./calm";
import { startTab } from "./onboarding";

describe("calm me", () => {
  it("offers a prayer, a breath, a sound and a spoken task for every feeling", () => {
    expect(PRACTICES.map((practice) => practice.id)).toEqual(["prayer", "breathe", "music", "speak"]);
    for (const feeling of FEELINGS) {
      expect(feeling.prayer.text.length).toBeGreaterThan(40);
      expect(feeling.prayer.reference).toMatch(/\d/);
      expect(feeling.task.steps.length).toBeGreaterThanOrEqual(3);
      expect(feeling.tone).toBeGreaterThan(80);
      expect(getFeeling(feeling.id)).toBe(feeling);
    }
  });

  it("does not invent a feeling", () => {
    expect(getFeeling("joyful")).toBeUndefined();
    expect(practiceMeta("music").title).toMatch(/ambient/i);
  });
});

describe("onboarding opens calm me for an anxious heart", () => {
  it("sends worry to calm unless they came to sleep", () => {
    expect(startTab({ done: true, intent: "anxious" })).toBe("calm");
    expect(startTab({ done: true, intent: "anxious", when: "sleep" })).toBe("sleep");
    expect(startTab({ done: true, intent: "sleep" })).toBe("sleep");
  });
});
