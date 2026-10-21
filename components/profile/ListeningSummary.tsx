"use client";

import { useEffect, useState } from "react";
import { useListening } from "@/components/home2/useListening";
import { pickNext, useReadingProgress } from "@/lib/sleep/progress";
import { canListen } from "@/lib/sleep/access";
import { useApp } from "@/lib/store";
import { SLEEP_CHAPTERS, WALK_SECONDS } from "@/lib/sleep/chapters";
import { useSleepAudio, type ReadingMode } from "@/lib/sleep/sleep-audio";
import type { SleepChapter } from "@/lib/sleep/types";

/**
 * The profile's first section: the lamp (the daily listening streak), what has
 * been heard, and one tap to carry on in Walk or Sleep. Listening progress is
 * kept on this device.
 */
export function ListeningSummary() {
  const listening = useListening();
  const progress = useReadingProgress();
  const s = useSleepAudio();
  const [next, setNext] = useState<{ chapter: SleepChapter; verse: number } | null>(null);
  const { user } = useApp();
  const premium = Boolean(user?.premium);
  useEffect(() => setNext(pickNext(SLEEP_CHAPTERS.filter((c) => canListen(c, premium)), progress)), [progress, premium]);

  const heard = SLEEP_CHAPTERS.filter((c) => progress[c.slug]?.done && !(progress[c.slug].verse > 1)).length;
  const minutesToday = Math.floor(listening.secondsToday / 60);
  const open = (mode: ReadingMode) => next && s.open(next.chapter, { mode, verse: next.verse });

  return (
    <section className="mt-6 rounded-2xl border border-[var(--line)] bg-[var(--canvas-2)] p-5">
      <h2 className="font-display text-2xl">Your listening</h2>

      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl bg-black/20 p-3">
          <p className="font-display text-3xl text-[var(--gold)]">{listening.streak}</p>
          <p className="text-xs text-[var(--muted)]">{listening.streak === 1 ? "day" : "days"} lamp lit</p>
        </div>
        <div className="rounded-xl bg-black/20 p-3">
          <p className="font-display text-3xl">{Math.min(minutesToday, 99)}</p>
          <p className="text-xs text-[var(--muted)]">of 10 min today</p>
        </div>
        <div className="rounded-xl bg-black/20 p-3">
          <p className="font-display text-3xl">{heard}</p>
          <p className="text-xs text-[var(--muted)]">
            of {SLEEP_CHAPTERS.length} {SLEEP_CHAPTERS.length === 1 ? "chapter" : "chapters"} heard
          </p>
        </div>
      </div>

      {next ? (
        <div className="mt-5">
          <p className="text-sm text-[var(--muted)]">{next.verse > 1 ? "Carry on with" : "Up next"}</p>
          <p className="font-display text-xl">
            {next.chapter.book} {next.chapter.chapter} · {next.chapter.title}
            {next.verse > 1 ? <span className="text-base text-[var(--muted)]"> · from verse {next.verse}</span> : null}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => open("walk")}
              disabled={!(WALK_SECONDS[next.chapter.slug] > 0)}
              className="min-h-12 rounded-2xl border border-[var(--line-strong)] px-4 font-semibold disabled:opacity-50"
            >
              Walk
            </button>
            <button type="button" onClick={() => open("sleep")} className="btn btn-primary min-h-12 rounded-2xl px-4 font-semibold">
              Sleep
            </button>
          </div>
        </div>
      ) : null}
      <p className="mt-4 text-xs text-[var(--muted)]">Your lamp and reading place are kept on this device.</p>
    </section>
  );
}
