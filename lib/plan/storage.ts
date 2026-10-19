import { buildPlan, type PlanDay, type PlanInput } from "./build";

const KEY = "lampstand-plan-v1";

export type PlanPlace = { day: number; part: number; verse: number };

export type SavedPlan = {
  input: PlanInput;
  /** Day indexes the reader marked as read. */
  done: number[];
  place: PlanPlace;
};

export function emptyPlace(): PlanPlace {
  return { day: 0, part: 0, verse: 1 };
}

export function readSavedPlan(): SavedPlan | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedPlan;
    if (!parsed?.input?.start || !Array.isArray(parsed.done)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeSavedPlan(plan: SavedPlan): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(plan));
  } catch {
    // Private mode: the plan still works for this visit.
  }
}

export function daysOf(plan: SavedPlan): PlanDay[] {
  return buildPlan(plan.input);
}

/** The first day that is not marked read, or the last day when all are read. */
export function nextUnread(plan: SavedPlan, days: PlanDay[]): number {
  const done = new Set(plan.done);
  const found = days.find((d) => !done.has(d.index));
  return found ? found.index : Math.max(0, days.length - 1);
}
