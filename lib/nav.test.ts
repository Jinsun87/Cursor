import { describe, expect, it } from "vitest";
import { NEW_NAV_ENABLED, parseSection, sectionHref, usesNewNav } from "./nav";

describe("four-section navigation", () => {
  it("is off on the live site unless switched on", () => {
    expect(NEW_NAV_ENABLED).toBe(process.env.NEXT_PUBLIC_NEW_NAV === "true");
  });

  it("always shows on the prototype page, and elsewhere only when switched on", () => {
    expect(usesNewNav("/home-preview")).toBe(true);
    expect(usesNewNav("/quizzes")).toBe(NEW_NAV_ENABLED);
    expect(usesNewNav("/home-previewer")).toBe(NEW_NAV_ENABLED);
  });

  it("links each section to the home page with ?tab=", () => {
    const home = NEW_NAV_ENABLED ? "/" : "/home-preview";
    expect(sectionHref("today")).toBe(home);
    expect(sectionHref("sleep")).toBe(`${home}?tab=sleep`);
  });

  it("accepts only known sections from the address bar", () => {
    expect(parseSection("breathe")).toBe("breathe");
    expect(parseSection("quizzes")).toBeNull();
    expect(parseSection(null)).toBeNull();
  });
});

describe("with NEXT_PUBLIC_NEW_NAV=true", () => {
  it("uses the new navigation everywhere and points sections at the real home page", async () => {
    const { vi } = await import("vitest");
    vi.stubEnv("NEXT_PUBLIC_NEW_NAV", "true");
    vi.resetModules();
    const nav = await import("./nav");
    expect(nav.usesNewNav("/quizzes")).toBe(true);
    expect(nav.sectionsHome()).toBe("/");
    expect(nav.sectionHref("today")).toBe("/");
    expect(nav.sectionHref("sleep")).toBe("/?tab=sleep");
    vi.unstubAllEnvs();
    vi.resetModules();
  });
});
