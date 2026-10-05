// The one Lampstand streak: listen for at least 10 minutes a day (Walk and
// Sleep combined), counted in the reader's local day. Pure helpers are
// exported for tests; useListening() is the React hook the players and the
// home screen share.

export const DAILY_GOAL_SECONDS = 10 * 60;
const STORAGE_KEY = "lampstand-listening-v1";
const CHANGE_EVENT = "lampstand-listening-change";

/** Seconds listened per local day, keyed "YYYY-MM-DD". */
export type ListeningLog = Record<string, number>;

/** The reader's local calendar day (not UTC), e.g. "2026-10-05". */
export function localDayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function previousDay(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  return localDayKey(new Date(y, m - 1, d - 1));
}

/**
 * Consecutive days with the goal met, ending today. If today is not met yet,
 * the streak still counts up to yesterday: it is only lost once a whole day
 * passes without 10 minutes.
 */
export function computeStreak(log: ListeningLog, today = localDayKey(), goal = DAILY_GOAL_SECONDS): number {
  let day = (log[today] ?? 0) >= goal ? today : previousDay(today);
  let streak = 0;
  while ((log[day] ?? 0) >= goal) {
    streak++;
    day = previousDay(day);
  }
  return streak;
}

/** Add listened seconds to a day, keeping only the last 400 days. */
export function addListening(log: ListeningLog, seconds: number, day = localDayKey()): ListeningLog {
  if (!(seconds > 0)) return log;
  const next = { ...log, [day]: Math.round(((log[day] ?? 0) + seconds) * 10) / 10 };
  const keys = Object.keys(next).sort();
  for (const old of keys.slice(0, Math.max(0, keys.length - 400))) delete next[old];
  return next;
}

export function readLog(): ListeningLog {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ListeningLog) : {};
  } catch {
    return {};
  }
}

/** Record seconds of audio actually played. Players call this as they play. */
export function recordListening(seconds: number): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addListening(readLog(), seconds)));
  } catch {
    // Storage blocked: the streak simply does not advance this session.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribeListening(onChange: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}
