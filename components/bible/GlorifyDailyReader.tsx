"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Chapter, WordSpark } from "@/lib/bible/types";
import {
  getChapterQuote,
  getChapterContext,
  getChapterDevotional,
  getChapterPrayer,
} from "@/lib/bible/devotionals";
import { WordSparkModal } from "./WordSparkModal";

export type DailyStage = "quote" | "context" | "passage" | "devotional" | "prayer" | "summary";

interface Props {
  chapter: Chapter;
  initialStage?: DailyStage;
  onStageComplete?: (stage: "quote" | "passage" | "devotional" | "prayer") => void;
  onFinishAll?: (chapterKey: string) => { earned: number; streak: number };
  onSwitchToScroll?: () => void;
  nextChapterUrl?: string;
}

const SLIDE_DURATION_MS = 8000;

export function GlorifyDailyReader({
  chapter,
  initialStage = "quote",
  onStageComplete,
  onFinishAll,
  onSwitchToScroll,
  nextChapterUrl,
}: Props) {
  const [activeStage, setActiveStage] = useState<DailyStage>(initialStage);
  const [activeSpark, setActiveSpark] = useState<WordSpark | null>(null);

  // Stage 1: Quote state
  const quoteData = getChapterQuote(chapter);
  const [quoteLikes, setQuoteLikes] = useState(quoteData.likesCount || 1240);
  const [isLiked, setIsLiked] = useState(false);
  const [copiedQuote, setCopiedQuote] = useState(false);

  // Stage 2: Context state
  const contextData = getChapterContext(chapter);

  // Stage 3: Passage Reels state
  const slides = chapter.storySlides;
  const [slideIndex, setSlideIndex] = useState(0);
  const [slideProgress, setSlideProgress] = useState(0);
  const [isSlidePaused, setIsSlidePaused] = useState(false);
  const [fontSize, setFontSize] = useState<"normal" | "large" | "xlarge">("large");
  const [pickedChoice, setPickedChoice] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Stage 4: Devotional state
  const devotionalData = getChapterDevotional(chapter);

  // Stage 5: Prayer state
  const prayerData = getChapterPrayer(chapter);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Completed checklist stages
  const [completedStages, setCompletedStages] = useState<{
    quote: boolean;
    passage: boolean;
    devotional: boolean;
    prayer: boolean;
  }>({
    quote: false,
    passage: false,
    devotional: false,
    prayer: false,
  });

  const [rewardResult, setRewardResult] = useState<{ earned: number; streak: number } | null>(null);

  const slideStartTimeRef = useRef<number>(Date.now());

  // -------------------------------------------------------------
  // Stage Completion Helpers
  // -------------------------------------------------------------
  function markStageDone(stage: "quote" | "passage" | "devotional" | "prayer") {
    setCompletedStages((prev) => ({ ...prev, [stage]: true }));
    onStageComplete?.(stage);
  }

  // Handle Like Quote
  function handleLikeQuote() {
    if (isLiked) {
      setQuoteLikes((l) => l - 1);
      setIsLiked(false);
    } else {
      setQuoteLikes((l) => l + 1);
      setIsLiked(true);
    }
  }

  // Handle Share Quote
  async function handleShareQuote() {
    const textToShare = `"${quoteData.quote}" — ${quoteData.author} (${chapter.bookTitle} ${chapter.chapterNumber})`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${chapter.bookTitle} ${chapter.chapterNumber} · Lampstand Daily`,
          text: textToShare,
          url: typeof window !== "undefined" ? window.location.href : undefined,
        });
        return;
      } catch {
        // User cancelled or unsupported, fallback to copy
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(textToShare);
      setCopiedQuote(true);
      setTimeout(() => setCopiedQuote(false), 2500);
    }
  }

  // -------------------------------------------------------------
  // Passage Story Slide Timer
  // -------------------------------------------------------------
  const currentSlide = slides[slideIndex];
  const isQuestionSlide = currentSlide?.type === "question";

  const advanceSlide = useCallback(() => {
    if (slideIndex < slides.length - 1) {
      setSlideIndex((idx) => idx + 1);
      setSlideProgress(0);
      slideStartTimeRef.current = Date.now();
      setPickedChoice(null);
      setShowExplanation(false);
    } else {
      markStageDone("passage");
      setActiveStage("devotional");
    }
  }, [slideIndex, slides.length]);

  const prevSlide = useCallback(() => {
    if (slideIndex > 0) {
      setSlideIndex((idx) => idx - 1);
      setSlideProgress(0);
      slideStartTimeRef.current = Date.now();
      setPickedChoice(null);
      setShowExplanation(false);
    }
  }, [slideIndex]);

  useEffect(() => {
    if (activeStage !== "passage") return;
    if (isSlidePaused || activeSpark || isQuestionSlide) return;

    const interval = 50;
    const timer = setInterval(() => {
      const elapsed = Date.now() - slideStartTimeRef.current;
      const pct = Math.min(100, (elapsed / SLIDE_DURATION_MS) * 100);
      setSlideProgress(pct);

      if (elapsed >= SLIDE_DURATION_MS) {
        advanceSlide();
      }
    }, interval);

    return () => clearInterval(timer);
  }, [activeStage, isSlidePaused, activeSpark, isQuestionSlide, advanceSlide]);

  // -------------------------------------------------------------
  // Prayer Audio Narration (Web Speech API)
  // -------------------------------------------------------------
  const stopPrayerAudio = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setAudioProgress(0);
  }, []);

  function togglePrayerAudio() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (isPlayingAudio) {
      stopPrayerAudio();
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${prayerData.title}. ${prayerData.prayerText.replace(/\n\n/g, ". ")}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.88; // Serene, gentle cadence
      utterance.pitch = 0.95;

      utterance.onstart = () => {
        setIsPlayingAudio(true);
        setAudioProgress(10);
      };
      utterance.onend = () => {
        setIsPlayingAudio(false);
        setAudioProgress(100);
      };
      utterance.onerror = () => {
        setIsPlayingAudio(false);
      };

      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  }

  // Cleanup speech synthesis on unmount or stage change
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [activeStage]);

  // Complete full daily walk
  function handleCompletePrayer() {
    stopPrayerAudio();
    markStageDone("prayer");
    if (onFinishAll) {
      const result = onFinishAll(`${chapter.bookSlug}-${chapter.chapterNumber}`);
      setRewardResult(result);
    }
    setActiveStage("summary");
  }

  // -------------------------------------------------------------
  // Render Stages
  // -------------------------------------------------------------
  return (
    <div className="relative mx-auto max-w-xl overflow-hidden rounded-3xl border border-[var(--gold)]/30 bg-[#0d0f12] shadow-2xl text-white select-none min-h-[640px] flex flex-col justify-between">
      {/* Top Universal Stage Stepper Header */}
      <div className="relative z-30 flex items-center justify-between border-b border-white/10 bg-black/40 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
          {[
            { id: "quote", label: "Quote", icon: "🕊️" },
            { id: "context", label: "Context", icon: "📜" },
            { id: "passage", label: "Passage", icon: "⚡" },
            { id: "devotional", label: "Devotional", icon: "💬" },
            { id: "prayer", label: "Prayer", icon: "🙏" },
          ].map((st) => {
            const isCurrent = activeStage === st.id;
            const isPast =
              completedStages[st.id as keyof typeof completedStages] ||
              (st.id === "context" && completedStages.quote);

            return (
              <button
                key={st.id}
                onClick={() => {
                  stopPrayerAudio();
                  setActiveStage(st.id as DailyStage);
                }}
                className={`flex items-center gap-1 rounded-full px-2.5 py-1 transition-all ${
                  isCurrent
                    ? "bg-[var(--gold)] text-black font-bold shadow-md"
                    : isPast
                    ? "bg-white/15 text-white/90 hover:bg-white/20"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                <span>{st.icon}</span>
                <span className="hidden sm:inline">{st.label}</span>
                {isPast ? <span className="text-[10px] text-emerald-400">✓</span> : null}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {onSwitchToScroll ? (
            <button
              onClick={() => {
                stopPrayerAudio();
                onSwitchToScroll();
              }}
              title="Full Chapter Text"
              className="rounded-full bg-white/10 p-2 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
            >
              📖
            </button>
          ) : null}
          <Link
            href="/read"
            className="rounded-full bg-white/10 p-2 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
            title="Exit Reader"
          >
            ✕
          </Link>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. DAILY QUOTE STAGE                                      */}
      {/* ========================================================= */}
      {activeStage === "quote" && (
        <div className="relative flex-1 flex flex-col justify-between p-6 sm:p-8 animate-fadeIn">
          {/* Background Ambient Art with Vignette */}
          <div className="absolute inset-0 -z-10">
            <Image
              src={quoteData.bgImageUrl || chapter.artworkUrl}
              alt="Quote Background"
              fill
              className="object-cover opacity-35 scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f12] via-[#0d0f12]/80 to-transparent" />
            <div className="absolute inset-0 bg-radial-gradient" />
          </div>

          {/* Top Attribution & Meta */}
          <div className="flex items-center justify-between">
            <span className="rounded-full border border-[var(--gold)]/40 bg-[var(--gold)]/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
              Daily Anchor Quote
            </span>
            <span className="text-xs text-white/60">Day {chapter.dayNumber || 1}</span>
          </div>

          {/* Quote Body */}
          <div className="my-auto py-8 text-center max-w-md mx-auto">
            <div className="text-3xl text-[var(--gold)] font-serif mb-2">“</div>
            <blockquote className="font-serif text-2xl sm:text-3xl leading-relaxed text-white tracking-wide drop-shadow-md">
              {quoteData.quote}
            </blockquote>
            <div className="mt-6 flex flex-col items-center">
              <span className="font-semibold text-[var(--gold)] tracking-widest text-sm uppercase">
                {quoteData.author}
              </span>
              {quoteData.reference ? (
                <span className="text-xs text-white/50 mt-0.5">{quoteData.reference}</span>
              ) : null}
            </div>

            {/* Like & Share Social Bar */}
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={handleLikeQuote}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  isLiked
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                }`}
              >
                <span>{isLiked ? "❤️" : "🤍"}</span>
                <span>{quoteLikes.toLocaleString()}</span>
              </button>

              <button
                onClick={handleShareQuote}
                className="flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/20 transition-all"
              >
                <span>📤</span>
                <span>{copiedQuote ? "Copied!" : "Share Quote"}</span>
              </button>
            </div>
          </div>

          {/* Bottom Action CTA */}
          <div className="pt-4">
            <button
              onClick={() => {
                markStageDone("quote");
                setActiveStage("context");
              }}
              className="w-full min-h-[54px] rounded-2xl bg-white text-black font-bold text-base hover:bg-white/90 shadow-xl transition-all flex items-center justify-center gap-2 group"
            >
              <span>TAP HERE TO COMPLETE</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. CONTEXT & THEME STAGE                                  */}
      {/* ========================================================= */}
      {activeStage === "context" && (
        <div className="relative flex-1 flex flex-col justify-between p-6 sm:p-8 animate-fadeIn">
          {/* Subtle Ambient Background */}
          <div className="absolute inset-0 -z-10 opacity-20">
            <Image
              src={chapter.artworkUrl}
              alt={chapter.title}
              fill
              className="object-cover blur-sm"
            />
            <div className="absolute inset-0 bg-[#0d0f12]/90" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">
                {contextData.weeklyTheme}
              </span>
              <span className="text-xs text-[var(--gold)] font-bold">
                {chapter.bookTitle} {chapter.chapterNumber}
              </span>
            </div>

            <h2 className="mt-4 font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {contextData.themeTitle}
            </h2>
            <p className="mt-2 text-sm text-[var(--gold)]/90 font-medium">
              “{chapter.subtitle}”
            </p>

            <div className="mt-6 space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm sm:text-base leading-relaxed text-white/80">
              <p>{contextData.historicalContext}</p>
              {contextData.keyQuestion ? (
                <div className="border-t border-white/10 pt-3">
                  <span className="text-xs uppercase font-bold tracking-wider text-[var(--gold)]">
                    Reflective Question
                  </span>
                  <p className="mt-1 text-sm italic text-white/90 font-serif">
                    {contextData.keyQuestion}
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={() => setActiveStage("passage")}
              className="w-full min-h-[54px] rounded-2xl bg-[var(--gold)] text-black font-bold text-base hover:brightness-110 shadow-lg shadow-[var(--gold)]/20 transition-all flex items-center justify-center gap-2"
            >
              <span>OPEN SCRIPTURE PASSAGE</span>
              <span>⚡</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. PASSAGE REELS STAGE (Segmented Stories)                */}
      {/* ========================================================= */}
      {activeStage === "passage" && (
        <div className="relative flex-1 flex flex-col justify-between p-6 sm:p-8 animate-fadeIn">
          {/* Top Segmented Story Indicators */}
          <div className="absolute top-3 left-4 right-4 z-20 flex gap-1.5">
            {slides.map((_, idx) => {
              let width = "0%";
              if (idx < slideIndex) width = "100%";
              else if (idx === slideIndex) width = `${slideProgress}%`;

              return (
                <div
                  key={idx}
                  className="h-1 flex-1 overflow-hidden rounded-full bg-white/20"
                >
                  <div
                    className="h-full bg-white transition-[width] duration-75"
                    style={{ width }}
                  />
                </div>
              );
            })}
          </div>

          {/* Slide Backdrop */}
          <div className="absolute inset-0 -z-10">
            <Image
              src={currentSlide?.artworkUrl || chapter.artworkUrl}
              alt="Slide Artwork"
              fill
              className="object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f12] via-[#0d0f12]/80 to-transparent" />
          </div>

          {/* Slide Content Header */}
          <div className="pt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-white/70">
                {currentSlide?.badge || `Verse Reel ${slideIndex + 1}/${slides.length}`}
              </span>
              {currentSlide?.scriptureRef ? (
                <span className="text-xs text-[var(--gold)] font-bold">
                  {currentSlide.scriptureRef}
                </span>
              ) : null}
            </div>

            {/* Font Resize Dropdown */}
            <button
              onClick={() => {
                setFontSize((sz) =>
                  sz === "normal" ? "large" : sz === "large" ? "xlarge" : "normal"
                );
              }}
              className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold hover:bg-white/20 transition-colors"
            >
              Aa
            </button>
          </div>

          {/* Slide Body */}
          <div className="my-auto py-6">
            {currentSlide?.title ? (
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--gold)] mb-3">
                {currentSlide.title}
              </h3>
            ) : null}

            {/* Question Slide or Scripture Slide */}
            {isQuestionSlide && currentSlide?.question ? (
              <div className="space-y-4">
                <p className="font-display text-lg font-bold text-white">
                  {currentSlide.question.prompt}
                </p>
                <div className="space-y-2">
                  {currentSlide.question.choices.map((choice, cIdx) => {
                    const isSelected = pickedChoice === cIdx;
                    const isCorrect = cIdx === currentSlide.question?.correctIndex;
                    let btnStyle = "bg-white/10 text-white/90 border-white/10 hover:bg-white/20";

                    if (showExplanation) {
                      if (isCorrect) {
                        btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold";
                      } else if (isSelected) {
                        btnStyle = "bg-rose-500/20 border-rose-500 text-rose-300";
                      }
                    }

                    return (
                      <button
                        key={cIdx}
                        disabled={showExplanation}
                        onClick={() => {
                          setPickedChoice(cIdx);
                          setShowExplanation(true);
                        }}
                        className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all ${btnStyle}`}
                      >
                        {choice}
                      </button>
                    );
                  })}
                </div>

                {showExplanation ? (
                  <p className="rounded-xl bg-white/10 p-3 text-xs text-white/80 animate-fadeIn">
                    {currentSlide.question.explanation}
                  </p>
                ) : null}
              </div>
            ) : (
              <div
                className={`font-serif text-white/95 leading-relaxed drop-shadow-md ${
                  fontSize === "normal"
                    ? "text-lg"
                    : fontSize === "large"
                    ? "text-xl sm:text-2xl"
                    : "text-2xl sm:text-3xl"
                }`}
              >
                {currentSlide?.text}
              </div>
            )}

            {/* Interactive WordSpark Chip */}
            {currentSlide?.spark ? (
              <div className="mt-4">
                <button
                  onClick={() => setActiveSpark(currentSlide.spark || null)}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/40 bg-[var(--gold)]/10 px-3.5 py-1.5 text-xs font-semibold text-[var(--gold)] hover:bg-[var(--gold)]/20 transition-all shadow-sm"
                >
                  <span>✨ WordSpark:</span>
                  <span className="font-bold underline">{currentSlide.spark.term}</span>
                  <span className="font-serif">({currentSlide.spark.originalScript})</span>
                </button>
              </div>
            ) : null}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={prevSlide}
              disabled={slideIndex === 0}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/70 disabled:opacity-30 hover:bg-white/10 transition-colors"
            >
              ← Back
            </button>

            <button
              onClick={() => setIsSlidePaused((p) => !p)}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white/70 hover:bg-white/10 transition-colors"
              title={isSlidePaused ? "Resume" : "Pause"}
            >
              {isSlidePaused ? "▶" : "⏸"}
            </button>

            <button
              onClick={advanceSlide}
              className="flex-1 min-h-[48px] rounded-xl bg-white text-black font-bold text-sm hover:bg-white/90 shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <span>{slideIndex === slides.length - 1 ? "COMPLETE PASSAGE" : "NEXT VERSE"}</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. DEVOTIONAL COMMENTARY STAGE                            */}
      {/* ========================================================= */}
      {activeStage === "devotional" && (
        <div className="relative flex-1 flex flex-col justify-between p-6 sm:p-8 animate-fadeIn">
          <div className="overflow-y-auto max-h-[460px] pr-2 space-y-4">
            <div className="flex items-center justify-between">
              <span className="rounded-full border border-[var(--gold)]/40 bg-[var(--gold)]/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
                Daily Devotional Reflection
              </span>
              <span className="text-xs text-white/50">{devotionalData.readingMinutes} MIN READ</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {devotionalData.title}
            </h2>

            <div className="space-y-3 text-sm sm:text-base leading-relaxed text-white/80">
              {devotionalData.paragraphs.map((p, pIdx) => (
                <p key={pIdx}>{p}</p>
              ))}
            </div>

            {/* Key Takeaway Card */}
            <div className="rounded-2xl border border-[var(--gold)]/30 bg-[var(--gold)]/10 p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--gold)] flex items-center gap-1">
                <span>📌</span> Key Anchor
              </span>
              <p className="mt-1 font-serif text-sm sm:text-base text-white/90 italic">
                “{devotionalData.takeaway}”
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <button
              onClick={() => {
                markStageDone("devotional");
                setActiveStage("prayer");
              }}
              className="w-full min-h-[54px] rounded-2xl bg-[var(--gold)] text-black font-bold text-base hover:brightness-110 shadow-lg shadow-[var(--gold)]/20 transition-all flex items-center justify-center gap-2"
            >
              <span>ENTER DAILY PRAYER</span>
              <span>🙏</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. ATMOSPHERIC VIDEO / AUDIO PRAYER STAGE                 */}
      {/* ========================================================= */}
      {activeStage === "prayer" && (
        <div className="relative flex-1 flex flex-col justify-between p-6 sm:p-8 animate-fadeIn">
          {/* Atmospheric Serene Background with Ambient Glow */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#101b2b] via-[#1a1c29] to-[#0a0c10]" />
            {/* Ambient golden dust particles simulation */}
            <div className="absolute -top-1/4 -left-1/4 w-full h-full rounded-full bg-[var(--gold)]/10 blur-3xl animate-pulse" />
            <div className="absolute -bottom-1/4 -right-1/4 w-full h-full rounded-full bg-sky-500/10 blur-3xl" />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <span className="rounded-full border border-sky-400/40 bg-sky-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sky-300">
                Atmospheric Prayer · {prayerData.durationMinutes} MIN
              </span>
              {prayerData.scriptureInspiration ? (
                <span className="text-xs text-white/50">{prayerData.scriptureInspiration}</span>
              ) : null}
            </div>

            <h2 className="mt-4 font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {prayerData.title}
            </h2>

            {/* Audio Narrator Bar */}
            <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePrayerAudio}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--gold)] text-black font-bold shadow-md hover:scale-105 transition-transform"
                >
                  {isPlayingAudio ? "⏸" : "▶"}
                </button>
                <div>
                  <p className="text-xs font-bold text-white">
                    {isPlayingAudio ? "Reading prayer aloud..." : "Hear this prayer read"}
                  </p>
                  <p className="text-[10px] text-white/50">Soothing spoken narration</p>
                </div>
              </div>

              {/* Animated Waveform Bars */}
              <div className="flex items-end gap-1 h-6">
                {[40, 70, 100, 60, 85, 45, 90, 30].map((h, i) => (
                  <span
                    key={i}
                    className={`w-1 rounded-full bg-[var(--gold)] transition-all duration-300 ${
                      isPlayingAudio ? "animate-pulse" : "opacity-40"
                    }`}
                    style={{
                      height: isPlayingAudio ? `${Math.max(20, (h * (i % 2 === 0 ? 1 : 0.7)))}%` : "25%",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Prayer Text */}
            <div className="mt-6 max-h-[260px] overflow-y-auto pr-2">
              <div className="space-y-3 font-serif text-base sm:text-lg leading-relaxed text-white/95 whitespace-pre-line drop-shadow-sm">
                {prayerData.prayerText}
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={handleCompletePrayer}
              className="w-full min-h-[54px] rounded-2xl bg-[var(--gold)] text-black font-bold text-base hover:brightness-110 shadow-lg shadow-[var(--gold)]/20 transition-all flex items-center justify-center gap-2"
            >
              <span>AMEN · COMPLETE TODAY’S RITUAL</span>
              <span>✨</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. DAILY SUMMARY & CELEBRATION STAGE                     */}
      {/* ========================================================= */}
      {activeStage === "summary" && (
        <div className="relative flex-1 flex flex-col justify-between p-6 sm:p-8 animate-fadeIn text-center">
          <div className="my-auto py-6 max-w-md mx-auto">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-3xl border border-emerald-500/40 text-emerald-400 mb-4 animate-bounce">
              ✓
            </div>

            <h2 className="font-display text-3xl font-bold text-white">
              Daily Walk Completed!
            </h2>
            <p className="mt-2 text-sm text-white/70">
              You anchored your mind in Scripture today.
            </p>

            {/* Reward Card */}
            {rewardResult ? (
              <div className="mt-6 flex items-center justify-center gap-4 rounded-2xl border border-[var(--gold)]/40 bg-[var(--gold)]/10 p-4">
                <div>
                  <span className="text-2xl font-bold text-[var(--gold)]">
                    +{rewardResult.earned}
                  </span>
                  <p className="text-xs uppercase font-semibold text-white/60">Coins Earned</p>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div>
                  <span className="text-2xl font-bold text-orange-400">
                    🔥 {rewardResult.streak}
                  </span>
                  <p className="text-xs uppercase font-semibold text-white/60">Day Streak</p>
                </div>
              </div>
            ) : null}

            {/* Daily Checklist Breakdown */}
            <div className="mt-6 space-y-2 text-left rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
              {[
                { title: "Daily Quote", time: "1 MIN", icon: "🕊️" },
                { title: "Passage Context", time: "2 MIN", icon: "📜" },
                { title: "Scripture Reels", time: "3 MIN", icon: "⚡" },
                { title: "Devotional Reflection", time: "4 MIN", icon: "💬" },
                { title: "Atmospheric Prayer", time: "1 MIN", icon: "🙏" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-1 text-white/80">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{item.icon}</span>
                    <span className="font-medium text-white">{item.title}</span>
                  </div>
                  <span className="text-xs text-white/40">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-4">
            {nextChapterUrl ? (
              <Link
                href={nextChapterUrl}
                className="w-full min-h-[52px] rounded-2xl bg-[var(--gold)] text-black font-bold text-base hover:brightness-110 shadow-lg shadow-[var(--gold)]/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Continue to Next Day</span>
                <span>→</span>
              </Link>
            ) : null}
            <Link
              href="/read"
              className="w-full min-h-[48px] rounded-2xl border border-white/20 bg-white/5 text-white font-semibold text-sm hover:bg-white/10 transition-colors flex items-center justify-center"
            >
              Return to Sanctuary Hub
            </Link>
          </div>
        </div>
      )}

      {/* WordSpark Interactive Modal */}
      {activeSpark ? (
        <WordSparkModal spark={activeSpark} onClose={() => setActiveSpark(null)} />
      ) : null}
    </div>
  );
}
