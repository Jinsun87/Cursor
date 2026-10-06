import { readFileSync } from "node:fs";
import { join } from "node:path";

// The Berean Standard Bible, public domain (data/bsb.txt from BereanBible.com:
// one verse per line, "Book C:V<TAB>text"). The single source for Scripture
// text on Lampstand. Read on the server or in build scripts only.

export const BSB_NAME = "Berean Standard Bible";
export const BSB_CREDIT = "Scripture quotations are from the Berean Standard Bible (BSB), public domain.";

let verses: Map<string, string> | null = null;

function load(): Map<string, string> {
  if (verses) return verses;
  const raw = readFileSync(join(process.cwd(), "data", "bsb.txt"), "utf8").replace(/^﻿/, "");
  verses = new Map();
  for (const line of raw.split(/\r?\n/)) {
    const tab = line.indexOf("\t");
    if (tab < 0) continue;
    const ref = line.slice(0, tab);
    if (!/ \d+:\d+$/.test(ref)) continue; // header lines
    verses.set(ref, line.slice(tab + 1).trim());
  }
  return verses;
}

export type Passage = { book: string; chapter: number; from: number; to: number };

/** Parse "Philippians 4:6-7" or "Psalm 23:1" (en dash also accepted). */
export function parseReference(reference: string): Passage {
  const m = reference.trim().match(/^(.+?) (\d+):(\d+)(?:\s*[-–]\s*(\d+))?$/);
  if (!m) throw new Error(`Unsupported reference "${reference}"`);
  const from = Number(m[3]);
  const to = m[4] ? Number(m[4]) : from;
  if (to < from) throw new Error(`Backwards range in "${reference}"`);
  return { book: m[1], chapter: Number(m[2]), from, to };
}

/** The verses of a passage, in order. Throws if any verse is missing. */
export function getVerses(reference: string): { n: number; text: string }[] {
  const p = parseReference(reference);
  const all = load();
  const out: { n: number; text: string }[] = [];
  for (let n = p.from; n <= p.to; n++) {
    const text = all.get(`${p.book} ${p.chapter}:${n}`);
    if (text === undefined) throw new Error(`No BSB verse for ${p.book} ${p.chapter}:${n}`);
    out.push({ n, text });
  }
  return out;
}

/** The passage as one string, verses joined by spaces. */
export function getPassageText(reference: string): string {
  return getVerses(reference)
    .map((v) => v.text)
    .join(" ");
}

/** Every verse of a chapter. */
export function getChapter(book: string, chapter: number): { n: number; text: string }[] {
  const all = load();
  const out: { n: number; text: string }[] = [];
  for (let n = 1; all.has(`${book} ${chapter}:${n}`); n++) out.push({ n, text: all.get(`${book} ${chapter}:${n}`)! });
  if (!out.length) throw new Error(`No BSB chapter ${book} ${chapter}`);
  return out;
}
