// The four-section navigation (Today, Walk, Sleep, Breathe + More).
//
// It is off on the live site until NEXT_PUBLIC_NEW_NAV=true, so visitors are
// never sent to sections that are not ready. The prototype page always shows
// it. Turning it on for everyone is that one environment variable: the home
// page then becomes the new Today screen and these links point at "/".

export const NEW_NAV_ENABLED = process.env.NEXT_PUBLIC_NEW_NAV === "true";
export const PREVIEW_HOME = "/home-preview";

export type Section = "today" | "walk" | "sleep" | "breathe";
export const SECTIONS: Section[] = ["today", "walk", "sleep", "breathe"];

/** Whether a page shows the new navigation. */
export function usesNewNav(pathname: string): boolean {
  return NEW_NAV_ENABLED || pathname === PREVIEW_HOME || pathname.startsWith(`${PREVIEW_HOME}/`);
}

/** The page that holds the four sections: "/" once live, the prototype until then. */
export function sectionsHome(): string {
  return NEW_NAV_ENABLED ? "/" : PREVIEW_HOME;
}

export function sectionHref(section: Section): string {
  const home = sectionsHome();
  return section === "today" ? home : `${home}?tab=${section}`;
}

export function parseSection(value: string | null | undefined): Section | null {
  return SECTIONS.includes(value as Section) ? (value as Section) : null;
}
