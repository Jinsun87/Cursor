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

// When signed in, the account also knows what was heard on the reader's other
// devices (lib/sync). This device's own seconds and the other devices' seconds
// are kept apart, so a sync can never count the same minutes twice.
const OTHERS_KEY = "lampstand-listening-others";

function readKey(key: string): ListeningLog {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as ListeningLog) : {};
  } catch {
    return {};
  }
}

/** Seconds heard on this device only: what this device reports to the account. */
export function readOwnLog(): ListeningLog {
  return readKey(STORAGE_KEY);
}

/** Every device together, per day: what the lamp and the streak go by. */
export function combineLogs(own: ListeningLog, others: ListeningLog): ListeningLog {
  const all: ListeningLog = { ...others };
  for (const [day, s] of Object.entries(own)) all[day] = Math.round(((all[day] ?? 0) + s) * 10) / 10;
  return all;
}

export function readLog(): ListeningLog {
  return combineLogs(readOwnLog(), readKey(OTHERS_KEY));
}

/** Store what the reader's other devices heard, from the account (see lib/sync). */
export function setOtherDevicesLog(others: ListeningLog): void {
  const next = JSON.stringify(others);
  try {
    // Unchanged: say nothing, or every sync would trigger the next one.
    if ((localStorage.getItem(OTHERS_KEY) ?? "{}") === next) return;
    localStorage.setItem(OTHERS_KEY, next);
  } catch {
    // Storage blocked: only this device's minutes count here.
    return;
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** Forget all listening on this device (on sign-out; it is kept in the account). */
export function clearListening(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(OTHERS_KEY);
  } catch {
    // nothing to clear
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** Record seconds of audio actually played. Players call this as they play. */
export function recordListening(seconds: number): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addListening(readOwnLog(), seconds)));
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
