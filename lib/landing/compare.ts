/**
 * The comparison table on the home page. Competitor cells come from each product's own site or
 * store listing, checked on CHECKED_ON; anything we could not confirm is null and shows as a dash,
 * never a guess. Re-check before changing a cell, and update CHECKED_ON.
 *
 * Sources (11 Nov 2026):
 *   Sleep Bible  sleepbible.app home page (pricing, free books, features, its own comparison table)
 *   Dwell        App Store / Google Play listings and dwellapp.io (Solo $9.99/mo, $59.99/yr; sleep timer; read-along)
 *   Abide        help.abide.com (free tier with limited content; paid monthly or annual)
 *   Hallow       help.hallow.com (Individual $9.99/mo, $69.99/yr)
 *   YouTube      free with ads; no sleep timer or synced text in the player
 */
export const CHECKED_ON = "11 November 2026";

export type Cell = boolean | string | null;

export type Competitor = { id: string; name: string; note?: string };

export const COMPETITORS: Competitor[] = [
  { id: "lampstand", name: "Lampstand" },
  { id: "sleepbible", name: "Sleep Bible" },
  { id: "dwell", name: "Dwell" },
  { id: "abide", name: "Abide" },
  { id: "hallow", name: "Hallow" },
  { id: "youtube", name: "YouTube" },
];

export type Row = { label: string; hint?: string; cells: Record<string, Cell> };

export const ROWS: Row[] = [
  {
    label: "Price, monthly",
    cells: { lampstand: "$4.99", sleepbible: "$9.99", dwell: "$9.99", abide: null, hallow: "$9.99", youtube: "Free, with ads" },
  },
  {
    label: "Price, yearly",
    cells: { lampstand: "$39.99", sleepbible: "$59.99", dwell: "$59.99", abide: null, hallow: "$69.99", youtube: "Free, with ads" },
  },
  {
    label: "Lifetime option",
    cells: { lampstand: "$99, first 500", sleepbible: "$399.99 ($99.99 founders)", dwell: null, abide: null, hallow: false, youtube: false },
  },
  {
    label: "Free without a card",
    cells: { lampstand: "Genesis + 10 Psalms", sleepbible: "5 books", dwell: false, abide: "Limited", hallow: "Limited", youtube: true },
  },
  {
    label: "Same chapter by day and by night",
    hint: "A clear Walk voice and a soft Sleep voice, one shared bookmark",
    cells: { lampstand: true, sleepbible: false, dwell: false, abide: false, hallow: false, youtube: false },
  },
  {
    label: "Calm me: pick a feeling, get a practice",
    hint: "Prayer, box breathing, ambient tone or a line to say aloud",
    cells: { lampstand: true, sleepbible: false, dwell: false, abide: null, hallow: null, youtube: false },
  },
  {
    label: "Paintings for every passage",
    cells: { lampstand: true, sleepbible: true, dwell: false, abide: false, hallow: false, youtube: false },
  },
  {
    label: "Text that follows the voice",
    cells: { lampstand: "Verse by verse", sleepbible: "Word by word", dwell: true, abide: false, hallow: null, youtube: false },
  },
  {
    label: "Sleep timer with fade",
    cells: { lampstand: true, sleepbible: true, dwell: true, abide: null, hallow: null, youtube: false },
  },
  {
    label: "Rain under the reading",
    cells: { lampstand: true, sleepbible: true, dwell: "Music", abide: null, hallow: null, youtube: false },
  },
  {
    label: "Free reading plans, full text",
    cells: { lampstand: true, sleepbible: null, dwell: "Paid", abide: false, hallow: "Limited", youtube: false },
  },
  {
    label: "Bible stories for bedtime",
    cells: { lampstand: true, sleepbible: true, dwell: false, abide: true, hallow: null, youtube: null },
  },
  {
    label: "Ads during Scripture",
    cells: { lampstand: "Never", sleepbible: null, dwell: null, abide: null, hallow: null, youtube: "Yes" },
  },
  {
    label: "Translation",
    cells: { lampstand: "Berean Standard", sleepbible: null, dwell: null, abide: null, hallow: null, youtube: "Varies" },
  },
  {
    label: "No app store needed",
    hint: "Add to the home screen from the browser",
    cells: { lampstand: true, sleepbible: null, dwell: false, abide: false, hallow: false, youtube: true },
  },
];
