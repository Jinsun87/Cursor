"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Chapter, WordSpark } from "@/lib/bible/types";
import { WordSparkModal } from "./WordSparkModal";
import { triggerHaptic } from "@/lib/haptics";

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
  const slides = chapter.storySlides;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeSpark, setActiveSpark] = useState<WordSpark | null>(null);

  // Question slide state
  const [pickedChoice, setPickedChoice] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [rewardInfo, setRewardInfo] = useState<{ earned: number; streak: number } | null>(null);

  const progressStartTime = useRef<number>(Date.now());
  const [progressPercent, setProgressPercent] = useState(0);

  // Glorify-grade 1:1 Real-time Touch Physics State
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);
  const isHorizontalSwipe = useRef<boolean | null>(null);
  const swipeOccurred = useRef<boolean>(false);

  const currentSlide = slides[currentIndex];
  const isQuestionSlide = currentSlide?.type === "question";

  const advance = useCallback(() => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex((i) => i + 1);
      setProgressPercent(0);
      progressStartTime.current = Date.now();
      triggerHaptic("light");
    } else {
      if (!completed) {
        setCompleted(true);
        const result = onStoryComplete(`${chapter.bookSlug}-${chapter.chapterNumber}`);
        setRewardInfo(result);
        triggerHaptic("success");
      }
    }
  }, [currentIndex, slides.length, completed, onStoryComplete, chapter]);

  const goBack = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setProgressPercent(0);
      progressStartTime.current = Date.now();
      triggerHaptic("light");
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

  // Timer loop for auto-advance
  useEffect(() => {
    if (isPaused || activeSpark || isQuestionSlide || completed) {
      return;
    }

    const interval = 50;
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
    if (swipeOccurred.current || Math.abs(dragX) > 8) {
      swipeOccurred.current = false;
      return;
    }

    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a") || target.closest("input")) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;

    triggerHaptic("selection");
    if (clickX < width * 0.35) {
      goBack();
    } else {
      advance();
    }
  }

  // Touch Handlers with 1:1 finger tracking, rubber-banding & velocity flick
  function handleTouchStart(e: React.TouchEvent) {
    setIsPaused(true);
    swipeOccurred.current = false;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
    isHorizontalSwipe.current = null;
    setIsDragging(true);
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - touchStartX.current;
    const deltaY = currentY - touchStartY.current;

    // Detect gesture direction after initial 6px movement
    if (isHorizontalSwipe.current === null && (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6)) {
      isHorizontalSwipe.current = Math.abs(deltaX) > Math.abs(deltaY) * 1.1;
    }

    if (isHorizontalSwipe.current) {
      // Apply rubber-band damping at boundaries (like iOS home screen)
      let effectiveX = deltaX;
      if (
        (currentIndex === 0 && deltaX > 0) ||
        (currentIndex === slides.length - 1 && deltaX < 0)
      ) {
        effectiveX = deltaX * 0.28;
      }
      setDragX(effectiveX);
    }
  }

  function handleTouchEnd() {
    setIsPaused(false);
    setIsDragging(false);

    if (touchStartX.current === null) {
      setDragX(0);
      return;
    }

    const duration = Math.max(1, Date.now() - touchStartTime.current);
    const velocity = Math.abs(dragX) / duration; // px per ms

    // Thresholds: either sustained drag (> 55px) or swift flick (> 25px with velocity > 0.32)
    const isSwipeLeft = dragX < -55 || (dragX < -25 && velocity > 0.32);
    const isSwipeRight = dragX > 55 || (dragX > 25 && velocity > 0.32);

    if (isSwipeLeft) {
      swipeOccurred.current = true;
      advance();
    } else if (isSwipeRight && currentIndex > 0) {
      swipeOccurred.current = true;
      goBack();
    }

    // Spring back smoothly
    setDragX(0);
    touchStartX.current = null;
    touchStartY.current = null;
    isHorizontalSwipe.current = null;
  }

  function handleAnswer(index: number) {
    setPickedChoice(index);
    setShowExplanation(true);
    const isCorrect = index === currentSlide.question?.correctIndex;
    triggerHaptic(isCorrect ? "success" : "warning");

    if (!completed) {
      setCompleted(true);
      const res = onStoryComplete(`${chapter.bookSlug}-${chapter.chapterNumber}`);
      setRewardInfo(res);
    }
  }

  const artworkSrc = currentSlide.artworkUrl || chapter.artworkUrl;

  return (
    <div className="relative flex min-h-[85vh] w-full items-center justify-center py-4">
      {/* Ambient background blur for desktop */}
      <div className="absolute inset-0 -z-10 overflow-hidden opacity-25 blur-3xl pointer-events-none hidden md:block">
        <div
          className="h-full w-full bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: `url(${artworkSrc})` }}
        />
      </div>

      {/* Mobile/Desktop Story Card Container with Glorify-grade 1:1 Touch Physics & Sanctuary Depth */}
      <div
        className="relative flex h-[820px] max-h-[92vh] w-full max-w-md flex-col justify-between overflow-hidden rounded-3xl border border-[var(--line)] bg-[#0d0f12] shadow-2xl select-none glass-specular touch-pan-y"
        onClick={handleCardClick}
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        style={{
          transform: `translate3d(${dragX}px, 0, 0) scale(${1 - Math.min(0.035, Math.abs(dragX) / 3600)})`,
          transition: isDragging
            ? "none"
            : "transform 360ms cubic-bezier(0.22, 1, 0.36, 1), opacity 200ms ease",
          willChange: "transform",
        }}
      >
        {/* Top Header & Segmented Progress Bars */}
        <div className="relative z-20 px-4 pt-3 pb-2">
          {/* Segmented Bars */}
          <div className="flex gap-1.5">
            {slides.map((slide, idx) => {
              let width = "0%";
              if (idx < currentIndex) width = "100%";
              else if (idx === currentIndex) width = `${progressPercent}%`;

              return (
                <div
                  key={slide.id}
                  className="h-1 flex-1 overflow-hidden rounded-full bg-white/20"
                >
                  <div
                    className="h-full bg-[var(--gold)] transition-all duration-75"
                    style={{ width }}
                  />
                </div>
              );
            })}
          </div>

          {/* Chapter Meta & Mode Switch */}
          <div className="mt-2.5 flex items-center justify-between text-xs text-parchment/80">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 font-semibold text-[var(--gold)]">
                {chapter.bookTitle} {chapter.chapterNumber}
              </span>
              <span className="text-[var(--muted)] text-[11px]">
                {currentIndex + 1} of {slides.length}
              </span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSwitchToScroll();
              }}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-0.5 text-xs text-parchment/80 hover:bg-white/10 hover:text-white transition-all"
            >
              📜 Full Text
            </button>
          </div>
        </div>

        {/* 1. THE VIBRANT ARTWORK FRAME (Top 50% - Completely un-tinted & crisp) */}
        <div className="relative mx-3.5 h-[48%] sm:h-[50%] overflow-hidden rounded-2xl border border-[var(--gold)]/30 bg-black shadow-lg">
          <Image
            key={artworkSrc}
            src={artworkSrc}
            alt={currentSlide.title || chapter.title}
            fill
            className="object-cover object-center transition-all duration-700 animate-fade-in hover:scale-105"
            priority
          />
          {/* Subtle bottom edge fade for frame aesthetic only */}
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

          {currentSlide.scriptureRef ? (
            <div className="absolute bottom-2 right-2 rounded-lg bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-[var(--gold)] backdrop-blur-md">
              {currentSlide.scriptureRef}
            </div>
          ) : null}

          {currentSlide.badge ? (
            <div className="absolute top-2 left-2 rounded-lg bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-parchment/90 backdrop-blur-md">
              {currentSlide.badge}
            </div>
          ) : null}
        </div>

        {/* 2. THE DEVOTIONAL TEXT CARD (Bottom 50% - High contrast, readable luxury parchment) */}
        <div className="relative z-10 flex flex-1 flex-col justify-between p-5 sm:p-7 text-white animate-fade-in overflow-y-auto">
          <div>
            {currentSlide.title ? (
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--gold)]">
                {currentSlide.title}
              </h2>
            ) : null}

            {/* Verse / Hook Text */}
            {currentSlide.type !== "question" ? (
              <blockquote className="mt-3 font-display text-lg sm:text-2xl leading-relaxed text-white drop-shadow-md">
                {currentSlide.text}
              </blockquote>
            ) : null}

            {/* Interactive WordSpark Pill */}
            {currentSlide.spark ? (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerHaptic("medium");
                    setActiveSpark(currentSlide.spark || null);
                  }}
                  className="pressable inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/60 bg-[var(--gold)]/20 px-4 py-1.5 text-xs sm:text-sm font-bold text-[var(--gold)] hover:bg-[var(--gold)]/30 transition-all shadow-lg active:scale-95"
                >
                  <span>✨ WordSpark:</span>
                  <span className="italic">{currentSlide.spark.term}</span>
                  <span className="text-[var(--gold)]/80">({currentSlide.spark.language})</span>
                </button>
              </div>
            ) : null}

            {/* Interactive Recall Question on Question Slide */}
            {currentSlide.type === "question" && currentSlide.question ? (
              <div className="mt-2 rounded-2xl border-2 border-[var(--gold)]/40 bg-[var(--canvas-2)] p-5 shadow-inner">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
                  Active Recall Check-In
                </p>
                <p className="mt-2 font-display text-lg sm:text-xl font-bold leading-snug text-white">
                  {currentSlide.question.prompt}
                </p>

                <div className="mt-4 flex flex-col gap-2.5">
                  {currentSlide.question.choices.map((choice, i) => {
                    let btnStyle = "border-[var(--line)] bg-[var(--canvas-1)] text-white hover:border-[var(--gold)]/50";
                    if (pickedChoice !== null) {
                      if (i === currentSlide.question?.correctIndex) {
                        btnStyle = "border-2 border-emerald-500 bg-emerald-500/25 text-emerald-300 font-bold shadow-md";
                      } else if (i === pickedChoice) {
                        btnStyle = "border-2 border-rose-500 bg-rose-500/25 text-rose-300";
                      } else {
                        btnStyle = "opacity-40 border-[var(--line)]";
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
                        className={`pressable w-full min-h-[52px] rounded-xl border p-3.5 text-left text-sm sm:text-base font-semibold transition-all ${btnStyle}`}
                      >
                        {choice}
                      </button>
                    );
                  })}
                </div>

                {showExplanation ? (
                  <div className="mt-4 rounded-xl border border-[var(--gold)]/40 bg-[var(--gold)]/15 p-3.5 text-sm text-white/95 animate-fade-in leading-relaxed">
                    <p className="font-bold text-[var(--gold)]">Context:</p>
                    <p className="mt-1">{currentSlide.question.explanation}</p>
                    {rewardInfo ? (
                      <div className="mt-3 flex items-center justify-between border-t border-[var(--gold)]/30 pt-2 text-sm font-semibold">
                        <span className="text-emerald-400">
                          +{rewardInfo.earned} coins added!
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
          <div className="mt-5 flex items-center justify-between border-t border-white/15 pt-4">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goBack();
              }}
              disabled={currentIndex === 0}
              className="pressable min-h-[46px] rounded-full px-4 py-2 text-sm font-semibold text-white/70 hover:text-white disabled:opacity-30 flex items-center gap-1 active:scale-95"
            >
              ← Back
            </button>

            {currentIndex < slides.length - 1 ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  advance();
                }}
                className="pressable min-h-[48px] rounded-full bg-[var(--gold)] px-6 py-2.5 text-sm sm:text-base font-bold text-black hover:brightness-110 shadow-lg shadow-[var(--gold)]/20 transition-all flex items-center gap-1.5 active:scale-95"
              >
                Next Slide →
              </button>
            ) : chapter.dayNumber ? (
              <Link
                href="/read#bible-canon"
                onClick={(e) => e.stopPropagation()}
                className="pressable min-h-[48px] rounded-full bg-[var(--gold)] px-6 py-2.5 text-sm sm:text-base font-bold text-black hover:brightness-110 shadow-lg shadow-[var(--gold)]/20 transition-all flex items-center gap-1.5 active:scale-95"
              >
                <span>📖 Explore Bible Canon</span>
                <span>→</span>
              </Link>
            ) : nextChapterUrl ? (
              <Link
                href={nextChapterUrl}
                onClick={(e) => e.stopPropagation()}
                className="pressable min-h-[48px] rounded-full bg-[var(--gold)] px-6 py-2.5 text-sm sm:text-base font-bold text-black hover:brightness-110 shadow-lg shadow-[var(--gold)]/20 transition-all flex items-center gap-1.5 active:scale-95"
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
                className="pressable min-h-[48px] rounded-full bg-[var(--gold)] px-6 py-2.5 text-sm sm:text-base font-bold text-black hover:brightness-110 shadow-lg shadow-[var(--gold)]/20 transition-all flex items-center gap-1.5 active:scale-95"
              >
                Read Full Text →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* WordSpark Context Modal */}
      <WordSparkModal spark={activeSpark} onClose={() => setActiveSpark(null)} />
    </div>
  );
}
