/**
 * The founding-member offer and the honest numbers behind "one founding member
 * funds about N chapters". Kept in one place so every page says the same thing.
 */
export const FOUNDING_PRICE = 99;
/** A real cap: the offer closes when this many founding members have joined. */
export const FOUNDING_CAP = 500;

/**
 * What one chapter costs to make, all in, from Genesis 1-10: Sleep narration
 * and timing (~$0.07), Walk narration and timing (~$0.07), about three
 * paintings (~$0.20) and ~15% for re-dos (~$0.05). Streaming from storage is
 * effectively free. Update if prices change.
 */
export const COST_PER_CHAPTER = 0.39;
export const BIBLE_CHAPTERS = 1189;
/** What reaches us from a $99 sale after Paddle's fee (5% + $0.50). */
const NET_FROM_FOUNDING = FOUNDING_PRICE * 0.95 - 0.5;

/** Chapters one founding member pays for, rounded down to a safe round number. */
export function chaptersFundedPerMember(): number {
  return Math.floor(NET_FROM_FOUNDING / COST_PER_CHAPTER / 50) * 50;
}

/** Founding members it takes to fund every chapter of the Bible. */
export function membersToFundBible(): number {
  return Math.ceil((BIBLE_CHAPTERS * COST_PER_CHAPTER) / NET_FROM_FOUNDING);
}
