"use client";

import { useEffect } from "react";
import { useSleepAudio } from "@/lib/sleep/sleep-audio";
import "./sleep.css";

/**
 * The chapter that is playing, as a slim bar above the bottom navigation on
 * every page. Tap it to reopen the night player; ✕ stops the chapter.
 */
export function MiniPlayer() {
  const s = useSleepAudio();
  const visible = Boolean(s.chapter) && !s.expanded;

  // Make room at the bottom of the page so the bar never covers the last lines.
  useEffect(() => {
    document.body.classList.toggle("has-mini-player", visible);
    return () => document.body.classList.remove("has-mini-player");
  }, [visible]);

  if (!visible || !s.chapter) return null;
  const { chapter, index } = s;
  const v = index >= 0 ? chapter.verses[index] : null;
  const progress = s.duration ? Math.min(1, s.time / s.duration) : 0;

  return (
    <div className="mini" role="region" aria-label="Now playing">
      <div className="mini-line" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
      <button type="button" className="mini-open" onClick={s.expand} aria-label={`Open ${chapter.book} ${chapter.chapter} in the player`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={v?.image ?? chapter.verses[0].image} alt="" />
        <span>
          <strong>
            {chapter.book} {chapter.chapter}
          </strong>
          <small>{s.mode === "walk" ? "Walk · " : "Sleep · "}
            {s.playing ? (v ? `verse ${v.n} of ${chapter.verses.length}` : chapter.title) : "paused"}</small>
        </span>
      </button>
      <button type="button" className="mini-play" onClick={s.toggle} aria-label={s.playing ? "Pause" : "Play"}>
        {s.playing ? (
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <rect x="6" y="5" width="4.2" height="14" rx="1.2" fill="currentColor" />
            <rect x="13.8" y="5" width="4.2" height="14" rx="1.2" fill="currentColor" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d="M8.5 5.2 L19 12 L8.5 18.8 Z" fill="currentColor" />
          </svg>
        )}
      </button>
      <button type="button" className="mini-close" onClick={s.close} aria-label="Stop and close">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
