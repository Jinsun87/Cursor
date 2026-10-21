"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { useSleepAudio } from "@/lib/sleep/sleep-audio";
import { FOUNDING_PRICE } from "@/lib/founding";
import { trackEvent } from "@/lib/analytics";
import "./sleep.css";

/**
 * Shown instead of playing when someone without Premium opens a Premium chapter (Exodus
 * onwards), from anywhere: the shelf, Tonight's chapter, Up next, the reading plan.
 */
export function PremiumGate() {
  const s = useSleepAudio();
  const { user } = useApp();
  const locked = s.locked;

  useEffect(() => {
    if (locked) trackEvent("premium_gate", { book: locked.chapter.book, chapter: locked.chapter.chapter, mode: locked.mode });
  }, [locked]);

  if (!locked) return null;
  const { chapter, mode } = locked;
  const lifetime = Boolean(process.env.NEXT_PUBLIC_PADDLE_LIFETIME_PRICE_ID);

  return (
    <div className="pg-wrap" onClick={s.dismissLocked}>
      <div className="sf-sheet pg-sheet" role="dialog" aria-modal="true" aria-labelledby="pg-title" onClick={(e) => e.stopPropagation()}>
        <div className="sf-sheet-head">
          <h2 id="pg-title">
            {chapter.book} is part of Premium
          </h2>
          <button type="button" className="sf-icon" aria-label="Close" onClick={s.dismissLocked}>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        {user?.premium ? (
          <>
            <p>Your Premium is on.</p>
            <button type="button" className="pg-primary" onClick={() => s.open(chapter, { mode })}>
              Play {chapter.book} {chapter.chapter}
            </button>
          </>
        ) : (
          <>
            <p>
              Genesis is free to hear, every chapter. {chapter.book} and the books after it are read aloud in Walk and Sleep for
              Premium members; the text stays free to read in the reading plan.
            </p>
            <p className="pg-price">
              $4.99 a month or $39.99 a year, both with 7 days free.
              {lifetime ? ` Or become a founding member: $${FOUNDING_PRICE} once, Pro for life.` : ""}
            </p>
            <Link href="/pricing" className="pg-primary" onClick={s.dismissLocked}>
              Try Premium free for 7 days
            </Link>
            <button type="button" className="pg-secondary" onClick={s.dismissLocked}>
              Not now
            </button>
          </>
        )}
      </div>
    </div>
  );
}
