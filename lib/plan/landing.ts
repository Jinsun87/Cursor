import { BOOKS } from "./books";
import { PRESETS, buildPlan, dayVerseCount, type PlanDay, type Reading } from "./build";
import { WALK_SECONDS } from "@/lib/sleep/chapters";

/** A public page for each preset plan, with the whole schedule in the HTML for search and print. */
export type PlanPage = {
  slug: string;
  presetId: (typeof PRESETS)[number]["id"];
  /** The page heading, written the way people search for it. */
  heading: string;
  /** <title>, before " · Lampstand". */
  metaTitle: string;
  description: string;
  intro: string;
};

export const PLAN_PAGES: PlanPage[] = [
  {
    slug: "bible-in-a-year",
    presetId: "bible-year",
    heading: "Bible in a Year Reading Plan",
    metaTitle: "Bible in a Year Reading Plan: Free Daily Schedule",
    description:
      "A free Bible in a year reading plan: Old and New Testament side by side, six days a week, every chapter in order. See the full schedule, print it, or start it online.",
    intro:
      "Read the whole Bible in a year, six days a week: the Old Testament every day, with a New Testament chapter on most days alongside it. Every chapter is read whole and in order, and the days are balanced by length so no day is a marathon.",
  },
  {
    slug: "new-testament-in-90-days",
    presetId: "nt-90",
    heading: "New Testament in 90 Days Reading Plan",
    metaTitle: "New Testament in 90 Days: Free Reading Plan",
    description:
      "Read the New Testament in 90 days with this free reading plan: Matthew to Revelation in order, about three chapters a day. Full schedule, printable, or start it online.",
    intro:
      "Read the New Testament from Matthew to Revelation in 90 days, six days a week. It is about three chapters a day, enough to follow each Gospel and letter as a whole.",
  },
  {
    slug: "gospels-in-30-days",
    presetId: "gospels-30",
    heading: "Gospels in 30 Days Reading Plan",
    metaTitle: "Read the Gospels in 30 Days: Free Reading Plan",
    description:
      "Read Matthew, Mark, Luke and John in 30 days with this free reading plan. A daily schedule through the life of Jesus, printable, or start it online.",
    intro:
      "Walk through the life of Jesus in Matthew, Mark, Luke and John in a month, six days a week. Each day is three or four chapters, read whole.",
  },
  {
    slug: "psalms-in-a-month",
    presetId: "psalms-30",
    heading: "Psalms in a Month Reading Plan",
    metaTitle: "Psalms in a Month: Free 30-Day Reading Plan",
    description:
      "Pray through all 150 Psalms in a month with this free reading plan. A daily schedule of psalms, Psalm 119 kept whole, printable, or start it online.",
    intro:
      "Pray through all 150 psalms in a month, six days a week, about six psalms a day. Psalm 119, the longest chapter in the Bible, gets a day of its own.",
  },
];

/** Static schedules start on a Monday with Sundays off, the plan's default, and are shown as day numbers. */
const SCHEDULE_START = "2027-01-04";

export function planPage(slug: string): PlanPage | undefined {
  return PLAN_PAGES.find((p) => p.slug === slug);
}

export function presetOf(page: PlanPage) {
  return PRESETS.find((p) => p.id === page.presetId)!;
}

export function presetSchedule(page: PlanPage): PlanDay[] {
  const p = presetOf(page);
  return buildPlan({ scope: p.scope, order: p.order, spanDays: p.spanDays, start: SCHEDULE_START, skipWeekdays: [0] });
}

/** "Genesis 1–3 · Matthew 1": consecutive chapters of a book shown as a range. */
export function compactReadings(readings: Reading[]): string {
  const parts: string[] = [];
  let i = 0;
  while (i < readings.length) {
    let j = i;
    while (j + 1 < readings.length && readings[j + 1].book === readings[i].book && readings[j + 1].chapter === readings[j].chapter + 1) j++;
    const name = readings[i].book === "Psalm" && j > i ? "Psalms" : readings[i].book;
    parts.push(j > i ? `${name} ${readings[i].chapter}–${readings[j].chapter}` : `${name} ${readings[i].chapter}`);
    i = j + 1;
  }
  return parts.join(" · ");
}

/**
 * Seconds per verse when read aloud, from the Walk recordings made so far (a brisk, clear
 * reading). Used for an honest "about N minutes a day".
 */
export function secondsPerVerse(): number {
  const genesis = BOOKS.find((b) => b.name === "Genesis")!;
  let seconds = 0;
  let verses = 0;
  genesis.verseCounts.forEach((n, i) => {
    const s = WALK_SECONDS[`genesis-${i + 1}`];
    if (s) {
      seconds += s;
      verses += n;
    }
  });
  return verses ? seconds / verses : 6;
}

export function scheduleStats(days: PlanDay[]) {
  const chapters = days.reduce((n, d) => n + d.readings.length, 0);
  const verses = days.reduce((n, d) => n + dayVerseCount(d), 0);
  const minutes = Math.round((verses / days.length) * secondsPerVerse() / 60);
  return { days: days.length, chapters, versesPerDay: Math.round(verses / days.length), minutesPerDay: Math.max(1, minutes) };
}

/** Questions answered on /plan, shown on the page and given to search engines as FAQ data. */
export function planFaq(): { q: string; a: string }[] {
  const year = scheduleStats(presetSchedule(PLAN_PAGES[0]));
  return [
    {
      q: "Is this Bible reading plan free?",
      a: "Yes. The plan and the full text of every chapter are free. Genesis can also be heard free, read aloud in Walk (by day) and Sleep (by night). Voices for other books come with Lampstand Premium as they are recorded.",
    },
    {
      q: "How long does it take each day?",
      a: `The Bible in a year is about ${year.versesPerDay} verses a day, six days a week: roughly ${year.minutesPerDay} minutes read aloud, and usually less reading silently. Shorter plans, like the Gospels in 30 days, ask a little more each day.`,
    },
    {
      q: "What if I miss a day?",
      a: "Use Catch up on your plan. It moves the rest of the schedule forward so your next reading is today, without marking anything as read.",
    },
    {
      q: "Can I make my own plan?",
      a: "Yes. Choose the whole Bible, either Testament, the Gospels or the Psalms, how many days to finish in, your start date and whether to rest on Sundays. For the whole Bible you can also read in Bible order, Gospels first, or Old and New side by side.",
    },
    {
      q: "Which Bible translation is used?",
      a: "The Berean Standard Bible (BSB), a modern English translation in the public domain, read word for word.",
    },
    {
      q: "Where is my progress saved?",
      a: "In the browser you use, on that device. Keep using the same browser to keep your place.",
    },
  ];
}
