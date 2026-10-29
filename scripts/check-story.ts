/**
 * Checks a Bible story script (content/stories/<series>/<slug>.md) before it is voiced:
 *  - every Scripture quote matches the BSB word for word,
 *  - every reference in the fact-check table is a real BSB verse,
 *  - the spoken length, at the Sleep voice's measured pace, against the target.
 *
 *   npx tsx scripts/check-story.ts content/stories/women-of-the-bible/sarah.md [--wpm=136]
 *
 * Script format (see docs/stories/WRITING-PLAN.md):
 *  - "## Heading" lines are section titles and are not read aloud.
 *  - "[pause]" is a 4-second silence, "[long pause]" 10 seconds.
 *  - "> quote text [Genesis 18:14]" is a Scripture quote, read aloud without the reference.
 *  - Inline quotes: “quote text” [Genesis 21:6]. The reference is not read aloud. Every “…” in the
 *    script needs a reference, since quoted speech is always Scripture's own words.
 *  - Everything from "## Fact check" on is notes, not script.
 * Exits 1 if any quote or reference fails.
 */
import { readFileSync } from "node:fs";
import { getPassageText } from "../lib/bible/bsb";

const PAUSE_SECONDS = { "[pause]": 4, "[long pause]": 10 } as const;

const file = process.argv[2];
if (!file) {
  console.error("Usage: npx tsx scripts/check-story.ts <script.md> [--wpm=128]");
  process.exit(2);
}
const raw = readFileSync(file, "utf8").replace(/\r\n/g, "\n");
const front = raw.match(/^---\n([\s\S]*?)\n---\n/);
const meta = Object.fromEntries(
  (front?.[1] ?? "").split("\n").map((l) => [l.slice(0, l.indexOf(":")).trim(), l.slice(l.indexOf(":") + 1).trim()]),
);
// The narrator's measured pace: --wpm, else the script's "wpm:", else Theo's 128.
const wpm = Number(process.argv.find((a) => a.startsWith("--wpm="))?.slice(6) ?? meta.wpm ?? 128);
const body = raw.slice(front?.[0].length ?? 0);
const cut = body.search(/^## Fact check/m);
const script = cut >= 0 ? body.slice(0, cut) : body;
const notes = cut >= 0 ? body.slice(cut) : "";

/** Lowercase words only, so curly and straight quotes or commas never decide a match. */
const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/['’‘]/g, "")
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** A quote may skip words with "…"; each piece must appear in the passage, in order. */
function quoteMatches(quote: string, ref: string): string | null {
  let passage: string;
  try {
    passage = norm(getPassageText(ref));
  } catch (e) {
    return (e as Error).message;
  }
  let from = 0;
  for (const piece of quote.split(/…|\.\.\./).map(norm).filter(Boolean)) {
    const at = passage.indexOf(piece, from);
    if (at < 0) return `not in ${ref} (BSB): "${piece}"`;
    from = at + piece.length;
  }
  return null;
}

const problems: string[] = [];
let quotes = 0;
let pauseSeconds = 0;
const spoken: string[] = [];

for (const line of script.split("\n")) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  if (t in PAUSE_SECONDS) {
    pauseSeconds += PAUSE_SECONDS[t as keyof typeof PAUSE_SECONDS];
    continue;
  }
  const block = t.match(/^>\s*(.+?)\s*\[([^\]]+)\]$/);
  if (block) {
    quotes++;
    const bad = quoteMatches(block[1], block[2]);
    if (bad) problems.push(`Quote ${bad}`);
    spoken.push(block[1]);
    continue;
  }
  if (t.startsWith(">")) problems.push(`Quote without a reference: ${t.slice(0, 70)}`);
  let text = t;
  for (const m of t.matchAll(/“([^”]+)”\s*\[([^\]]+)\]/g)) {
    quotes++;
    const bad = quoteMatches(m[1], m[2]);
    if (bad) problems.push(`Quote ${bad}`);
    text = text.replace(m[0], `“${m[1]}”`);
  }
  if (/\[[^\]]*\]/.test(text)) problems.push(`Unknown marker left in the script: ${text.match(/\[[^\]]*\]/)![0]}`);
  // Quoted speech is Scripture's own words, so every quote needs its reference.
  for (const m of t.replace(/“([^”]+)”\s*\[[^\]]+\]/g, "").matchAll(/“([^”]+)”/g)) problems.push(`Quote without a reference: “${m[1]}”`);
  spoken.push(text);
}

// Every reference in the fact-check notes must be a real verse.
const refPattern = /\b((?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)?) (\d+):(\d+)(?:[-–](\d+))?/g;
let refs = 0;
for (const m of notes.matchAll(refPattern)) {
  refs++;
  try {
    getPassageText(`${m[1]} ${m[2]}:${m[3]}${m[4] ? `-${m[4]}` : ""}`);
  } catch (e) {
    problems.push(`Fact-check reference: ${(e as Error).message}`);
  }
}

const words = spoken.join(" ").split(/\s+/).filter(Boolean).length;
const minutes = words / wpm + pauseSeconds / 60;
const target = Number(meta.target_minutes) || 0;

console.log(`${meta.title ?? file}`);
console.log(`  ${words} spoken words, ${Math.round(pauseSeconds)}s of pauses → about ${minutes.toFixed(1)} min at ${wpm} wpm` +
  (target ? ` (target ${target} min, ${minutes < target * 0.9 ? "SHORT" : minutes > target * 1.1 ? "LONG" : "on target"})` : ""));
console.log(`  ${quotes} Scripture quotes checked against the BSB, ${refs} fact-check references`);
for (const p of problems) console.log(`  ✗ ${p}`);
if (!problems.length) console.log("  ✓ every quote and reference matches the BSB");
process.exit(problems.length ? 1 : 0);
