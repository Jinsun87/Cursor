"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { SleepChapter, SleepTiming } from "./types";
import { useListeningMeter } from "@/components/home2/useListening";
import { saveProgress } from "./progress";

export const SLEEP_SPEEDS = [0.75, 1, 1.25] as const;
export type SleepSpeed = (typeof SLEEP_SPEEDS)[number];
export const TIMER_OPTIONS = [0, 15, 30, 60] as const; // minutes; 0 = end of chapter
export type TimerMinutes = (typeof TIMER_OPTIONS)[number];
/** Walk: a brisk daytime reading. Sleep: the soft night reading. Same text, two recordings. */
export type ReadingMode = "walk" | "sleep";
const FADE_SECONDS = 12;

/** Where each mode's recording of a chapter lives. */
export function readingSources(chapter: SleepChapter, mode: ReadingMode) {
  return mode === "walk"
    ? { audio: `/walk/${chapter.slug}/chapter.mp3`, timing: `/walk/${chapter.slug}/timing.json` }
    : { audio: chapter.audioSrc, timing: chapter.timingSrc };
}

type SleepAudio = {
  chapter: SleepChapter | null;
  mode: ReadingMode;
  /** Index of the verse being read, or -1 before the first verse. */
  index: number;
  starts: number[];
  playing: boolean;
  /** The chapter played to its end (cleared when anything starts again). */
  ended: boolean;
  time: number;
  duration: number;
  expanded: boolean;
  muted: boolean;
  speed: SleepSpeed;
  narration: number;
  rain: number;
  timerMin: TimerMinutes;
  timerEndsAt: number | null;
  /**
   * Load a chapter in Walk or Sleep (if not already loaded that way), start it
   * and open the full-screen player; verse picks up at that verse.
   */
  open: (chapter: SleepChapter, opts?: { mode?: ReadingMode; verse?: number; expand?: boolean }) => void;
  toggle: () => void;
  seekBy: (seconds: number) => void;
  seekTo: (seconds: number) => void;
  seekToVerse: (k: number) => void;
  expand: () => void;
  collapse: () => void;
  /** Stop and clear the chapter; hides the mini player. */
  close: () => void;
  setMuted: (v: boolean) => void;
  setSpeed: (v: SleepSpeed) => void;
  setNarration: (v: number) => void;
  setRain: (v: number) => void;
  chooseTimer: (m: TimerMinutes) => void;
};

const Ctx = createContext<SleepAudio | null>(null);

export function useSleepAudio(): SleepAudio {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSleepAudio needs <SleepAudioProvider>");
  return v;
}

/**
 * One reading engine for the whole app, for both Walk and Sleep. It lives in
 * the root layout, so a chapter keeps playing while the reader moves between
 * sections and pages; the full-screen player and the mini player are two
 * views of it. Audio is a plain <audio> element, so it keeps going with the
 * screen locked and shows on the lock screen (Media Session).
 */
