"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Chapter, WordSpark } from "@/lib/bible/types";
import { WordSparkModal } from "./WordSparkModal";
import { useApp } from "@/lib/store";

interface Props {
  chapter: Chapter;
  onSwitchToScroll: () => void;
  onStoryComplete: (chapterKey: string) => { earned: number; streak: number };
  nextChapterUrl?: string;
}

const SLIDE_DURATION_MS = 8000;

export function StoryReader({
  chapter,
  onSwitchToScroll,
  onStoryComplete,
  nextChapterUrl,
}: Props) {
  const { user } = useApp();
  const slides = chapter.storySlides;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeSpark, setActiveSpark] = useState<WordSpark | null>(null);

  // Question slide state
  const [pickedChoice, setPickedChoice] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [rewardInfo, setRewardInfo] = useState<{ earned: number; streak: number } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressStartTime = useRef<number>(Date.now());
  const [progressPercent, setProgressPercent] = useState(0);

  const currentSlide = slides[currentIndex];
  const isQuestionSlide = currentSlide?.type === "question";

  const advance = useCallback(() => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex((i) => i + 1);
      setProgressPercent(0);
      progressStartTime.current = Date.now();
    } else {
      // Completed last slide
      if (!completed) {
        setCompleted(true);
        const result = onStoryComplete(`${chapter.bookSlug}-${chapter.chapterNumber}`);
        setRewardInfo(result);
      }
    }
  }, [currentIndex, slides.length, completed, onStoryComplete, chapter]);

  const goBack = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setProgressPercent(0);
      progressStartTime.current = Date.now();
    }
  }, [currentIndex]);

  // Keyboard navigation on desktop
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (activeSpark) return;
      if (e.key === "ArrowRight") {
        advance();
      } else if (e.key === "ArrowLeft") {
        goBack();
      } else if (e.key === " ") {
        e.preventDefault();
        setIsPaused((p) => !p);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [advance, goBack, activeSpark]);

  // Timer loop for auto-advance (paused on question slides or when inspecting a spark)
  useEffect(() => {
    if (isPaused || activeSpark || isQuestionSlide || completed) {
      return;
    }

    const interval = 50; // update progress every 50ms
    const timer = setInterval(() => {
      const elapsed = Date.now() - progressStartTime.current;
      const pct = Math.min(100, (elapsed / SLIDE_DURATION_MS) * 100);
      setProgressPercent(pct);

      if (elapsed >= SLIDE_DURATION_MS) {
        advance();
      }
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused, activeSpark, isQuestionSlide, completed, advance]);

  function handleCardClick(e: React.MouseEvent<HTMLDivElement>) {
    // If clicking on a button or link, do nothing
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;

    if (clickX < width * 0.35) {
      goBack();
    } else {
      advance();
    }
  }

  function handleAnswer(index: number) {
    setPickedChoice(index);
    setShowExplanation(true);
    if (!completed) {
      setCompleted(true);
      const res = onStoryComplete(`${chapter.bookSlug}-${chapter.chapterNumber}`);
      setRewardInfo(res);
    }
  }

  return (
    <div className="relative flex min-h-[80vh] w-full items-center justify-center py-4">
      {/* Ambient background blur for desktop */}
      <div className="absolute inset-0 -z-10 overflow-hidden opacity-30 blur-3xl pointer-events-none hidden md:block">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${currentSlide.artworkUrl || chapter.artworkUrl})` }}
        />
      </div>

      {/* Mobile/Desktop Story Card Container */}
      <div
        className="relative flex h-[780px] max-h-[88vh] w-full max-w-md flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl select-none"
        onClick={handleCardClick}
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Background Artwork */}
        <div className="absolute inset-0 -z-10">
          <Image
            src={currentSlide.artworkUrl || chapter.artworkUrl}
            alt={chapter.title}
            fill
            className="object-cover object-center opacity-85 transition-opacity duration-700"
            priority
          />
          {/* Vignette Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />
        </div>

        {/* Top Header & Segmented Progress Bars */}
        <div className="relative z-20 p-4">
          {/* Segmented Bars */}
          <div className="flex gap-1.5">
            {slides.map((slide, idx) => {
              let width = "0%";
              if (idx < currentIndex) width = "100%";
              else if (idx === currentIndex) width = `${progressPercent}%`;

              return (
                <div
                  key={slide.id}
                  className="h-1 flex-1 overflow-hidden rounded-full bg-white/25"
                >
                  <div
                    className="h-full bg-[var(--gold)] transition-all duration-75"
                    style={{ width }}
                  />
                </div>
              );
            })}
          </div>

          {/* Chapter Meta & Controls */}
          <div className="mt-3 flex items-center justify-between text-xs text-white/80">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-black/40 px-2.5 py-1 font-semibold backdrop-blur-md">
                {chapter.bookTitle} {chapter.chapterNumber}
              </span>
              <span className="text-white/60">
                {currentIndex + 1} / {slides.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSwitchToScroll();
                }}
                className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-md hover:bg-white/20 transition-all"
              >
                📜 Read Full
              </button>
            </div>
          </div>
        </div>

        {/* Center Content / Scripture Body */}
        <div className="relative z-10 flex flex-1 flex-col justify-end p-6 text-white animate-fade-in">
          {currentSlide.badge ? (
            <span className="inline-block self-start rounded-full border border-[var(--gold)]/40 bg-black/50 px-3 py-1 text-xs font-semibold text-[var(--gold)] backdrop-blur-md">
              {currentSlide.badge}
            </span>
          ) : null}

          {currentSlide.title ? (
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-white drop-shadow">
              {currentSlide.title}
            </h2>
          ) : null}

          {currentSlide.scriptureRef ? (
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[var(--gold)]">
              {currentSlide.scriptureRef}
            </p>
          ) : null}

          {/* Verse / Hook Text */}
          {currentSlide.type !== "question" ? (
            <blockquote className="mt-3 font-display text-xl leading-relaxed text-white/95 drop-shadow-md sm:text-2xl">
              {currentSlide.text}
            </blockquote>
          ) : null}

          {/* Interactive WordSpark Pill if available on this slide */}
          {currentSlide.spark ? (
            <div className="mt-4">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSpark(currentSlide.spark || null);
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--gold)]/50 bg-[var(--gold)]/20 px-3.5 py-1.5 text-xs font-semibold text-[var(--gold)] backdrop-blur-md hover:bg-[var(--gold)]/30 transition-all shadow-lg"
              >
                <span>✨ WordSpark:</span>
                <span className="italic">{currentSlide.spark.term}</span>
                <span className="text-[var(--gold)]/70">({currentSlide.spark.language})</span>
              </button>
            </div>
          ) : null}

          {/* Interactive Recall Question on Final Slide */}
          {currentSlide.type === "question" && currentSlide.question ? (
            <div className="mt-2 rounded-2xl border border-white/15 bg-black/60 p-5 backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--gold)]">
                Active Recall Check-In
              </p>
              <p className="mt-2 font-display text-lg font-medium leading-snug">
                {currentSlide.question.prompt}
              </p>

              <div className="mt-4 flex flex-col gap-2">
                {currentSlide.question.choices.map((choice, i) => {
                  let btnStyle = "border-white/20 bg-white/5 hover:bg-white/10 text-white";
                  if (pickedChoice !== null) {
                    if (i === currentSlide.question?.correctIndex) {
                      btnStyle = "border-emerald-500 bg-emerald-500/20 text-emerald-300 font-semibold";
                    } else if (i === pickedChoice) {
                      btnStyle = "border-rose-500 bg-rose-500/20 text-rose-300";
                    } else {
                      btnStyle = "opacity-40 border-white/10";
                    }
                  }

                  return (
                    <button
                      key={choice}
                      type="button"
                      disabled={pickedChoice !== null}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAnswer(i);
                      }}
                      className={`w-full rounded-xl border p-3 text-left text-sm transition-all ${btnStyle}`}
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>

              {showExplanation ? (
                <div className="mt-4 rounded-xl border border-[var(--gold)]/30 bg-[var(--gold)]/10 p-3 text-xs text-parchment/90 animate-fade-in">
                  <p className="font-semibold text-[var(--gold)]">Insight:</p>
                  <p className="mt-0.5">{currentSlide.question.explanation}</p>
                  {rewardInfo ? (
                    <div className="mt-2 flex items-center justify-between border-t border-[var(--gold)]/20 pt-2 text-xs">
                      <span className="text-emerald-400 font-medium">
                        +{rewardInfo.earned} coins added to pouch!
                      </span>
                      <span className="text-[var(--gold)]">
                        🔥 {rewardInfo.streak} Day Streak
                      </span>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        {/* Bottom Bar: Action buttons */}
        <div className="relative z-20 flex items-center justify-between border-t border-white/10 bg-black/50 p-4 backdrop-blur-md">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goBack();
            }}
            disabled={currentIndex === 0}
            className="rounded-full px-3 py-1.5 text-xs text-white/70 hover:text-white disabled:opacity-30"
          >
            ← Previous
          </button>

          {currentIndex < slides.length - 1 ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                advance();
              }}
              className="rounded-full bg-[var(--gold)] px-4 py-1.5 text-xs font-semibold text-[var(--gold-ink)] hover:brightness-110 shadow-lg"
            >
              Next Slide →
            </button>
          ) : nextChapterUrl ? (
            <Link
              href={nextChapterUrl}
              onClick={(e) => e.stopPropagation()}
              className="rounded-full bg-[var(--gold)] px-4 py-1.5 text-xs font-semibold text-[var(--gold-ink)] hover:brightness-110 shadow-lg"
            >
              Next Chapter →
            </Link>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSwitchToScroll();
              }}
              className="rounded-full bg-[var(--gold)] px-4 py-1.5 text-xs font-semibold text-[var(--gold-ink)] hover:brightness-110 shadow-lg"
            >
              Explore Full Text →
            </button>
          )}
        </div>
      </div>

      {/* WordSpark Context Drawer */}
      <WordSparkModal spark={activeSpark} onClose={() => setActiveSpark(null)} />
    </div>
  );
}
