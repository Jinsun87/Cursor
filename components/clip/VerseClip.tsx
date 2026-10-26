"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import type { ClipMode, ClipSet } from "@/lib/clips";
import "./clip.css";

const MODE_LABEL: Record<ClipMode, { name: string; note: string }> = {
  walk: { name: "Walk", note: "a clear voice for the day" },
  sleep: { name: "Sleep", note: "slow and quiet, for the night" },
};

/** Only one clip on a page plays at a time. */
const STOP_OTHERS = "lampstand-clip-play";

/**
 * A short listen from the app's own narration: a few verses cut from the Walk or Sleep recording,
 * the verse being read lit up, and a way into the full Bible underneath.
 */
export function VerseClip({ clip, cta = true }: { clip: ClipSet; cta?: boolean }) {
  const modes = (["walk", "sleep"] as const).filter((m) => clip[m]);
  const [mode, setMode] = useState<ClipMode>(modes[0]);
  const [playing, setPlaying] = useState(false);
  const [now, setNow] = useState(0);
  const audio = useRef<HTMLAudioElement | null>(null);
  const id = useRef(Math.random().toString(36).slice(2));
  const c = clip[mode]!;
  const length = c.end - c.start;

  useEffect(() => {
    const stop = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== id.current) audio.current?.pause();
    };
    window.addEventListener(STOP_OTHERS, stop);
    return () => window.removeEventListener(STOP_OTHERS, stop);
  }, []);

  // A new mode is a new recording: stop and start again from the top.
  useEffect(() => {
    audio.current?.pause();
    setNow(0);
  }, [mode]);

  const toggle = () => {
    const a = audio.current;
    if (!a) return;
    if (!a.paused) return a.pause();
    window.dispatchEvent(new CustomEvent(STOP_OTHERS, { detail: id.current }));
    if (a.currentTime < c.start || a.currentTime >= c.end - 0.2) a.currentTime = c.start;
    void a.play();
    trackEvent("clip_play", { ref: clip.ref, mode });
  };

  const onTime = () => {
    const a = audio.current;
    if (!a) return;
    if (a.currentTime >= c.end) {
      a.pause();
      a.currentTime = c.start;
      setNow(0);
      trackEvent("clip_finish", { ref: clip.ref, mode });
      return;
    }
    setNow(Math.max(0, a.currentTime - c.start));
  };

  const reading = c.verses.reduce((cur, v) => (c.start + now >= v.at ? v.n : cur), c.verses[0].n);
  const seconds = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return (
    <figure className="clip">
      <div className="clip-head">
        <button type="button" className="clip-play" onClick={toggle} aria-label={playing ? "Pause" : `Play ${clip.ref} in ${MODE_LABEL[mode].name}`}>
          {playing ? (
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
            </svg>
          )}
        </button>
        <div className="clip-meta">
          <strong>Listen: {clip.ref}</strong>
          <span>
            {MODE_LABEL[mode].name}, {MODE_LABEL[mode].note} · {seconds(playing || now ? now : 0)} / {seconds(length)}
          </span>
        </div>
        {modes.length > 1 ? (
          <div className="clip-modes" role="group" aria-label="Voice">
            {modes.map((m) => (
              <button key={m} type="button" aria-pressed={m === mode} onClick={() => setMode(m)}>
                {MODE_LABEL[m].name}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <div className="clip-bar" aria-hidden="true">
        <i style={{ width: `${Math.min(100, (now / length) * 100)}%` }} />
      </div>
      <div className="clip-text">
        {c.verses.map((v) => (
          <p key={v.n} className={playing && v.n === reading ? "is-reading" : undefined}>
            <sup>{v.n}</sup> {v.text}
          </p>
        ))}
      </div>
      <audio
        ref={audio}
        key={c.src}
        src={c.src}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={onTime}
      />
      {cta ? (
        <figcaption className="clip-cta">
          <span>
            That was {Math.round(length)} seconds of {clip.chapterLabel}. Hear the whole Bible read aloud in two voices: Walk by day,
            Sleep by night.
          </span>
          <Link href="/pricing" onClick={() => trackEvent("clip_cta", { ref: clip.ref })}>
            Start your 7-day free trial
          </Link>
        </figcaption>
      ) : null}
    </figure>
  );
}
