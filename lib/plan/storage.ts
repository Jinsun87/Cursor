import { buildPlan, startForDayOn, type PlanDay, type PlanInput } from "./build";

const KEY = "lampstand-plan-v2";
const EVENT = "lampstand:plan";

export type PlanPlace = { day: number; part: number; verse: number };

export type SavedPlan = {
  input: PlanInput;
  /** Day indexes the reader marked as read. */
  done: number[];
  place: PlanPlace;
  /** Set when the reader caught up after missed days: the same days, dated from here. */
  scheduleStart?: string;
  /** When this plan last changed (ms), so syncing with the account keeps the newer one. */
  updatedAt?: number;
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
    if (!parsed?.input?.start || typeof parsed.input.spanDays !== "number" || !Array.isArray(parsed.done)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeSavedPlan(plan: SavedPlan): void {
  store({ ...plan, updatedAt: Date.now() });
}

function store(plan: SavedPlan): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(plan));
  } catch {
    // Private mode: the plan still works for this visit.
  }
  window.dispatchEvent(new Event(EVENT));
}

/** Take in the plan from the account (already merged there), keeping its own change time. */
export function applyRemotePlan(plan: SavedPlan, at: number): boolean {
  const local = readSavedPlan();
  const next = { ...plan, updatedAt: at };
  if (local && JSON.stringify(local) === JSON.stringify(next)) return false;
  store(next);
  return true;
}

/** Forget the plan on this device (on sign-out; it is kept in the account). */
export function clearSavedPlan(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // nothing to clear
  }
  window.dispatchEvent(new Event(EVENT));
}

/** Calls onChange whenever the plan is saved, here, in another tab, or by a sync. */
export function subscribePlan(onChange: () => void): () => void {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function daysOf(plan: SavedPlan): PlanDay[] {
  return buildPlan(plan.input, plan.scheduleStart);
}

/** The first day that is not marked read, or the last day when all are read. */
export function nextUnread(plan: SavedPlan, days: PlanDay[]): number {
  const done = new Set(plan.done);
  const found = days.find((d) => !done.has(d.index));
  return found ? found.index : Math.max(0, days.length - 1);
}

/** Unread days dated before today. */
export function missedDays(plan: SavedPlan, days: PlanDay[], today: string): PlanDay[] {
  const done = new Set(plan.done);
  return days.filter((d) => d.date < today && !done.has(d.index));
}

/** Move the rest of the plan forward so the next unread day is today. Nothing is marked read. */
export function catchUp(plan: SavedPlan, days: PlanDay[], today: string): SavedPlan {
  const next = nextUnread(plan, days);
  return { ...plan, scheduleStart: startForDayOn(today, next, plan.input.skipWeekdays) };
}

/** Same plan settings? (Saving the same settings again keeps progress.) */
export function sameInput(a: PlanInput, b: PlanInput): boolean {
  return (
    a.scope === b.scope &&
    a.order === b.order &&
    a.spanDays === b.spanDays &&
    a.start === b.start &&
    [...a.skipWeekdays].sort().join() === [...b.skipWeekdays].sort().join()
  );
}
