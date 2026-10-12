"use client";

import { useEffect, useState } from "react";
import type { SleepChapter } from "@/lib/sleep/types";
import { clock, useSleepAudio } from "@/lib/sleep/sleep-audio";
import { pickTonight, useSleepProgress } from "@/lib/sleep/progress";
import "./sleep.css";

/**
 * The Sleep section: tonight's chapter as one card (the next unfinished
 * chapter, or the one stopped part-way), then every chapter in order. Begin
 * opens the night player full screen and picks up where the reader stopped.
 */
export function SleepLanding({ chapters, seconds }: { chapters: SleepChapter[]; seconds: Record<string, number> }) {
  const s = useSleepAudio();
  const progress = useSleepProgress();
  // Decided after mount, from this device's saved progress.
  const [tonight, setTonight] = useState<{ chapter: SleepChapter; resumeAt: number }>({ chapter: chapters[0], resumeAt: 0 });
  useEffect(() => setTonight(pickTonight(chapters, progress)), [chapters, progress]);

  const { chapter } = tonight;
  const current = s.chapter?.slug === chapter.slug;
  const resumeAt = current ? s.time : tonight.resumeAt;
  const minutes = (slug: string) => Math.max(1, Math.round((seconds[slug] ?? 0) / 60));
  const begin = (c: SleepChapter, at: number) => s.open(c, at);

  return (
    <div className="sl-wrap">
      <div className="sl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="sl-art" src={chapter.verses[0].image} alt="" />
        <div className="sl-veil" />
        <div className="sl-body">
          <p className="sl-eyebrow">{resumeAt > 5 ? "Continue tonight" : "Tonight's chapter"}</p>
          <h2 className="sl-title">
            {chapter.book} {chapter.chapter}
          </h2>
          <p className="sl-sub">{chapter.title}</p>
          <p className="sl-meta">
            {minutes(chapter.slug)} min · {chapter.verses.length} verses · read softly, word for word
          </p>
          <button type="button" className="sl-begin" onClick={() => begin(chapter, resumeAt > 5 ? resumeAt : 0)}>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path d="M8.5 5.2 L19 12 L8.5 18.8 Z" fill="currentColor" />
            </svg>
            {current && s.playing ? "Open the player" : resumeAt > 5 ? `Continue · ${clock(resumeAt)}` : "Begin"}
          </button>
          <p className="sl-note">Opens full screen. Set a sleep timer and the voice fades out as you drift off.</p>
        </div>
      </div>

      {chapters.length > 1 ? (
        <section className="sl-list" aria-label="All chapters">
          <h3>{chapters[0].book}</h3>
          <ol>
            {chapters.map((c) => {
              const p = progress[c.slug];
              const state = p?.done ? "done" : p && p.t > 5 ? "started" : "new";
              const playingThis = s.chapter?.slug === c.slug && s.playing;
              return (
                <li key={c.slug}>
                  <button
                    type="button"
                    className={`sl-item is-${state}${c.slug === chapter.slug ? " is-tonight" : ""}`}
                    onClick={() => begin(c, state === "started" ? p!.t : 0)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.verses[0].image} alt="" loading="lazy" />
                    <span className="sl-item-text">
                      <strong>
                        {c.book} {c.chapter}
                      </strong>
                      <small>
                        {c.title} · {minutes(c.slug)} min
                      </small>
                    </span>
                    <span className="sl-item-state" aria-label={playingThis ? "Playing" : state === "done" ? "Heard" : state === "started" ? "Started" : undefined}>
                      {playingThis ? "▶" : state === "done" ? "✓" : state === "started" ? clock(p!.t) : ""}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </section>
      ) : null}
    </div>
  );
}
