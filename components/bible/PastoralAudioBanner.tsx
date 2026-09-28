"use client";

import { useState, useEffect, useRef } from "react";
import { triggerHaptic } from "@/lib/haptics";
import type { TopicHomily } from "@/lib/bible/topics";

interface Props {
  homily: TopicHomily;
  scriptureReference?: string;
}

export function PastoralAudioBanner({ homily, scriptureReference }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [showTranscript, setShowTranscript] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  const durationSeconds = 120; // 2 minutes
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  function startAudio() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(homily.audioScript);
    utterance.rate = 0.86; // Contemplative, measured church father pace
    utterance.pitch = 0.88; // Deeper, warm pastoral resonance

    // Select the warmest, deepest natural voice available
    const voices = window.speechSynthesis.getVoices();
    const churchFatherVoice =
      voices.find(
        (v) =>
          v.lang.startsWith("en") &&
          (v.name.includes("Natural") ||
            v.name.includes("Daniel") ||
            v.name.includes("George") ||
            v.name.includes("Arthur") ||
            v.name.includes("Guy") ||
            v.name.includes("Male") ||
            v.name.includes("David")),
      ) ||
      voices.find((v) => v.lang.startsWith("en")) ||
      null;

    if (churchFatherVoice) {
      utterance.voice = churchFatherVoice;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      triggerHaptic("light");
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setProgress(100);
      setSecondsElapsed(durationSeconds);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);

    // Simulated 2-min audio progress timer
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    progressTimerRef.current = setInterval(() => {
      setSecondsElapsed((prev) => {
        const next = Math.min(durationSeconds, prev + 1);
        setProgress((next / durationSeconds) * 100);
        return next;
      });
    }, 1000);
  }

  function pauseAudio() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    triggerHaptic("light");
  }

  function togglePlay() {
    if (isPlaying) {
      pauseAudio();
    } else {
      startAudio();
    }
  }

  function handleSkip(seconds: number) {
    triggerHaptic("selection");
    setSecondsElapsed((prev) => {
      const next = Math.max(0, Math.min(durationSeconds, prev + seconds));
      setProgress((next / durationSeconds) * 100);
      return next;
    });
  }

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <aside aria-label="Pastoral audio reflection" className="mb-8 overflow-hidden rounded-3xl border border-[var(--gold)]/35 bg-[var(--canvas-2)] p-5 sm:p-6 shadow-2xl glass-sanctuary">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title & Metadata */}
        <div className="flex items-start gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--gold)]/40 bg-[var(--gold)]/15 text-2xl shadow-inner">
            🕊️
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="rounded-full bg-[var(--gold)]/15 border border-[var(--gold)]/30 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[var(--gold)]">
                {homily.preacher}
              </span>
              <span className="text-xs text-[var(--muted)]">·</span>
              <span className="text-xs font-semibold text-[var(--muted)]">
                {homily.duration} Pastoral Counsel
              </span>
              {scriptureReference ? (
                <>
                  <span className="text-xs text-[var(--muted)]">·</span>
                  <span className="text-xs font-semibold text-emerald-400">
                    {scriptureReference}
                  </span>
                </>
              ) : null}
            </div>
            <h2 className="font-display text-lg sm:text-xl font-bold text-[var(--ink)] tracking-tight mt-1">
              {homily.title}
            </h2>
            <p className="text-xs text-[var(--muted)] mt-0.5">
              Practical biblical counsel spoken in a church father&apos;s pastoral tone.
            </p>
          </div>
        </div>

        {/* Audio Player Controls */}
        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
          <button
            type="button"
            onClick={() => handleSkip(-15)}
            title="Rewind 15 seconds"
            className="pressable flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] bg-black/5 dark:bg-white/5 text-xs text-[var(--muted)] hover:text-[var(--ink)] transition-all"
          >
            -15s
          </button>

          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause homily audio" : "Play homily audio"}
            className="pressable flex h-12 w-12 items-center justify-center rounded-full bg-[var(--gold)] text-black font-bold text-lg shadow-lg shadow-[var(--gold)]/20 hover:brightness-110 transition-all active:scale-95"
          >
            {isPlaying ? "⏸" : "▶"}
          </button>

          <button
            type="button"
            onClick={() => handleSkip(15)}
            title="Fast forward 15 seconds"
            className="pressable flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] bg-black/5 dark:bg-white/5 text-xs text-[var(--muted)] hover:text-[var(--ink)] transition-all"
          >
            +15s
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic("selection");
              setShowTranscript((p) => !p);
            }}
            className="pressable ml-1 rounded-xl border border-[var(--line)] bg-black/5 dark:bg-white/5 px-3 py-2 text-xs font-semibold text-[var(--gold)] hover:bg-[var(--gold)]/10 transition-all"
          >
            {showTranscript ? "Hide Transcript" : "Counsel Transcript"}
          </button>
        </div>
      </div>

      {/* Progress Bar & Scrub Timeline */}
      <div className="mt-4 flex items-center gap-3">
        <span className="text-[11px] font-mono font-medium text-[var(--muted)]">
          {formatTime(secondsElapsed)}
        </span>
        <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[11px] font-mono font-medium text-[var(--muted)]">
          {homily.duration}
        </span>
      </div>

      {/* Expandable Practical Tips & Preaching Transcript */}
      {showTranscript ? (
        <div className="mt-5 border-t border-[var(--line)] pt-4 animate-fade-in text-sm text-[var(--ink)] space-y-4">
          <div className="rounded-2xl border border-[var(--gold)]/30 bg-[var(--gold)]/10 p-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
              📌 Practical Pastoral Guidance:
            </span>
            <ul className="mt-2 space-y-1.5 text-xs sm:text-sm text-[var(--ink)]">
              {homily.practicalTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[var(--gold)] font-bold">·</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              Full Spoken Homily:
            </span>
            <p className="mt-2 font-serif text-sm sm:text-base leading-relaxed text-[var(--muted)] italic bg-black/5 dark:bg-white/5 p-4 rounded-2xl border border-[var(--line)]">
              &ldquo;{homily.audioScript}&rdquo;
            </p>
          </div>
        </div>
      ) : null}
    </aside>
  );
}
