"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SleepChapter, SleepTiming } from "@/lib/sleep/types";
import { useListeningMeter } from "./useListening";
import { ProgressRow, ThumbControls, type Speed } from "./ThumbControls";

type Mode = "listen" | "read";
const TIMER_OPTIONS = [0, 15, 30, 60] as const; // minutes; 0 = end of chapter
const FADE_SECONDS = 12;

/**
 * A whole chapter read aloud for falling asleep.
 *
 * Audio is one continuous file in a plain <audio> element, so it keeps playing
 * with the screen locked and shows on the lock screen (Media Session). Both
 * views follow the audio's clock: Listen shows one verse at a time over a
 * slowly drifting painting; Read shows the whole chapter as a page that
 * scrolls itself and highlights the verse being read.
 */
export function SleepPlayer({ chapter }: { chapter: SleepChapter }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [timing, setTiming] = useState<SleepTiming | null>(null);
  const [mode, setMode] = useState<Mode>("listen");
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [narration, setNarration] = useState(1);
  const [rain, setRain] = useState(0);
  const [timerMin, setTimerMin] = useState<(typeof TIMER_OPTIONS)[number]>(0);
  const [timerEndsAt, setTimerEndsAt] = useState<number | null>(null);
  const [mixerOpen, setMixerOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState<Speed>(1);
  const [flash, setFlash] = useState<"play" | "pause" | null>(null);
  const meter = useListeningMeter();
  const ambient = useAmbientRain();

  useEffect(() => {
    fetch(chapter.timingSrc)
      .then((r) => r.json())
      .then((t: SleepTiming) => setTiming(t))
      .catch(() => setTiming(null));
  }, [chapter.timingSrc]);

  const starts = useMemo(
    () => chapter.verses.map((v) => timing?.verses[String(v.n)] ?? Number.POSITIVE_INFINITY),
    [chapter.verses, timing],
  );
  const index = useMemo(() => {
    let i = -1;
    starts.forEach((s, k) => {
      if (time >= s - 0.15) i = k;
    });
    return i;
  }, [starts, time]);
  const verse = index >= 0 ? chapter.verses[index] : null;
  const duration = timing?.duration ?? 0;

  // Lock-screen title follows the verse being read.
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: verse
        ? `${chapter.book} ${chapter.chapter}:${verse.n} · ${verse.text.slice(0, 60)}`
        : `${chapter.book} ${chapter.chapter}`,
      artist: "Lampstand Sleep",
      album: chapter.translation,
      artwork: [{ src: verse?.image ?? chapter.verses[0].image, sizes: "768x1376", type: "image/jpeg" }],
    });
  }, [verse, chapter]);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    const a = () => audioRef.current;
    navigator.mediaSession.setActionHandler("play", () => void a()?.play());
    navigator.mediaSession.setActionHandler("pause", () => a()?.pause());
    navigator.mediaSession.setActionHandler("seekbackward", () => seekBy(-15));
    navigator.mediaSession.setActionHandler("seekforward", () => seekBy(15));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = narration;
  }, [narration]);

  // Muted keeps the chapter moving so the text advances at reading pace.
  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = speed;
  }, [speed]);

  useEffect(() => {
    ambient.setLevel(playing ? rain : 0);
  }, [ambient, rain, playing]);

  // Sleep timer: fade both voice and rain, then stop.
  useEffect(() => {
    if (!timerEndsAt || !playing) return;
    const id = window.setInterval(() => {
      const left = (timerEndsAt - Date.now()) / 1000;
      const el = audioRef.current;
      if (!el) return;
      if (left <= 0) {
        el.pause();
        el.volume = narration;
        setTimerEndsAt(null);
      } else if (left < FADE_SECONDS) {
        el.volume = narration * (left / FADE_SECONDS);
        ambient.setLevel(rain * (left / FADE_SECONDS));
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [timerEndsAt, playing, narration, rain, ambient]);

  const seekBy = useCallback((delta: number) => {
    const el = audioRef.current;
    if (el) el.currentTime = Math.max(0, Math.min(el.duration || Infinity, el.currentTime + delta));
  }, []);

  const seekToVerse = (k: number) => {
    const el = audioRef.current;
    if (!el || !Number.isFinite(starts[k])) return;
    el.currentTime = starts[k];
    if (el.paused) void el.play();
  };

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    setFlash(el.paused ? "play" : "pause");
    window.setTimeout(() => setFlash(null), 700);
    if (el.paused) {
      ambient.unlock();
      void el.play();
      if (timerMin) setTimerEndsAt(Date.now() + timerMin * 60_000);
    } else {
      el.pause();
    }
  };

  const chooseTimer = (m: (typeof TIMER_OPTIONS)[number]) => {
    setTimerMin(m);
    setTimerEndsAt(m && playing ? Date.now() + m * 60_000 : null);
  };

  return (
    <div className={`sleep-player sleep-${mode}`}>
      <audio
        ref={audioRef}
        src={chapter.audioSrc}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => {
          setPlaying(false);
          meter.stop();
        }}
        onEnded={() => {
          setPlaying(false);
          meter.stop();
        }}
        onTimeUpdate={(e) => {
          const t = e.currentTarget.currentTime;
          setTime(t);
          // Muted time is reading, not listening, so it does not light the lamp.
          if (!e.currentTarget.paused && !e.currentTarget.muted) meter.tick(t);
          else meter.stop();
        }}
      />

      <div
        className="sleep-stage"
        onClick={(e) => {
          // Buttons, sliders, the sound panel and verses keep their own taps.
          if ((e.target as HTMLElement).closest("button, input, label, .sleep-mixer, .read-verse")) return;
          toggle();
        }}
      >
        <Backdrop chapter={chapter} index={Math.max(0, index)} blurred={mode === "read"} playing={playing} />

        <div className="sleep-topbar">
          <span className="sleep-ref">
            {chapter.book} {chapter.chapter}
          </span>
          <div className="sleep-modes" role="tablist" aria-label="View">
            <button type="button" role="tab" aria-selected={mode === "listen"} onClick={() => setMode("listen")}>
              Listen
            </button>
            <button type="button" role="tab" aria-selected={mode === "read"} onClick={() => setMode("read")}>
              Read
            </button>
          </div>
          <button
            type="button"
            className="sleep-chip"
            aria-expanded={mixerOpen}
            onClick={() => setMixerOpen((v) => !v)}
          >
            Sound
          </button>
        </div>

        {mixerOpen ? (
          <div className="sleep-mixer">
            <label>
              Voice
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={narration}
                onChange={(e) => setNarration(Number(e.target.value))}
              />
            </label>
            <label>
              Rain
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={rain}
                onChange={(e) => setRain(Number(e.target.value))}
              />
            </label>
            <div className="sleep-timer" role="group" aria-label="Sleep timer">
              <span>Sleep timer</span>
              {TIMER_OPTIONS.map((m) => (
                <button key={m} type="button" aria-pressed={timerMin === m} onClick={() => chooseTimer(m)}>
                  {m === 0 ? "End of chapter" : `${m} min`}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {flash ? (
          <div className="sleep-flash" aria-hidden="true">
            {flash === "pause" ? (
              <svg viewBox="0 0 24 24" width="44" height="44">
                <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
                <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="44" height="44">
                <path d="M8 5 L19 12 L8 19 Z" fill="currentColor" />
              </svg>
            )}
          </div>
        ) : null}

        {mode === "listen" ? (
          <ListenView chapter={chapter} index={index} />
        ) : (
          <ReadView chapter={chapter} index={index} onPick={seekToVerse} />
        )}
      </div>

      <ThumbControls
        playing={playing}
        muted={muted}
        speed={speed}
        skipSeconds={15}
        onToggle={toggle}
        onSkip={seekBy}
        onMute={() => setMuted((m) => !m)}
        onSpeed={setSpeed}
        progress={
          <ProgressRow
            value={time}
            max={duration}
            label={clock}
            onSeek={(v) => {
              if (audioRef.current) audioRef.current.currentTime = v;
            }}
          />
        }
      />
      <p className="sleep-credit">
        Scripture from the {chapter.translation}.
        {muted ? " · Muted: reading along does not count toward your lamp." : ""}
        {timerEndsAt ? ` · Sleep timer: ${Math.max(0, Math.ceil((timerEndsAt - Date.now()) / 60000))} min left` : ""}
      </p>
    </div>
  );
}

/** One verse at a time, large and soft, fading in as it is read. */
function ListenView({ chapter, index }: { chapter: SleepChapter; index: number }) {
  if (index < 0) {
    return (
      <div className="listen-view">
        <p className="listen-eyebrow">{chapter.translation}</p>
        <p className="listen-title">
          {chapter.book} {chapter.chapter}
        </p>
        <p className="listen-sub">{chapter.title}</p>
      </div>
    );
  }
  const v = chapter.verses[index];
  return (
    <div className="listen-view" key={v.n}>
      {v.heading ? <p className="listen-eyebrow">{v.heading}</p> : <p className="listen-eyebrow">Verse {v.n}</p>}
      <p className="listen-verse">{v.text}</p>
      <p className="listen-ref">
        {chapter.book} {chapter.chapter}:{v.n}
      </p>
    </div>
  );
}

/** The whole chapter as a printed page; follows the narration, tap a verse to jump to it. */
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
      className="read-view"
      ref={scroller}
      onWheel={() => (userScrolledAt.current = Date.now())}
      onTouchMove={() => (userScrolledAt.current = Date.now())}
    >
      <article className="read-page">
        <p className="read-book">{chapter.book}</p>
        <h3 className="read-chapter">Chapter {chapter.chapter}</h3>
        {chapter.verses.map((v, k) => (
          <span key={v.n}>
            {v.heading ? <span className="read-heading">{v.heading}</span> : null}
            <span
              data-verse={v.n}
              className={`read-verse${k === index ? " is-current" : ""}${k < index ? " is-past" : ""}${k === 0 ? " is-first" : ""}`}
              role="button"
              tabIndex={0}
              onClick={() => onPick(k)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onPick(k)}
            >
              <sup className="read-num">{v.n}</sup>
              {v.text}{" "}
            </span>
          </span>
        ))}
        <p className="read-credit">Scripture quotations are from the {chapter.translation}.</p>
      </article>
    </div>
  );
}

/** Paintings that change with the passage and drift slowly; dimmer as the night goes on. */
function Backdrop({
  chapter,
  index,
  blurred,
  playing,
}: {
  chapter: SleepChapter;
  index: number;
  blurred: boolean;
  playing: boolean;
}) {
  const images = useMemo(() => [...new Set(chapter.verses.map((v) => v.image))], [chapter.verses]);
  const current = chapter.verses[index]?.image ?? images[0];
  return (
    <div className={`sleep-backdrop${blurred ? " is-blurred" : ""}${playing ? " is-playing" : ""}`} aria-hidden="true">
      {images.map((src) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={src} src={src} alt="" className={src === current ? "is-on" : ""} />
      ))}
      <div className="sleep-veil" />
    </div>
  );
}

/** Soft rain made in the browser (filtered brown noise), so no audio file is needed. */
function useAmbientRain() {
  const ctx = useRef<AudioContext | null>(null);
  const gain = useRef<GainNode | null>(null);

  const unlock = useCallback(() => {
    if (ctx.current) {
      void ctx.current.resume();
      return;
    }
    const Ctor =
      window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    const ac = new Ctor();
    const seconds = 4;
    const buffer = ac.createBuffer(1, ac.sampleRate * seconds, ac.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
      data[i] = last * 3.2;
    }
    const src = ac.createBufferSource();
    src.buffer = buffer;
    src.loop = true;
    const lowpass = ac.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 1100;
    const g = ac.createGain();
    g.gain.value = 0;
    src.connect(lowpass).connect(g).connect(ac.destination);
    src.start();
    ctx.current = ac;
    gain.current = g;
  }, []);

  const setLevel = useCallback((level: number) => {
    const g = gain.current;
    const ac = ctx.current;
    if (g && ac) g.gain.setTargetAtTime(level * 0.35, ac.currentTime, 0.4);
  }, []);

  useEffect(() => () => void ctx.current?.close(), []);
  return useMemo(() => ({ unlock, setLevel }), [unlock, setLevel]);
}

function clock(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
