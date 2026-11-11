// The four sections of Lampstand, all on the home page: Today, Walk, Sleep and
// Calm me. Everything else (quizzes, life topics, Premium, profile) is under More.
// Old links used ?tab=breathe; that still opens Calm me.

export type Section = "today" | "walk" | "sleep" | "calm";
export const SECTIONS: Section[] = ["today", "walk", "sleep", "calm"];

/** The page that holds the four sections. */
export function sectionsHome(): string {
  return "/";
}

export function sectionHref(section: Section): string {
  return section === "today" ? "/" : `/?tab=${section}`;
}

export function parseSection(value: string | null | undefined): Section | null {
  if (value === "breathe") return "calm";
  return SECTIONS.includes(value as Section) ? (value as Section) : null;
}
