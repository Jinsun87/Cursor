"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { useSleepAudio } from "@/lib/sleep/sleep-audio";
import { installUrl } from "@/lib/install";
import { trackEvent } from "@/lib/analytics";
import "@/components/sleep/sleep.css";

/** Listening in this visit before the prompt may show (it also shows when a chapter ends). */
const LISTEN_SECONDS = 180;
/** After "Not now", stay quiet this long. */
const QUIET_DAYS = 7;
const KEY = "lampstand-keep-place";

function quietUntil(): number {
  try {
    return Number(localStorage.getItem(KEY)) || 0;
  } catch {
    // Storage blocked: never nag.
    return Number.MAX_SAFE_INTEGER;
  }
}

/**
 * "Create a free account to keep your place": shown to someone who is not signed in once they
 * have really listened: when a chapter ends, or when they pause after three minutes. It never
 * interrupts a reading that is playing (they may be falling asleep). A new account goes to the
 * install page (add Lampstand to the home screen), then back to where they were.
 */
export function KeepYourPlace() {
  const { user, ready, accountsAvailable, signInWithGoogle } = useApp();
  const s = useSleepAudio();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listened = useRef(0);
  const asked = useRef(false);

  // Count the seconds actually played in this visit.
  useEffect(() => {
    if (!s.playing) return;
    const id = window.setInterval(() => (listened.current += 1), 1000);
    return () => window.clearInterval(id);
  }, [s.playing]);

  useEffect(() => {
    if (asked.current || open || !ready || user || !accountsAvailable || s.locked) return;
    const earned = s.ended || (!s.playing && listened.current >= LISTEN_SECONDS);
    if (!earned || Date.now() < quietUntil()) return;
    asked.current = true;
    setOpen(true);
    trackEvent("keep_place_prompt", { after: s.ended ? "chapter-end" : "pause", seconds: listened.current });
  }, [s.playing, s.ended, s.locked, ready, user, accountsAvailable, open]);

  // Signed in elsewhere while this was open.
  useEffect(() => {
    if (user) setOpen(false);
  }, [user]);

  if (!open) return null;

  const back = typeof window === "undefined" ? "/" : window.location.pathname + window.location.search;
  const next = installUrl(back);
  const later = () => {
    try {
      localStorage.setItem(KEY, String(Date.now() + QUIET_DAYS * 86_400_000));
    } catch {
      // A convenience only.
    }
    trackEvent("keep_place_dismissed");
    setOpen(false);
  };
  const google = process.env.NEXT_PUBLIC_AUTH_GOOGLE === "true";

  return (
    <div className="pg-wrap" onClick={later}>
      <div className="sf-sheet pg-sheet" role="dialog" aria-modal="true" aria-labelledby="kp-title" onClick={(e) => e.stopPropagation()}>
        <div className="sf-sheet-head">
          <h2 id="kp-title">Keep your place</h2>
          <button type="button" className="sf-icon" aria-label="Close" onClick={later}>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <p>
          Create a free account and Lampstand remembers where you stopped, your streak and your reading plan, on every device. It takes
          a few seconds and costs nothing.
        </p>
        {google ? (
          <button
            type="button"
            className="pg-primary"
            onClick={() => {
              trackEvent("keep_place_accept", { method: "google" });
              void signInWithGoogle(next).then(setError);
            }}
          >
            Continue with Google
          </button>
        ) : null}
        <Link
          href={`/register?next=${encodeURIComponent(next)}`}
          className={google ? "pg-secondary" : "pg-primary"}
          onClick={() => {
            trackEvent("keep_place_accept", { method: "email" });
            setOpen(false);
          }}
        >
          {google ? "Use my email instead" : "Create a free account"}
        </Link>
        {error ? <p role="alert">{error}</p> : null}
        <button type="button" className="pg-secondary" onClick={later} style={{ border: 0, opacity: 0.75 }}>
          Not now
        </button>
      </div>
    </div>
  );
}
