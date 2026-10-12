"use client";

import type { SleepChapter } from "@/lib/sleep/types";
import { clock, useSleepAudio } from "@/lib/sleep/sleep-audio";
import "./sleep.css";

/**
 * The Sleep section: tonight's chapter as one card. Begin opens the night
 * player full screen; if this chapter is already going, the button resumes it.
 */
export function SleepLanding({ chapter, minutes }: { chapter: SleepChapter; minutes: number }) {
  const s = useSleepAudio();
  const current = s.chapter?.slug === chapter.slug;
  const started = current && s.time > 1;

  return (
    <div className="sl">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="sl-art" src={chapter.verses[0].image} alt="" />
      <div className="sl-veil" />
      <div className="sl-body">
        <p className="sl-eyebrow">Tonight&apos;s chapter</p>
        <h2 className="sl-title">
          {chapter.book} {chapter.chapter}
        </h2>
        <p className="sl-sub">{chapter.title}</p>
        <p className="sl-meta">
          {minutes} min · {chapter.verses.length} verses · read softly, word for word
        </p>
        <button type="button" className="sl-begin" onClick={() => s.open(chapter)}>
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d="M8.5 5.2 L19 12 L8.5 18.8 Z" fill="currentColor" />
          </svg>
          {current && s.playing ? "Open the player" : started ? `Continue · ${clock(s.time)}` : "Begin"}
        </button>
        <p className="sl-note">Opens full screen. Set a sleep timer and the voice fades out as you drift off.</p>
      </div>
    </div>
  );
}
