/**
 * The founding-member offer and the honest numbers behind it: what making the
 * Bible costs, and the ladder of what founding members fund. Kept in one place
 * so every page says the same thing.
 */
export const FOUNDING_PRICE = 99;
/** A real cap: the offer closes when this many founding members have joined. */
export const FOUNDING_CAP = 500;

/**
 * What one chapter costs to make, all in, from Genesis 1-36: Sleep narration on
 * ElevenLabs (~$0.40), Walk narration (~$0.04), verse timing for both (~$0.04),
 * about four paintings (~$0.27) and ~5% for re-dos. Streaming from storage is
 * effectively free. Update if prices change.
 */
export const COST_PER_CHAPTER = 0.8;
/** A second Sleep reader reuses the paintings: Sleep narration and timing only. */
const SECOND_READER_PER_CHAPTER = 0.44;
/** A new language reuses the paintings too: Walk and Sleep narration and timing. */
const LANGUAGE_PER_CHAPTER = 0.55;
export const BIBLE_CHAPTERS = 1189;
/** What reaches us from a $99 sale after Paddle's fee (5% + $0.50). */
export const NET_FROM_FOUNDING = FOUNDING_PRICE * 0.95 - 0.5;

/** Founding members it takes to fund every chapter of the Bible. */
export function membersToFundBible(): number {
  return Math.ceil((BIBLE_CHAPTERS * COST_PER_CHAPTER) / NET_FROM_FOUNDING);
}

/** Hosting, voice plans and payments (~$100) plus a modest wage for the developer (~$1,000), each month. */
export const RUNNING_PER_MONTH = 1100;
/** Founding members it takes to keep Lampstand running for a month. */
export const MEMBERS_PER_MONTH = Math.ceil(RUNNING_PER_MONTH / NET_FROM_FOUNDING);

export type Milestone = {
  title: string;
  note: string;
  /** What this step costs to make, in dollars; null for ongoing work. */
  cost: number | null;
  /** Founding members needed to reach this step, counting every step before it; null for ongoing work. */
  members: number | null;
};

const STEPS: Omit<Milestone, "members">[] = [
  { title: "The whole Bible", note: "All 66 books, read briskly for Walk and softly for Sleep, with paintings.", cost: BIBLE_CHAPTERS * COST_PER_CHAPTER },
  { title: "A second Sleep reader", note: "A gentle female voice for every chapter, as a choice beside Theo.", cost: BIBLE_CHAPTERS * SECOND_READER_PER_CHAPTER },
  { title: "Bedtime Bible Stories", note: "100 gentle, faithful retellings, from Noah to the Prodigal Son, with a mode for children.", cost: 200 },
  { title: "Spanish", note: "The whole Bible in Spanish, by day and by night.", cost: BIBLE_CHAPTERS * LANGUAGE_PER_CHAPTER },
  { title: "More languages", note: "Chosen by founding members' vote, one at a time.", cost: null },
  { title: "Apps with offline listening", note: "Lampstand for iPhone and Android, with chapters saved for no signal.", cost: null },
  { title: "Keeping it running", note: "Hosting, voices and a modest wage for the developer who builds and looks after Lampstand: about $1,100 a month, with no ads while you listen.", cost: null },
];

/** The funding ladder: each step and how many founding members bring it within reach. */
export const FOUNDING_LADDER: Milestone[] = (() => {
  let total = 0;
  return STEPS.map((step) => {
    if (step.cost === null) return { ...step, members: null };
    total += step.cost;
    return { ...step, members: Math.ceil(total / NET_FROM_FOUNDING) };
  });
})();

/** Founding members each further language needs. */
export const MEMBERS_PER_LANGUAGE = Math.ceil((BIBLE_CHAPTERS * LANGUAGE_PER_CHAPTER) / NET_FROM_FOUNDING);

export type FoundingSpots = { cap: number; taken: number; left: number };

/**
 * Founding spots taken so far, from the database (completed, unrefunded
 * purchases). Null when it cannot be read, so callers show the cap rather
 * than a made-up count.
 */
export async function fetchFoundingSpots(): Promise<FoundingSpots | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!url || !key) return null;
  try {
    const res = await fetch(`${url}/rest/v1/rpc/founding_spots_taken`, {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: "{}",
      next: { revalidate: 60 },
    } as RequestInit);
    if (!res.ok) return null;
    const taken = Number(await res.json());
    if (!Number.isFinite(taken)) return null;
    return { cap: FOUNDING_CAP, taken, left: Math.max(0, FOUNDING_CAP - taken) };
  } catch {
    return null;
  }
}