export function SleepAudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [chapter, setChapter] = useState<SleepChapter | null>(null);
  const [mode, setMode] = useState<ReadingMode>("sleep");
  const [timing, setTiming] = useState<SleepTiming | null>(null);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [time, setTime] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState<SleepSpeed>(1);
  const [narration, setNarration] = useState(1);
  const [rain, setRainState] = useState(0);
  // The reader's rain choice (Options or onboarding), remembered on this device.
  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem("lampstand-rain"));
      if (saved > 0 && saved <= 1) setRainState(saved);
    } catch {
      // ignore
    }
  }, []);
  const setRain = useCallback((v: number) => {
    setRainState(v);
    try {
      localStorage.setItem("lampstand-rain", String(v));
    } catch {
      // ignore
    }
  }, []);
  const [timerMin, setTimerMin] = useState<TimerMinutes>(0);
  const [timerEndsAt, setTimerEndsAt] = useState<number | null>(null);
  // Verse to jump to once this recording's timings have loaded.
  const pendingVerse = useRef(0);
  const meter = useListeningMeter();
  const ambient = useAmbientRain();

  useEffect(() => {
    if (!chapter) return setTiming(null);
    let live = true;
    setTiming(null);
    fetch(readingSources(chapter, mode).timing)
      .then((r) => r.json())
      .then((t: SleepTiming) => live && setTiming(t))
      .catch(() => live && setTiming(null));
    return () => {
      live = false;
    };
  }, [chapter, mode]);

  // Continue at a verse: seek once the timings (and the audio's length) are known.
  useEffect(() => {
    const el = audioRef.current;
    const v = pendingVerse.current;
    if (!el || !timing || v <= 1) return;
    pendingVerse.current = 0;
    const at = timing.verses[String(v)];
    if (at === undefined) return;
    if (el.readyState >= 1) el.currentTime = at;
    else el.addEventListener("loadedmetadata", () => (el.currentTime = at), { once: true });
  }, [timing]);

  const starts = useMemo(
    () => chapter?.verses.map((v) => timing?.verses[String(v.n)] ?? Number.POSITIVE_INFINITY) ?? [],
    [chapter, timing],
  );
  const index = useMemo(() => {
    let i = -1;
    starts.forEach((s, k) => {
      if (time >= s - 0.15) i = k;
    });
    return i;
  }, [starts, time]);
  const verse = chapter && index >= 0 ? chapter.verses[index] : null;

  // Remember the verse as the reading moves on, so either mode can continue from it.
  useEffect(() => {
    // Not while waiting to jump to a saved verse, or it would be overwritten with verse 1.
    if (chapter && playing && verse && !pendingVerse.current) saveProgress(chapter.slug, verse.n);
  }, [chapter, playing, verse]);

  // Lock-screen title follows the verse being read.
  useEffect(() => {
    if (!chapter || !("mediaSession" in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: verse ? `${chapter.book} ${chapter.chapter}:${verse.n} · ${verse.text.slice(0, 60)}` : `${chapter.book} ${chapter.chapter}`,
      artist: mode === "walk" ? "Lampstand Walk" : "Lampstand Sleep",
      album: chapter.translation,
      artwork: [{ src: verse?.image ?? chapter.verses[0].image, sizes: "768x1376", type: "image/jpeg" }],
    });
  }, [verse, chapter, mode]);

  const seekBy = useCallback((delta: number) => {
    const el = audioRef.current;
    if (el) el.currentTime = Math.max(0, Math.min(el.duration || Infinity, el.currentTime + delta));
  }, []);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    const a = () => audioRef.current;
    navigator.mediaSession.setActionHandler("play", () => void a()?.play());
    navigator.mediaSession.setActionHandler("pause", () => a()?.pause());
    navigator.mediaSession.setActionHandler("seekbackward", () => seekBy(-15));
    navigator.mediaSession.setActionHandler("seekforward", () => seekBy(15));
  }, [seekBy]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = narration;
  }, [narration]);
  // Muted keeps the chapter moving so the text advances at reading pace.
  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted]);
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    // A new source resets playbackRate to the default, so set both.
    el.defaultPlaybackRate = speed;
    el.playbackRate = speed;
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

  // Any other audio or video on the page starting pauses the reading.
  useEffect(() => {
    const onPlay = (e: Event) => {
      if (e.target !== audioRef.current) audioRef.current?.pause();
    };
    document.addEventListener("play", onPlay, true);
    return () => document.removeEventListener("play", onPlay, true);
  }, []);

  const start = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    ambient.unlock();
    void el.play();
    if (timerMin) setTimerEndsAt(Date.now() + timerMin * 60_000);
  }, [ambient, timerMin]);

  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) start();
    else el.pause();
  }, [start]);

  const open = useCallback(
    (next: SleepChapter, opts: { mode?: ReadingMode; verse?: number; expand?: boolean } = {}) => {
      const el = audioRef.current;
      const nextMode = opts.mode ?? "sleep";
      // expand: false plays without opening the full-screen player (onboarding's first moment).
      setExpanded(opts.expand ?? true);
      setEnded(false);
      if (!el) return;
      if (chapter?.slug !== next.slug || mode !== nextMode) {
        // Set the source here, inside the tap, so phones allow play() straight away.
        el.src = readingSources(next, nextMode).audio;
        pendingVerse.current = opts.verse && opts.verse > 1 ? opts.verse : 0;
        setTime(0);
        setMode(nextMode);
        setChapter(next);
      }
      if (el.paused) start();
    },
    [chapter, mode, start],
  );

  const seekTo = useCallback((seconds: number) => {
    if (audioRef.current) audioRef.current.currentTime = seconds;
  }, []);

  const seekToVerse = useCallback(
    (k: number) => {
      const el = audioRef.current;
      if (!el || !Number.isFinite(starts[k])) return;
      el.currentTime = starts[k];
      if (el.paused) start();
    },
    [starts, start],
  );

  const close = useCallback(() => {
    const el = audioRef.current;
    if (el) {
      el.pause();
      el.removeAttribute("src");
      el.load();
    }
    meter.stop();
    setExpanded(false);
    setTimerEndsAt(null);
    setChapter(null);
    setTime(0);
  }, [meter]);

  const chooseTimer = useCallback(
    (m: TimerMinutes) => {
      setTimerMin(m);
      setTimerEndsAt(m && playing ? Date.now() + m * 60_000 : null);
    },
    [playing],
  );

  const value = useMemo<SleepAudio>(
    () => ({
      chapter,
      mode,
      index,
      starts,
      playing,
      ended,
      time,
      duration: timing?.duration ?? 0,
      expanded,
      muted,
      speed,
      narration,
      rain,
      timerMin,
      timerEndsAt,
      open,
      toggle,
      seekBy,
      seekTo,
      seekToVerse,
      expand: () => setExpanded(true),
      collapse: () => setExpanded(false),
      close,
      setMuted,
      setSpeed,
      setNarration,
      setRain,
      chooseTimer,
    }),
    [chapter, mode, index, starts, playing, ended, time, timing, expanded, muted, speed, narration, rain, setRain, timerMin, timerEndsAt, open, toggle, seekBy, seekTo, seekToVerse, close, chooseTimer],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      {/* Always mounted, source set by open(): re-setting src from props would restart the chapter. */}
      <audio
        ref={audioRef}
        preload="auto"
        onPlay={() => {
          setPlaying(true);
          setEnded(false);
        }}
        onPause={() => {
          setPlaying(false);
          meter.stop();
        }}
        onEnded={() => {
          setPlaying(false);
          setEnded(true);
          meter.stop();
          if (chapter) saveProgress(chapter.slug, 1, true);
        }}
        onTimeUpdate={(e) => {
          const t = e.currentTarget.currentTime;
          setTime(t);
          // Muted time is reading, not listening, so it does not light the lamp.
          if (!e.currentTarget.paused && !e.currentTarget.muted) meter.tick(t);
          else meter.stop();
        }}
      />
    </Ctx.Provider>
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
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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

export function clock(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
