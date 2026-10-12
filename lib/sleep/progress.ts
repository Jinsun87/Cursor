"use client";

import { useEffect, useState } from "react";

/** Where the reader stopped in each Sleep chapter, kept on this device. */
export type ChapterProgress = { t: number; done: boolean; at: number };
export type SleepProgress = Record<string, ChapterProgress>;

const KEY = "lampstand-sleep-progress";
const EVENT = "lampstand:sleep-progress";

export function readProgress(): SleepProgress {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}") as SleepProgress;
  } catch {
    return {};
  }
}

export function saveProgress(slug: string, t: number, done = false) {
  try {
    const all = readProgress();
    const was = all[slug];
    // Finishing a chapter sticks; starting it again only moves the place.
    all[slug] = { t: done ? 0 : Math.floor(t), done: done || Boolean(was?.done), at: Date.now() };
    localStorage.setItem(KEY, JSON.stringify(all));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    // Private mode or storage full: progress is a convenience, never required.
  }
}

/** Live view of the progress, updated whenever any player saves. */
export function useSleepProgress(): SleepProgress {
  const [progress, setProgress] = useState<SleepProgress>({});
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
 * The chapter to offer tonight: the one last listened to if unfinished,
 * otherwise the next one after it, otherwise the first.
 */
export function pickTonight<T extends { slug: string }>(chapters: T[], progress: SleepProgress): { chapter: T; resumeAt: number } {
  const last = Object.entries(progress)
    .filter(([slug]) => chapters.some((c) => c.slug === slug))
    .sort((a, b) => b[1].at - a[1].at)[0];
  if (!last) return { chapter: chapters[0], resumeAt: 0 };
  const k = chapters.findIndex((c) => c.slug === last[0]);
  if (last[1].t > 5) return { chapter: chapters[k], resumeAt: last[1].t };
  if (!last[1].done) return { chapter: chapters[k], resumeAt: 0 };
  const next = chapters.slice(k + 1).find((c) => !progress[c.slug]?.done) ?? chapters.find((c) => !progress[c.slug]?.done);
  return { chapter: next ?? chapters[k], resumeAt: 0 };
}
