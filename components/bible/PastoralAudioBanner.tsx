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
  const sentenceIndexRef = useRef(0);
  const isPlayingRef = useRef(false);

  // Pre-warm SpeechSynthesis voices on mount to avoid initial 10-30s browser voice load freeze
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  function getBestVoice(): SpeechSynthesisVoice | null {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    return (
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
      null
    );
  }

  // Speak sentences in sequential chunks to avoid Chromium SpeechDispatcher 40-sec deadlock
  function speakSentence(sentences: string[], index: number) {
    if (!isPlayingRef.current || index >= sentences.length) {
      setIsPlaying(false);
      isPlayingRef.current = false;
      setProgress(100);
      setSecondsElapsed(durationSeconds);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      return;
    }

    sentenceIndexRef.current = index;
    const text = sentences[index];
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.88;
    utterance.pitch = 0.90;

    const voice = getBestVoice();
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onend = () => {
      if (isPlayingRef.current) {
        speakSentence(sentences, index + 1);
      }
    };

    utterance.onerror = () => {
      // Move to next sentence on minor speech error
      if (isPlayingRef.current && index + 1 < sentences.length) {
        speakSentence(sentences, index + 1);
      } else {
        setIsPlaying(false);
        isPlayingRef.current = false;
        if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      }
    };

    window.speechSynthesis.resume();
    window.speechSynthesis.speak(utterance);
  }

  function startAudio() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();

    // Split text into natural sentence chunks
    const sentences = homily.audioScript
      .split(/(?<=[.?!;])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);

    if (sentences.length === 0) return;

    isPlayingRef.current = true;
    setIsPlaying(true);
    triggerHaptic("light");

    // Start speaking chunk 0 immediately
    speakSentence(sentences, 0);

    // Progress timer
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
    isPlayingRef.current = false;
    setIsPlaying(false);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
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
      isPlayingRef.current = false;
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
              <span className="text-xs text-[var(--muted)] font-medium">·</span>
              <span className="text-xs text-[var(--gold)] font-semibold">
                {homily.duration || "2 min"} Pastoral Homily
              </span>
              {scriptureReference ? (
                <>
                  <span className="text-xs text-[var(--muted)] font-medium">·</span>
                  <span className="text-xs text-[var(--muted)] font-mono">{scriptureReference}</span>
                </>
              ) : null}
            </div>
            <h3 className="font-display text-lg sm:text-xl font-bold text-[var(--ink)] mt-1 tracking-tight">
              {homily.title}
            </h3>
          </div>
        </div>

        {/* Master Audio Control Buttons */}
        <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={() => handleSkip(-15)}
            className="pressable rounded-xl border border-[var(--line)] bg-[var(--canvas-1)] p-2.5 text-xs text-[var(--muted)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all"
            title="Rewind 15 seconds"
          >
            ↺ 15s
          </button>

          <button
            type="button"
            onClick={togglePlay}
            className={`pressable flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold shadow-lg transition-all active:scale-95 ${
              isPlaying
                ? "bg-amber-500 text-black shadow-amber-500/25 animate-pulse"
                : "bg-gradient-to-r from-[var(--gold)] to-amber-500 text-black shadow-[var(--gold)]/20 hover:brightness-110"
            }`}
          >
            <span className="text-base">{isPlaying ? "⏸" : "▶"}</span>
            <span>{isPlaying ? "Pause Reflection" : "Listen (2 Min)"}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSkip(15)}
            className="pressable rounded-xl border border-[var(--line)] bg-[var(--canvas-1)] p-2.5 text-xs text-[var(--muted)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all"
            title="Fast forward 15 seconds"
          >
            15s ↻
          </button>
        </div>
      </div>

      {/* Progress Bar & Timestamp */}
      <div className="mt-4 pt-3 border-t border-[var(--line)]">
        <div className="flex items-center justify-between text-[11px] font-mono text-[var(--muted)] mb-1.5">
          <span className="flex items-center gap-1.5 font-sans">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)] animate-pulse" />
            <span>Spoken Counsel &amp; Prayer</span>
          </span>
          <span>
            {formatTime(secondsElapsed)} / {formatTime(durationSeconds)}
          </span>
        </div>

        {/* Seek / Progress Track */}
        <div
          className="relative h-2 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10 cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const pct = Math.max(0, Math.min(1, clickX / rect.width));
            const newSec = Math.floor(pct * durationSeconds);
            setSecondsElapsed(newSec);
            setProgress(pct * 100);
          }}
        >
          <div
            className="h-full bg-gradient-to-r from-[var(--gold)] to-amber-500 transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Practical Action Steps Accordion / Callout */}
      <div className="mt-4 rounded-2xl border border-[var(--gold)]/20 bg-[var(--canvas-1)] p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--gold)] flex items-center gap-1.5">
            <span>✨</span>
            <span>Church Father Pastoral Prescriptions for Today:</span>
          </span>
          <button
            type="button"
            onClick={() => setShowTranscript(!showTranscript)}
            className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--gold)] transition-colors underline decoration-dotted"
          >
            {showTranscript ? "Hide Transcript" : "View Full Spoken Transcript"}
          </button>
        </div>

        {/* 3 Practical Life Takeaway Bullets */}
        <ul className="mt-2.5 space-y-1.5 text-xs text-[var(--ink)]">
          {homily.practicalTips.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-[var(--gold)] font-bold mt-0.5">•</span>
              <span className="leading-relaxed">{tip}</span>
            </li>
          ))}
        </ul>

        {/* Optional Expandable Transcript */}
        {showTranscript && (
          <div className="mt-3.5 pt-3 border-t border-[var(--line)] text-xs text-[var(--muted)] leading-relaxed italic animate-fade-in font-serif">
            &ldquo;{homily.audioScript}&rdquo;
          </div>
        )}
      </div>
    </aside>
  );
}
