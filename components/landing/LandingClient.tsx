"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSleepAudio, type ReadingMode } from "@/lib/sleep/sleep-audio";
import { SLEEP_CHAPTERS } from "@/lib/sleep/chapters";
import { FEELINGS, type FeelingId } from "@/lib/calm";
import { QuickStart } from "@/components/onboarding/QuickStart";
import { useFoundingSpots } from "@/components/founding/useFoundingSpots";
import { trackEvent } from "@/lib/analytics";
import { useApp } from "@/lib/store";
import { readOnboarding } from "@/lib/onboarding";
import { FOUNDING_CAP } from "@/lib/founding";

/** Leave the landing view for the app itself (the dashboard), for this visit and the next. */
export function showApp() {
  const d = document.documentElement;
  d.classList.remove("ls-landing");
  d.classList.add("ls-app");
  window.scrollTo(0, 0);
}

/**
 * Keeps the landing/app choice right after client-side navigation (the <head> gate only runs on a
 * full load): someone who is signed in or has been welcomed always gets the app.
 */
export function LandingSync() {
  const { user } = useApp();
  useEffect(() => {
    const d = document.documentElement;
    if (new URLSearchParams(window.location.search).has("landing")) return;
    if (user || readOnboarding().done || new URLSearchParams(window.location.search).has("tab")) {
      d.classList.remove("ls-landing");
      d.classList.add("ls-app");
    } else if (!d.classList.contains("ls-app")) {
      d.classList.add("ls-landing");
    }
  }, [user]);
  return null;
}

/** "Start listening free": the one-question welcome, then the app. */
export function StartFree({ label = "Start listening free", where, className = "lp-btn lp-btn-gold" }: { label?: string; where: string; className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => {
          trackEvent("landing_cta", { where });
          setOpen(true);
        }}
      >
        {label}
      </button>
      {open ? (
        <QuickStart
          onDone={() => {
            setOpen(false);
            showApp();
          }}
        />
      ) : null}
    </>
  );
}

const DEMO_SLUG = "psalm-23";

/** The hero's player: Psalm 23, in either voice, playing right here on the page. */
export function HeroPlayer() {
  const s = useSleepAudio();
  const [mode, setMode] = useState<ReadingMode>("sleep");
  const chapter = SLEEP_CHAPTERS.find((c) => c.slug === DEMO_SLUG);
  if (!chapter) return null;
  const here = s.chapter?.slug === DEMO_SLUG && s.mode === mode;
  const playing = here && s.playing;
  const verse = here && s.index >= 0 ? chapter.verses[s.index] : chapter.verses[0];
  const image = verse?.image ?? chapter.verses[0].image;

  const play = (m: ReadingMode) => {
    if (s.chapter?.slug === DEMO_SLUG && s.mode === m) {
      s.toggle();
      return;
    }
    trackEvent("landing_demo_play", { mode: m });
    s.open(chapter, { mode: m, expand: false });
  };

  return (
    <div className="lp-player">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="lp-player-art" src={image} alt="" />
      <div className="lp-player-shade" />
      <div className="lp-player-top">
        <span className="lp-eyebrow">Psalm 23 · The Lord Is My Shepherd</span>
        <div className="lp-voices" role="tablist" aria-label="Voice">
          {(["sleep", "walk"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              className={mode === m ? "is-on" : ""}
              onClick={() => {
                setMode(m);
                if (s.chapter?.slug === DEMO_SLUG && s.playing && s.mode !== m) play(m);
              }}
            >
              {m === "sleep" ? "Sleep voice" : "Walk voice"}
            </button>
          ))}
        </div>
      </div>
      <p className="lp-player-verse" aria-live="polite">
        {verse?.text}
      </p>
      <div className="lp-player-bar">
        <button type="button" className="lp-play" aria-label={playing ? "Pause" : "Play Psalm 23"} onClick={() => play(mode)}>
          {playing ? (
            <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
              <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
              <path d="M8.5 5.2 L19 12 L8.5 18.8 Z" fill="currentColor" />
            </svg>
          )}
        </button>
        <span>
          <strong>{playing ? "Playing now" : "Press play"}</strong>
          <small>{mode === "sleep" ? "Read softly, for falling asleep" : "Read clearly, for a walk or a commute"} · free</small>
        </span>
      </div>
    </div>
  );
}

/** Calm me, in miniature: tap a feeling, read its prayer. */
export function CalmShowcase() {
  const [id, setId] = useState<FeelingId>("anxious");
  const f = FEELINGS.find((x) => x.id === id) ?? FEELINGS[0];
  return (
    <div className="lp-calm">
      <div className="lp-calm-feelings" role="radiogroup" aria-label="How you feel">
        {FEELINGS.map((x) => (
          <button key={x.id} type="button" role="radio" aria-checked={x.id === id} className={x.id === id ? "is-on" : ""} onClick={() => setId(x.id)}>
            {x.label}
          </button>
        ))}
      </div>
      <div className="lp-calm-card" key={f.id}>
        <p className="lp-calm-line">{f.line}</p>
        <p className="lp-calm-prayer">{f.prayer.text}</p>
        <p className="lp-calm-ref">{f.prayer.reference} · Berean Standard Bible</p>
        <div className="lp-calm-more">
          <span>Or: 5 min box breathing · Ambient tone · A line to say aloud</span>
          <Link href="/?tab=calm" className="lp-link" onClick={showApp}>
            Open Calm me →
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Founding places left, from the real count; the cap until it loads (never a made-up number). */
export function FoundingLeft() {
  const spots = useFoundingSpots();
  const [shown, setShown] = useState(false);
  useEffect(() => setShown(true), []);
  if (!shown || !spots) return <>First {FOUNDING_CAP} members only</>;
  if (spots.left <= 0) return <>All {spots.cap} founding places are taken</>;
  return (
    <>
      {spots.left} of {spots.cap} founding places left
    </>
  );
}
