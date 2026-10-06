import { describe, expect, it } from "vitest";
import { parseSection, sectionHref, sectionsHome } from "./nav";

describe("four-section navigation", () => {
  it("keeps every section on the home page", () => {
    expect(sectionsHome()).toBe("/");
    expect(sectionHref("today")).toBe("/");
    expect(sectionHref("sleep")).toBe("/?tab=sleep");
    expect(sectionHref("breathe")).toBe("/?tab=breathe");
  });

  it("accepts only known sections from the address bar", () => {
    expect(parseSection("walk")).toBe("walk");
    expect(parseSection("quizzes")).toBeNull();
    expect(parseSection(null)).toBeNull();
  });
});
