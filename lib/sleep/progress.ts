"use client";

import { useEffect, useState } from "react";

/**
 * Where the reader is in each chapter, shared by Walk and Sleep and kept on
 * this device. Saved as a verse, not seconds: the two readings run at
 * different speeds, so "Genesis 3:14" is the same place in both.
 */
export type ChapterProgress = { verse: number; done: boolean; at: number };
export type ReadingProgress = Record<string, ChapterProgress>;

const KEY = "lampstand-reading-progress";
const EVENT = "lampstand:reading-progress";

export function readProgress(): ReadingProgress {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}") as ReadingProgress;
  } catch {
    return {};
  }
}

/**
 * Remember the verse being read; done marks the chapter finished. Reading a
 * finished chapter again makes it unfinished, so pausing a replay near the
 * start keeps Walk and Sleep on that chapter instead of skipping ahead.
 */
export function saveProgress(slug: string, verse: number, done = false) {
  try {
    const all = readProgress();
    const was = all[slug];
    if (!done && was && was.verse === verse && !was.done) return; // nothing new
    all[slug] = { verse: done ? 1 : Math.max(1, verse), done, at: Date.now() };
    localStorage.setItem(KEY, JSON.stringify(all));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    // Private mode or storage full: progress is a convenience, never required.
  }
}

/** Per chapter, the more recent of two progress records (used when syncing with the account). */
export function mergeProgress(local: ReadingProgress, remote: ReadingProgress): ReadingProgress {
  const out: ReadingProgress = { ...local };
  for (const [slug, p] of Object.entries(remote)) {
    if (!out[slug] || p.at > out[slug].at) out[slug] = p;
  }
  return out;
}

/** Take in progress from the account (newer per chapter wins). Returns true if anything changed. */
export function applyRemoteProgress(remote: ReadingProgress): boolean {
  const local = readProgress();
  const merged = mergeProgress(local, remote);
  if (JSON.stringify(merged) === JSON.stringify(local)) return false;
  try {
    localStorage.setItem(KEY, JSON.stringify(merged));
  } catch {
    return false;
  }
  window.dispatchEvent(new Event(EVENT));
  return true;
}

/** Forget reading progress on this device (on sign-out; it is kept in the account). */
export function clearProgress() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // nothing to clear
  }
  window.dispatchEvent(new Event(EVENT));
}

/** Calls onChange whenever reading progress is saved, here or in another tab. */
export function subscribeProgress(onChange: () => void): () => void {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Live view of the progress, updated whenever either player saves. */
export function useReadingProgress(): ReadingProgress {
  const [progress, setProgress] = useState<ReadingProgress>({});
  useEffect(() => {
    const refresh = () => setProgress(readProgress());
    refresh();
    window.addEventListener(EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return progress;
}

/**
 * The chapter to offer next, in Walk or Sleep: the one last read if it was left
 * part-way (with the verse to continue from), otherwise the next unfinished
 * one after it, otherwise the first.
 */
export function pickNext<T extends { slug: string }>(chapters: T[], progress: ReadingProgress): { chapter: T; verse: number } {
  const last = Object.entries(progress)
    .filter(([slug]) => chapters.some((c) => c.slug === slug))
    .sort((a, b) => b[1].at - a[1].at)[0];
  if (!last) return { chapter: chapters[0], verse: 1 };
  const k = chapters.findIndex((c) => c.slug === last[0]);
  if (last[1].verse > 1 || !last[1].done) return { chapter: chapters[k], verse: last[1].verse };
  const next = chapters.slice(k + 1).find((c) => !progress[c.slug]?.done) ?? chapters.find((c) => !progress[c.slug]?.done);
  return { chapter: next ?? chapters[k], verse: 1 };
}
