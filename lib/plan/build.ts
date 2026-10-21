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
  /** Only the whole Bible has a choice of order; every other scope reads in Bible order. */
  order: PlanOrder;
  /** Calendar days from the start to the finish, rest days included: "in a year" is 365. */
  spanDays: number;
  /** First calendar day, YYYY-MM-DD. */
  start: string;
  /** Weekdays with no reading. 0 is Sunday. */
  skipWeekdays: number[];
};

export const GOSPELS = ["Matthew", "Mark", "Luke", "John"];
export const MAX_SPAN_DAYS = 3660;

export const PRESETS: { id: string; label: string; scope: PlanScope; order: PlanOrder; spanDays: number }[] = [
  { id: "bible-year", label: "Whole Bible in a year", scope: "bible", order: "ot-and-nt", spanDays: 365 },
  { id: "nt-90", label: "New Testament in 90 days", scope: "nt", order: "canonical", spanDays: 90 },
  { id: "gospels-30", label: "Gospels in 30 days", scope: "gospels", order: "canonical", spanDays: 30 },
  { id: "psalms-30", label: "Psalms in a month", scope: "psalms", order: "canonical", spanDays: 30 },
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

/** "Mon 20 Dec 2027", for people rather than machines. */
export function friendlyDate(iso: string): string {
  return parseISODate(iso).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
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

/** The order that actually applies: only the whole Bible can be reordered. */
export function effectiveOrder(scope: PlanScope, order: PlanOrder): PlanOrder {
  return scope === "bible" ? order : "canonical";
}

/** Chapter list in reading order. Old-and-New is applied later, one track at a time. */
export function readingsFor(scope: PlanScope, order: PlanOrder): Reading[] {
  if (effectiveOrder(scope, order) === "gospels-first") {
    const gospels = BOOKS.filter((b) => GOSPELS.includes(b.name));
    const restNt = BOOKS.filter((b) => b.testament === "New Testament" && !GOSPELS.includes(b.name));
    const ot = BOOKS.filter((b) => b.testament === "Old Testament");
    return [...gospels, ...restNt, ...ot].flatMap(chaptersOf);
  }
  return booksFor(scope).flatMap(chaptersOf);
}

/**
 * Split chapters into `days` days, in order, never splitting a chapter, so each day carries
 * about the same number of verses. Every day gets at least one chapter while chapters last;
 * with fewer chapters than days, the plan simply finishes early.
 */
export function packIntoDays(items: Reading[], days: number): Reading[][] {
  const count = Math.max(1, Math.floor(days));
  if (items.length <= count) return items.map((item) => [item]);
  const out: Reading[][] = [];
  let remaining = items.reduce((n, r) => n + r.verses, 0);
  let i = 0;
  for (let day = 0; day < count; day++) {
    const daysLeft = count - day;
    const target = remaining / daysLeft;
    const bucket: Reading[] = [];
    let load = 0;
    while (i < items.length) {
      const item = items[i];
      if (bucket.length) {
        // Leave at least one chapter for each day still to come.
        if (items.length - i <= daysLeft - 1) break;
        // Take the next chapter only if most of it fits under today's share.
        if (daysLeft > 1 && load + item.verses / 2 > target) break;
      }
      bucket.push(item);
      load += item.verses;
      i++;
    }
    remaining -= load;
    out.push(bucket);
  }
  return out;
}

/** The first `count` reading dates from `start`, skipping rest days. */
export function readingDates(start: string, count: number, skipWeekdays: number[]): string[] {
  const skip = restDays(skipWeekdays);
  const dates: string[] = [];
  let cursor = start;
  // A guard so a bad start can never loop forever.
  for (let step = 0; dates.length < count && step < count * 7 + 7; step += 1) {
    if (!skip.has(parseISODate(cursor).getDay())) dates.push(cursor);
    cursor = addCalendarDays(cursor, 1);
  }
  return dates;
}

function restDays(skipWeekdays: number[]): Set<number> {
  const skip = new Set(skipWeekdays.filter((d) => d >= 0 && d <= 6));
  if (skip.size >= 7) skip.clear();
  return skip;
}

/** How many reading days fall within `spanDays` calendar days from `start`. */
export function readingDaysWithin(start: string, spanDays: number, skipWeekdays: number[]): number {
  const skip = restDays(skipWeekdays);
  const span = Math.min(MAX_SPAN_DAYS, Math.max(1, Math.floor(spanDays) || 1));
  let n = 0;
  for (let k = 0; k < span; k++) if (!skip.has(parseISODate(addCalendarDays(start, k)).getDay())) n++;
  return Math.max(1, n);
}

/**
 * The start date that puts reading `dayIndex` on `today` (or the next reading day when today
 * is a rest day): used to catch up after missed days without marking anything read.
 */
export function startForDayOn(today: string, dayIndex: number, skipWeekdays: number[]): string {
  const skip = restDays(skipWeekdays);
  let cursor = today;
  while (skip.has(parseISODate(cursor).getDay())) cursor = addCalendarDays(cursor, 1);
  for (let k = 0; k < dayIndex; ) {
    cursor = addCalendarDays(cursor, -1);
    if (!skip.has(parseISODate(cursor).getDay())) k++;
  }
  return cursor;
}

/**
 * One track of an Old-and-New plan over `days` days. A track with fewer chapters than days
 * (the New Testament in a year) is spread evenly, so it runs to the end instead of stopping early.
 */
function trackDays(items: Reading[], days: number): Reading[][] {
  if (items.length >= days) return packIntoDays(items, days);
  const out: Reading[][] = Array.from({ length: days }, () => []);
  items.forEach((item, k) => out[Math.floor((k * days) / items.length)].push(item));
  return out;
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

/**
 * The plan: which chapters on which day. `scheduleStart` re-dates the same days from a later
 * start (catching up) without changing what each day contains.
 */
export function buildPlan(input: PlanInput, scheduleStart?: string): PlanDay[] {
  const days = readingDaysWithin(input.start, input.spanDays, input.skipWeekdays);
  const order = effectiveOrder(input.scope, input.order);
  const groups =
    order === "ot-and-nt"
      ? zipTracks(trackDays(readingsFor("ot", "canonical"), days), trackDays(readingsFor("nt", "canonical"), days))
      : packIntoDays(readingsFor(input.scope, order), days);
  const dates = readingDates(scheduleStart ?? input.start, groups.length, input.skipWeekdays);
  return groups.map((readings, index) => ({ index, date: dates[index] ?? input.start, readings }));
}

export function dayVerseCount(day: PlanDay): number {
  return day.readings.reduce((n, r) => n + r.verses, 0);
}

/** A gentle heads-up about the slow stretch or the longest sitting. */
export function planCaution(days: PlanDay[]): string | null {
  const lev = days.findIndex((d) => d.readings.some((r) => r.book === "Leviticus"));
  if (lev >= 0 && lev < 70) {
    return `Leviticus begins on day ${lev + 1}. It reads more slowly than the stories before it, so take it a chapter at a time.`;
  }
  const heavy = days.find((d) => dayVerseCount(d) > 150);
  if (heavy) {
    const where = heavy.readings.map((r) => `${r.book} ${r.chapter}`).join(", ");
    return `Day ${heavy.index + 1} is a long sitting: ${where}, ${dayVerseCount(heavy)} verses. Read it in parts if you like.`;
  }
  return null;
}

export function describeReadings(day: PlanDay): string {
  return day.readings.map((r) => `${r.book} ${r.chapter}`).join(" · ");
}
