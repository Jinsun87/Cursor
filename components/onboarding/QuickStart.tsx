"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useSleepAudio } from "@/lib/sleep/sleep-audio";
import { SLEEP_CHAPTERS } from "@/lib/sleep/chapters";
import { saveOnboarding } from "@/lib/onboarding";
import { setSection } from "@/lib/section-store";
import { trackEvent } from "@/lib/analytics";
import { formatISODate } from "@/lib/plan/build";
import { emptyPlace, readSavedPlan, writeSavedPlan } from "@/lib/plan/storage";
import "./onboarding.css";

/** The first chapter someone who came to sleep hears: free, short and well loved. */
const FIRST_SLEEP_SLUG = "psalm-23";

/**
 * First visit: one question, then straight to the thing they came for.
 *   "Read the Bible consistently" starts a Bible-in-a-year plan today and opens today's reading.
 *   "Sleep and relax" opens the Sleep tab with Psalm 23 playing.
 * Nothing is sold here and no account is asked for. The longer welcome (Onboarding.tsx) is kept
 * but not shown.
 */
export function QuickStart({ onDone }: { onDone: () => void }) {
  const s = useSleepAudio();
  const router = useRouter();

  useEffect(() => {
    trackEvent("onboarding_step", { step: "quick-start", index: 0 });
  }, []);

  // The page behind stays still while this is open.
  useEffect(() => {
    const html = document.documentElement;
    const before = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = before;
    };
  }, []);

  const read = () => {
    saveOnboarding({ done: true, intent: "read", when: "walk" });
    trackEvent("onboarding_complete", { step: "quick-start", intent: "read" });
    // Keep a plan they already have; otherwise the whole Bible in a year, starting today.
    if (!readSavedPlan()) {
      writeSavedPlan({
        input: { scope: "bible", order: "ot-and-nt", spanDays: 365, start: formatISODate(new Date()), skipWeekdays: [] },
        done: [],
        place: emptyPlace(),
        updatedAt: Date.now(),
      });
    }
    onDone();
    router.push("/plan/read");
  };

  const sleep = () => {
    saveOnboarding({ done: true, intent: "sleep", when: "sleep" });
    trackEvent("onboarding_complete", { step: "quick-start", intent: "sleep" });
    setSection("sleep");
    onDone();
    const first = SLEEP_CHAPTERS.find((c) => c.slug === FIRST_SLEEP_SLUG) ?? SLEEP_CHAPTERS[0];
    // Called from the tap itself, so the browser lets the reading start.
    if (first) s.open(first, { mode: "sleep" });
  };

  const look = () => {
    saveOnboarding({ done: true, intent: "looking" });
    trackEvent("onboarding_skipped", { step: "quick-start" });
    onDone();
  };

  return createPortal(
    <div className="ob" role="dialog" aria-modal="true" aria-label="Welcome to Lampstand">
      <div className="ob-stars" aria-hidden="true" />
      <header className="ob-top">
        <span />
        <span />
        <button type="button" className="ob-link" onClick={look}>
          Skip
        </button>
      </header>
      <main className="ob-body">
        <p className="ob-eyebrow">Welcome to Lampstand</p>
        <h1>How would you like to use Lampstand?</h1>
        <p className="ob-sub">The whole Bible, read aloud. Pick one to begin; you can use both any time.</p>
        <ul className="ob-choices">
          <li>
            <button type="button" onClick={read}>
              <span>
                <strong>Read the Bible consistently</strong>
                <small>A chapter a day, with a plan that keeps your place</small>
              </span>
              <Arrow />
            </button>
          </li>
          <li>
            <button type="button" onClick={sleep}>
              <span>
                <strong>Sleep and relax</strong>
                <small>Scripture read softly as you fall asleep</small>
              </span>
              <Arrow />
            </button>
          </li>
        </ul>
        <button type="button" className="ob-quiet" onClick={look}>
          Just looking around
        </button>
      </main>
    </div>,
    document.body,
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" style={{ opacity: 1 }}>
      <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
