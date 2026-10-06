// The four sections of Lampstand, all on the home page: Today, Walk, Sleep and
// Breathe. Everything else (quizzes, life topics, Premium, profile) is under More.

export type Section = "today" | "walk" | "sleep" | "breathe";
export const SECTIONS: Section[] = ["today", "walk", "sleep", "breathe"];

/** The page that holds the four sections. */
export function sectionsHome(): string {
  return "/";
}

export function sectionHref(section: Section): string {
  return section === "today" ? "/" : `/?tab=${section}`;
}

export function parseSection(value: string | null | undefined): Section | null {
  return SECTIONS.includes(value as Section) ? (value as Section) : null;
}
