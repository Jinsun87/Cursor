"use client";

import { useEffect, useState } from "react";
import type { SleepChapter } from "@/lib/sleep/types";
import { useSleepAudio, type ReadingMode } from "@/lib/sleep/sleep-audio";
import { pickNext, useReadingProgress } from "@/lib/sleep/progress";
import { BookShelf } from "./BookShelf";
import "./sleep.css";

const COPY: Record<ReadingMode, { next: string; resume: string; note: string; how: string }> = {
  walk: {
    next: "Today's reading",
    resume: "Continue today",
    note: "A clear, brisk reading for a walk, a commute or the dishes. Your place is shared with Sleep.",
    how: "read aloud, word for word",
  },
  sleep: {
    next: "Tonight's chapter",
    resume: "Continue tonight",
    note: "Opens full screen. Set a sleep timer and the voice fades out as you drift off.",
    how: "read softly, word for word",
  },
};

/**
 * Walk or Sleep: the chapter to read next as one card (the next unfinished
 * chapter, or the one left part-way, from that verse), then the shelf: books
 * and each book's chapters. Both modes share one reading position, kept as a verse.
 */
export function ReadingLanding({
  mode,
  chapters,
  seconds,
}: {
  mode: ReadingMode;
  chapters: SleepChapter[];
  seconds: Record<string, number>;
}) {
  const s = useSleepAudio();
  const progress = useReadingProgress();
  const copy = COPY[mode];
  // Decided after mount, from this device's saved progress.
  const [pick, setPick] = useState<{ chapter: SleepChapter; verse: number }>({ chapter: chapters[0], verse: 1 });
  useEffect(() => setPick(pickNext(chapters, progress)), [chapters, progress]);

  const { chapter, verse } = pick;
  const live = s.chapter?.slug === chapter.slug && s.mode === mode && s.playing;
  const minutes = (slug: string) => Math.max(1, Math.round((seconds[slug] ?? 0) / 60));
  const begin = (c: SleepChapter, from: number) => s.open(c, { mode, verse: from });

  return (
    <div className="sl-wrap">
      <div className="sl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="sl-art" src={chapter.verses[0].image} alt="" />
        <div className="sl-veil" />
        <div className="sl-body">
          <p className="sl-eyebrow">{verse > 1 ? copy.resume : copy.next}</p>
          <h2 className="sl-title">
            {chapter.book} {chapter.chapter}
          </h2>
          <p className="sl-sub">{chapter.title}</p>
          <p className="sl-meta">
            {minutes(chapter.slug)} min · {chapter.verses.length} verses · {copy.how}
          </p>
          <div className="sl-actions">
            <button type="button" className="sl-begin" onClick={() => (live ? s.expand() : begin(chapter, verse))}>
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <path d="M8.5 5.2 L19 12 L8.5 18.8 Z" fill="currentColor" />
              </svg>
              {live ? "Open the player" : verse > 1 ? `Continue from verse ${verse}` : "Begin"}
            </button>
            {verse > 1 && !live ? (
              <button type="button" className="sl-over" onClick={() => begin(chapter, 1)}>
                Start over
              </button>
            ) : null}
          </div>
          <p className="sl-note">{copy.note}</p>
        </div>
      </div>

      <BookShelf mode={mode} chapters={chapters} seconds={seconds} tonightSlug={chapter.slug} />
    </div>
  );
}
