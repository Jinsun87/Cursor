import { BOOKS, type BibleBook } from "./books";

export type PlanScope = "bible" | "ot" | "nt" | "gospels" | "psalms";
export type PlanOrder = "canonical" | "gospels-first" | "ot-and-nt";

export type Reading = { book: string; chapter: number; verses: number };

export type PlanDay = {
  index: number;
  /** Local calendar date, YYYY-MM-DD. */
  date: string;
  readings: Reading[];
};

export type PlanInput = {
  scope: PlanScope;
  order: PlanOrder;
  /** How many days should carry a reading. A shorter book finishes in fewer days. */
  readingDays: number;
  /** First calendar day, YYYY-MM-DD. */
  start: string;
  /** Weekdays with no reading. 0 is Sunday. */
  skipWeekdays: number[];
};

export const GOSPELS = ["Matthew", "Mark", "Luke", "John"];

export const PRESETS: { id: string; label: string; scope: PlanScope; order: PlanOrder; readingDays: number }[] = [
  { id: "bible-year", label: "Whole Bible in a year", scope: "bible", order: "ot-and-nt", readingDays: 365 },
  { id: "nt-90", label: "New Testament in 90 days", scope: "nt", order: "canonical", readingDays: 90 },
  { id: "gospels-30", label: "Gospels in 30 days", scope: "gospels", order: "canonical", readingDays: 30 },
  { id: "psalms-30", label: "Psalms in a month", scope: "psalms", order: "canonical", readingDays: 30 },
];

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function formatISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addCalendarDays(iso: string, days: number): string {
  const date = parseISODate(iso);
  date.setDate(date.getDate() + days);
  return formatISODate(date);
}

function chaptersOf(book: BibleBook): Reading[] {
  return book.verseCounts.map((verses, i) => ({ book: book.name, chapter: i + 1, verses }));
}

function booksFor(scope: PlanScope): BibleBook[] {
  if (scope === "ot") return BOOKS.filter((b) => b.testament === "Old Testament");
  if (scope === "nt") return BOOKS.filter((b) => b.testament === "New Testament");
  if (scope === "gospels") return BOOKS.filter((b) => GOSPELS.includes(b.name));
  if (scope === "psalms") return BOOKS.filter((b) => b.name === "Psalm");
  return BOOKS;
}

/** Chapter list in reading order. Old-and-New is applied later, one track at a time. */
export function readingsFor(scope: PlanScope, order: PlanOrder): Reading[] {
  const books = booksFor(scope);
  if (order === "gospels-first" && scope === "bible") {
    const gospels = BOOKS.filter((b) => GOSPELS.includes(b.name));
    const restNt = BOOKS.filter((b) => b.testament === "New Testament" && !GOSPELS.includes(b.name));
    const ot = BOOKS.filter((b) => b.testament === "Old Testament");
    return [...gospels, ...restNt, ...ot].flatMap(chaptersOf);
  }
  return books.flatMap(chaptersOf);
}

/**
 * Fill `days` buckets by verse weight. A chapter is never split.
 * Fewer chapters than days leaves later buckets empty.
 * Days left empty by a long chapter borrow the next chapter so the plan
 * does not collapse into fewer, heavier days.
 */
export function packIntoDays(items: Reading[], days: number): Reading[][] {
  const count = Math.max(1, Math.floor(days));
  const buckets: Reading[][] = Array.from({ length: count }, () => []);
  if (!items.length) return buckets;
  if (items.length <= count) {
    items.forEach((item, i) => buckets[i].push(item));
    return buckets;
  }
  const total = items.reduce((n, r) => n + r.verses, 0);
  let cursor = 0;
  for (const item of items) {
    const mid = cursor + item.verses / 2;
    const day = Math.min(count - 1, Math.floor((mid / total) * count));
    buckets[day].push(item);
    cursor += item.verses;
  }
  for (let i = 0; i < buckets.length; i += 1) {
    if (buckets[i].length) continue;
    for (let j = i + 1; j < buckets.length; j += 1) {
      if (buckets[j].length > 1) {
        buckets[i].push(buckets[j].shift()!);
        break;
      }
    }
  }
  return buckets;
}

function readingDates(start: string, count: number, skipWeekdays: number[]): string[] {
  const skip = new Set(skipWeekdays.filter((d) => d >= 0 && d <= 6));
  if (skip.size >= 7) skip.clear();
  const dates: string[] = [];
  let cursor = start;
  // A guard so a bad start can never loop forever.
  for (let step = 0; dates.length < count && step < count + 3700; step += 1) {
    if (!skip.has(parseISODate(cursor).getDay())) dates.push(cursor);
    cursor = addCalendarDays(cursor, 1);
  }
  return dates;
}

function zipTracks(left: Reading[][], right: Reading[][]): Reading[][] {
  const n = Math.max(left.length, right.length);
  const days: Reading[][] = [];
  for (let i = 0; i < n; i += 1) {
    const readings = [...(left[i] ?? []), ...(right[i] ?? [])];
    if (readings.length) days.push(readings);
  }
  return days;
}

export function buildPlan(input: PlanInput): PlanDay[] {
  const days = Math.min(3660, Math.max(1, Math.floor(input.readingDays) || 1));
  let groups: Reading[][];
  if (input.order === "ot-and-nt" && input.scope === "bible") {
    const ot = readingsFor("ot", "canonical");
    const nt = readingsFor("nt", "canonical");
    groups = zipTracks(packIntoDays(ot, days), packIntoDays(nt, days));
  } else {
    groups = packIntoDays(readingsFor(input.scope, input.order), days).filter((g) => g.length);
  }
  const dates = readingDates(input.start, groups.length, input.skipWeekdays);
  return groups.map((readings, index) => ({ index, date: dates[index] ?? input.start, readings }));
}

export function dayVerseCount(day: PlanDay): number {
  return day.readings.reduce((n, r) => n + r.verses, 0);
}

/** A short warning when the plan is about to become the kind people abandon. */
export function planCaution(days: PlanDay[]): string | null {
  const lev = days.findIndex((d) => d.readings.some((r) => r.book === "Leviticus"));
  if (lev >= 0 && lev < 70) {
    return `Leviticus starts on day ${lev + 1}. That is where most year-long plans stop. The text is still here when you get there.`;
  }
  const heavy = days.find((d) => dayVerseCount(d) > 150);
  if (heavy) {
    const where = heavy.readings.map((r) => `${r.book} ${r.chapter}`).join(", ");
    return `${where} is a long sitting (${dayVerseCount(heavy)} verses). Read it, or come back to it.`;
  }
  return null;
}

export function describeReadings(day: PlanDay): string {
  return day.readings.map((r) => `${r.book} ${r.chapter}`).join(" · ");
}
