"use client";

import { useSyncExternalStore } from "react";
import { parseSection, type Section } from "./nav";

// Which section of the home screen is showing. The bottom bar and the home
// page share it, so switching sections is instant (no page load) and the
// address bar keeps ?tab= in step for sharing and the back button.

const EVENT = "lampstand-section";
let current: Section = "today";

export function getSection(): Section {
  return current;
}

export function setSection(section: Section, options: { updateUrl?: boolean } = {}): void {
  current = section;
  if (options.updateUrl !== false && typeof window !== "undefined") {
    const url = new URL(window.location.href);
    if (section === "today") url.searchParams.delete("tab");
    else url.searchParams.set("tab", section);
    window.history.replaceState(window.history.state, "", url);
  }
  window.dispatchEvent(new Event(EVENT));
}

/** The section named in the address bar, if any. */
export function sectionFromUrl(): Section | null {
  if (typeof window === "undefined") return null;
  return parseSection(new URL(window.location.href).searchParams.get("tab"));
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}

export function useSection(): Section {
  return useSyncExternalStore(subscribe, getSection, () => "today");
}
