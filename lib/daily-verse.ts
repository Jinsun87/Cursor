// Browser-safe part of "Verse for today": the type and today's pick.
// The pool itself is built on the server in lib/verse-of-day.ts.

export type DailyVerse = { reference: string; text: string };

/** Same verse all day for a given local date; moves on at local midnight. */
export function pickDailyVerse(pool: DailyVerse[], date = new Date()): DailyVerse | undefined {
  if (!pool.length) return undefined;
  const dayNumber = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
  return pool[(((dayNumber * 37) % pool.length) + pool.length) % pool.length];
}
