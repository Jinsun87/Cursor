"use client";

import { canListen } from "@/lib/sleep/access";
import { useApp } from "@/lib/store";
import { useEffect, useMemo, useRef, useState } from "react";
import type { SleepChapter } from "@/lib/sleep/types";
import { SLEEP_SPEEDS, TIMER_OPTIONS, clock, useSleepAudio } from "@/lib/sleep/sleep-audio";
import { SLEEP_CHAPTERS, WALK_SECONDS } from "@/lib/sleep/chapters";
import "./sleep.css";

type Mode = "listen" | "read";
const TEXT_SIZES = [0.9, 1, 1.15, 1.3] as const;
const IDLE_MS = 5000;

/**
 * The night player: the whole screen, always dark. The painting fills it, one
 * verse at a time (Listen) or the whole chapter as a page (Read), with the
 * controls in thumb reach at the bottom. With the chapter playing and no
 * touches for a few seconds, the controls fade and only the words remain; a
 * tap brings them back.
 */
export function SleepFullscreen() {
  const s = useSleepAudio();
  const [mode, setMode] = useState<Mode>("listen");
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [textSize, setTextSize] = useState<(typeof TEXT_SIZES)[number]>(1);
  const [awake, setAwake] = useState(true);
  const idle = useRef<number | undefined>(undefined);
  // When the controls are hidden, the first tap only brings them back.
  const calmAtTap = useRef(false);

  const wake = () => {
    setAwake(true);
    window.clearTimeout(idle.current);
    idle.current = window.setTimeout(() => setAwake(false), IDLE_MS);
  };

  useEffect(() => {
    if (!s.expanded) return;
    wake();
    // The page behind stays put while the night player is open.
    const html = document.documentElement;
    const before = html.style.overflow;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") s.collapse();
      if (e.key === " " && !(e.target as HTMLElement).closest("button, input")) {
        e.preventDefault();
        s.toggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = before;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(idle.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.expanded]);

  if (!s.expanded || !s.chapter) return null;
  const { chapter, index } = s;
  const calm = s.playing && !awake && !optionsOpen;

  return (
    <div
      className={`sf${calm ? " is-calm" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={`${chapter.book} ${chapter.chapter}, ${s.mode === "walk" ? "Walk" : "Sleep"} player`}
      style={{ ["--sf-text" as string]: textSize }}
      onPointerDownCapture={() => {
        calmAtTap.current = calm;
        wake();
      }}
    >
      <Backdrop chapter={chapter} index={Math.max(0, index)} dim={mode === "read"} playing={s.playing} />

      <header className="sf-top sf-fade">
        <button type="button" className="sf-icon" onClick={s.collapse} aria-label="Minimise the player">
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
            <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="sf-modes" role="tablist" aria-label="View">
          <button type="button" role="tab" aria-selected={mode === "listen"} onClick={() => setMode("listen")}>
            Listen
          </button>
          <button type="button" role="tab" aria-selected={mode === "read"} onClick={() => setMode("read")}>
            Read
          </button>
        </div>
        <button
          type="button"
          className="sf-icon"
          onClick={() => setOptionsOpen(true)}
          aria-label="Options: sleep timer, speed and sound"
          aria-expanded={optionsOpen}
        >
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
              <circle cx="16" cy="7" r="2" fill="none" />
              <circle cx="10" cy="17" r="2" fill="none" />
            </g>
          </svg>
        </button>
      </header>

      {mode === "listen" ? (
        <ListenView chapter={chapter} index={index} onTap={() => !calmAtTap.current && s.toggle()} />
      ) : (
        <ReadView chapter={chapter} index={index} onPick={s.seekToVerse} />
      )}

      <footer className="sf-bottom sf-fade">
        <div className="sf-progress">
          <span>{clock(s.time)}</span>
          <input
            type="range"
            min={0}
            max={s.duration || 1}
            step={0.1}
            value={Math.min(s.time, s.duration || 1)}
            aria-label="Position"
            onChange={(e) => s.seekTo(Number(e.target.value))}
          />
          <span>{clock(s.duration)}</span>
        </div>
        <div className="sf-row">
          <button type="button" className="sf-skip" onClick={() => s.seekBy(-15)} aria-label="Back 15 seconds">
            <SkipIcon back />
            <span>15</span>
          </button>
          <button type="button" className="sf-play" onClick={s.toggle} aria-label={s.playing ? "Pause" : "Play"}>
            {s.playing ? (
              <svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true">
                <rect x="6" y="5" width="4.2" height="14" rx="1.2" fill="currentColor" />
                <rect x="13.8" y="5" width="4.2" height="14" rx="1.2" fill="currentColor" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true">
                <path d="M8.5 5.2 L19 12 L8.5 18.8 Z" fill="currentColor" />
              </svg>
            )}
          </button>
          <button type="button" className="sf-skip" onClick={() => s.seekBy(15)} aria-label="Forward 15 seconds">
            <SkipIcon />
            <span>15</span>
          </button>
        </div>
        <p className="sf-status">
          {s.muted ? "Voice muted · reading along" : null}
          {s.muted && s.timerEndsAt ? " · " : null}
          {s.timerEndsAt ? `Sleep timer: ${Math.max(0, Math.ceil((s.timerEndsAt - Date.now()) / 60000))} min left` : null}
        </p>
      </footer>

      {s.ended ? <UpNext chapter={chapter} /> : null}

      {optionsOpen ? (
        <Options textSize={textSize} onTextSize={setTextSize} onClose={() => setOptionsOpen(false)} />
      ) : null}
    </div>
  );
}

/** When a chapter ends: a quiet close, and the next chapter one tap away. Nothing plays by itself. */
function UpNext({ chapter }: { chapter: SleepChapter }) {
  const s = useSleepAudio();
  const { user } = useApp();
  // The next chapter that has a recording in this mode (Walk stays Walk, Sleep stays Sleep).
  const k = SLEEP_CHAPTERS.findIndex((c) => c.slug === chapter.slug);
  const next = SLEEP_CHAPTERS.slice(k + 1).find((c) => s.mode === "sleep" || WALK_SECONDS[c.slug] > 0);
  return (
    <div className="sf-end" role="status">
      <p className="sf-eyebrow">
        {chapter.book} {chapter.chapter} · finished
      </p>
      <p className="sf-end-line">{s.mode === "walk" ? "Well done. Carry it with you today." : "Rest now. The Word stays with you."}</p>
      {next ? (
        <button type="button" className="sf-next" onClick={() => s.open(next, { mode: s.mode })}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={next.verses[0].image} alt="" />
          <span>
            <small>Up next{next && !canListen(next, Boolean(user?.premium)) ? " · Premium" : ""}</small>
            <strong>
              {next.book} {next.chapter}
            </strong>
            <em>{next.title}</em>
          </span>
          <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
            <path d="M8.5 5.2 L19 12 L8.5 18.8 Z" fill="currentColor" />
          </svg>
        </button>
      ) : (
        <p className="sf-end-line">More chapters are on the way.</p>
      )}
      <button type="button" className="sf-end-close" onClick={s.close}>
        Close
      </button>
    </div>
  );
}

/** Options sheet: everything that is not play, pause or skip. */
function Options({
  textSize,
  onTextSize,
  onClose,
}: {
  textSize: (typeof TEXT_SIZES)[number];
  onTextSize: (v: (typeof TEXT_SIZES)[number]) => void;
  onClose: () => void;
}) {
  const s = useSleepAudio();
  const sizeAt = TEXT_SIZES.indexOf(textSize);
  return (
    <div className="sf-sheet-wrap" onClick={onClose}>
      <div className="sf-sheet" role="dialog" aria-label="Options" onClick={(e) => e.stopPropagation()}>
        <div className="sf-sheet-head">
          <h2>Options</h2>
          <button type="button" className="sf-icon" onClick={onClose} aria-label="Close options">
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <section>
          <h3>Sleep timer</h3>
          <div className="sf-chips" role="group" aria-label="Sleep timer">
            {TIMER_OPTIONS.map((m) => (
              <button key={m} type="button" aria-pressed={s.timerMin === m} onClick={() => s.chooseTimer(m)}>
                {m === 0 ? "End of chapter" : `${m} min`}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3>Speed</h3>
          <div className="sf-chips" role="group" aria-label="Speed">
            {SLEEP_SPEEDS.map((v) => (
              <button key={v} type="button" aria-pressed={s.speed === v} onClick={() => s.setSpeed(v)}>
                {v}×
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3>Sound</h3>
          <label className="sf-slider">
            <span>Voice</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={s.narration}
              onChange={(e) => s.setNarration(Number(e.target.value))}
            />
          </label>
          <label className="sf-slider">
            <span>Rain</span>
            <input type="range" min={0} max={1} step={0.05} value={s.rain} onChange={(e) => s.setRain(Number(e.target.value))} />
          </label>
          <button type="button" className="sf-toggle" aria-pressed={s.muted} onClick={() => s.setMuted(!s.muted)}>
            <span>
              <strong>Mute the voice</strong>
              <small>Read along at the narrator&apos;s pace. Muted time does not light your lamp.</small>
            </span>
            <i aria-hidden="true" />
          </button>
        </section>

        <section>
          <h3>Text size</h3>
          <div className="sf-chips" role="group" aria-label="Text size">
            <button type="button" disabled={sizeAt <= 0} onClick={() => onTextSize(TEXT_SIZES[sizeAt - 1])} aria-label="Smaller text">
              A−
            </button>
            <button
              type="button"
              disabled={sizeAt >= TEXT_SIZES.length - 1}
              onClick={() => onTextSize(TEXT_SIZES[sizeAt + 1])}
              aria-label="Larger text"
            >
              A+
            </button>
          </div>
        </section>

        <p className="sf-credit">Scripture from the {s.chapter?.translation}.</p>
      </div>
    </div>
  );
}

/** One verse at a time, large and soft, fading in as it is read. Tapping the words pauses or plays. */
function ListenView({ chapter, index, onTap }: { chapter: SleepChapter; index: number; onTap: () => void }) {
  const v = index >= 0 ? chapter.verses[index] : null;
  return (
    <div className="sf-listen" onClick={onTap}>
      {v ? (
        <div className="sf-verse-wrap" key={v.n}>
          <p className="sf-eyebrow">{v.heading ?? `${chapter.book} ${chapter.chapter}:${v.n}`}</p>
          <p className="sf-verse">{v.text}</p>
          <p className="sf-count">
            {v.heading ? `${chapter.book} ${chapter.chapter}:${v.n} · ` : null}
            {v.n} of {chapter.verses.length}
          </p>
        </div>
      ) : (
        <div className="sf-verse-wrap">
          <p className="sf-eyebrow">{chapter.translation}</p>
          <p className="sf-title">
            {chapter.book} {chapter.chapter}
          </p>
          <p className="sf-sub">{chapter.title}</p>
        </div>
      )}
    </div>
  );
}

/** The whole chapter as a page; follows the narration, tap a verse to jump to it. */
function ReadView({ chapter, index, onPick }: { chapter: SleepChapter; index: number; onPick: (k: number) => void }) {
  const scroller = useRef<HTMLDivElement | null>(null);
  const userScrolledAt = useRef(0);

  useEffect(() => {
    const box = scroller.current;
    if (!box || index < 0 || Date.now() - userScrolledAt.current < 6000) return;
    const el = box.querySelector<HTMLElement>(`[data-verse="${chapter.verses[index].n}"]`);
    if (el) box.scrollTo({ top: el.offsetTop - box.clientHeight * 0.3, behavior: "smooth" });
  }, [index, chapter.verses]);

  return (
    <div
      className="sf-read"
      ref={scroller}
      onWheel={() => (userScrolledAt.current = Date.now())}
      onTouchMove={() => (userScrolledAt.current = Date.now())}
    >
      <article className="sf-page">
        <p className="sf-eyebrow">{chapter.book}</p>
        <h2 className="sf-chapter">Chapter {chapter.chapter}</h2>
        {chapter.verses.map((v, k) => (
          <span key={v.n}>
            {v.heading ? <span className="sf-heading">{v.heading}</span> : null}
            <span
              data-verse={v.n}
              className={`sf-rv${k === index ? " is-current" : ""}${k < index ? " is-past" : ""}`}
              role="button"
              tabIndex={0}
              onClick={() => onPick(k)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onPick(k)}
            >
              <sup>{v.n}</sup>
              {v.text}{" "}
            </span>
          </span>
        ))}
        <p className="sf-credit">Scripture quotations are from the {chapter.translation}.</p>
      </article>
    </div>
  );
}

/** Paintings that change with the passage and drift slowly. */
function Backdrop({ chapter, index, dim, playing }: { chapter: SleepChapter; index: number; dim: boolean; playing: boolean }) {
  const images = useMemo(() => [...new Set(chapter.verses.map((v) => v.image))], [chapter.verses]);
  const current = chapter.verses[index]?.image ?? images[0];
  return (
    <div className={`sf-backdrop${dim ? " is-dim" : ""}${playing ? " is-playing" : ""}`} aria-hidden="true">
      {images.map((src) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={src} src={src} alt="" className={src === current ? "is-on" : ""} />
      ))}
      <div className="sf-veil" />
    </div>
  );
}

export function SkipIcon({ back = false }: { back?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" style={back ? undefined : { transform: "scaleX(-1)" }}>
      <path
        d="M12 5V2L7 6l5 4V7a6 6 0 1 1-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
