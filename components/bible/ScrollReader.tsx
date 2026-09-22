"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Chapter, WordSpark } from "@/lib/bible/types";
import type { ReaderPreferences } from "@/lib/bible/reading-store";
import { WordSparkModal } from "./WordSparkModal";
import { ReaderSettingsDrawer } from "./ReaderSettingsDrawer";

interface Props {
  chapter: Chapter;
  onSwitchToStory: () => void;
  onChapterComplete: (chapterKey: string) => { earned: number; streak: number };
  prevChapterUrl?: string;
  nextChapterUrl?: string;
  prefs?: ReaderPreferences;
  onUpdatePrefs?: (next: Partial<ReaderPreferences>) => void;
}

export function ScrollReader({
  chapter,
  onSwitchToStory,
  onChapterComplete,
  prevChapterUrl,
  nextChapterUrl,
  prefs,
  onUpdatePrefs,
}: Props) {
  const [localFontSize, setLocalFontSize] = useState<"normal" | "large" | "xlarge" | "jumbo">("large");
  const [localShowVerseNumbers, setLocalShowVerseNumbers] = useState(true);
  const [activeSpark, setActiveSpark] = useState<WordSpark | null>(null);

  const fontSize = prefs?.fontSize ?? localFontSize;
  const showVerseNumbers = prefs?.showVerseNumbers ?? localShowVerseNumbers;

  function handleSetFontSize(val: "normal" | "large" | "xlarge" | "jumbo") {
    setLocalFontSize(val);
    onUpdatePrefs?.({ fontSize: val });
  }

  function handleToggleVerseNumbers() {
    const nextVal = !showVerseNumbers;
    setLocalShowVerseNumbers(nextVal);
    onUpdatePrefs?.({ showVerseNumbers: nextVal });
  }

  // Check-In State
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [completed, setCompleted] = useState(false);
  const [rewardInfo, setRewardInfo] = useState<{ earned: number; streak: number } | null>(null);

  const questions = chapter.checkInQuestions;
  const allAnswered = questions.length > 0 && questions.every((_, idx) => answers[idx] !== undefined);

  function handleSelectChoice(qIdx: number, choiceIdx: number) {
    if (answers[qIdx] !== undefined) return; // already answered
    const nextAnswers = { ...answers, [qIdx]: choiceIdx };
    setAnswers(nextAnswers);

    if (questions.every((_, idx) => nextAnswers[idx] !== undefined) && !completed) {
      setCompleted(true);
      const res = onChapterComplete(`${chapter.bookSlug}-${chapter.chapterNumber}`);
      setRewardInfo(res);
    }
  }

  const fontClasses = {
    normal: "text-lg sm:text-xl leading-relaxed",
    large: "text-xl sm:text-2xl leading-loose",
    xlarge: "text-2xl sm:text-3xl leading-loose",
    jumbo: "text-3xl sm:text-4xl leading-loose",
  }[fontSize];

  return (
    <div className="mx-auto max-w-3xl animate-fade-in">
      {/* Header Artwork Banner */}
      <div className="relative mb-8 h-64 sm:h-96 w-full overflow-hidden rounded-3xl border border-[var(--line)] shadow-xl">
        <Image
          src={chapter.artworkUrl}
          alt={chapter.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="rounded-full bg-[var(--gold)]/20 px-3.5 py-1 text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--gold)] backdrop-blur-md">
              {chapter.bookTitle} · Chapter {chapter.chapterNumber}
            </span>
            <button
              type="button"
              onClick={onSwitchToStory}
              className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs sm:text-sm font-semibold backdrop-blur-md hover:bg-white/25 transition-all text-white shadow-md"
            >
              <span>⚡ Switch to Story Reel</span>
            </button>
          </div>

          <h1 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            {chapter.title}
          </h1>
          <p className="mt-1.5 text-base sm:text-lg text-white/90 max-w-2xl leading-relaxed">
            {chapter.subtitle}
          </p>
        </div>
      </div>

      {/* Reader Controls Toolbar */}
      <div className="sticky top-16 z-30 mb-8 flex items-center justify-between rounded-2xl border border-[var(--line)] bg-[var(--canvas-2)]/95 p-3 sm:p-4 shadow-lg backdrop-blur-md glass-specular">
        <div className="flex items-center gap-1.5">
          <span className="text-xs sm:text-sm font-semibold text-[var(--muted)] mr-1">Text size:</span>
          <button
            type="button"
            onClick={() => handleSetFontSize("normal")}
            title="Standard (18px)"
            className={`h-9 w-9 sm:h-10 sm:w-10 rounded-xl text-xs sm:text-sm font-bold transition-all tactile-tap ${
              fontSize === "normal" ? "bg-[var(--canvas-3)] text-[var(--gold)] border-2 border-[var(--gold)]/60 shadow-sm" : "text-[var(--muted)] hover:text-[var(--ink)]"
            }`}
          >
            A
          </button>
          <button
            type="button"
            onClick={() => handleSetFontSize("large")}
            title="Comfortable (22px)"
            className={`h-9 w-9 sm:h-10 sm:w-10 rounded-xl text-sm sm:text-base font-bold transition-all tactile-tap ${
              fontSize === "large" ? "bg-[var(--canvas-3)] text-[var(--gold)] border-2 border-[var(--gold)]/60 shadow-sm" : "text-[var(--muted)] hover:text-[var(--ink)]"
            }`}
          >
            A+
          </button>
          <button
            type="button"
            onClick={() => handleSetFontSize("xlarge")}
            title="Extra Large (26px)"
            className={`h-9 w-9 sm:h-10 sm:w-10 rounded-xl text-base sm:text-lg font-bold transition-all tactile-tap ${
              fontSize === "xlarge" ? "bg-[var(--canvas-3)] text-[var(--gold)] border-2 border-[var(--gold)]/60 shadow-sm" : "text-[var(--muted)] hover:text-[var(--ink)]"
            }`}
          >
            A++
          </button>
          <button
            type="button"
            onClick={() => handleSetFontSize("jumbo")}
            title="Senior Magnified (32px)"
            className={`h-9 w-9 sm:h-10 sm:w-10 rounded-xl text-lg sm:text-xl font-bold transition-all tactile-tap ${
              fontSize === "jumbo" ? "bg-[var(--canvas-3)] text-[var(--gold)] border-2 border-[var(--gold)]/60 shadow-sm" : "text-[var(--muted)] hover:text-[var(--ink)]"
            }`}
          >
            A+++
          </button>
        </div>

        <button
          type="button"
          onClick={handleToggleVerseNumbers}
          className="rounded-full border border-[var(--line)] px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-[var(--muted)] hover:text-[var(--ink)] transition-all tactile-tap"
        >
          {showVerseNumbers ? "Numbers: On" : "Numbers: Off"}
        </button>
      </div>

      {/* Scripture Verses Text */}
      <article className={`rounded-3xl border border-[var(--line)] bg-[var(--canvas-2)] p-6 sm:p-12 font-display text-[var(--ink)] shadow-md ${fontClasses}`}>
        {chapter.verses.map((v) => (
          <p key={v.number} className="mb-6 sm:mb-8 last:mb-0">
            {showVerseNumbers ? (
              <span className="mr-3 select-none text-base sm:text-lg font-sans font-black text-amber-500 inline-block align-baseline">
                {v.number}
              </span>
            ) : null}
            <span>{v.text}</span>
            {v.sparkIds?.map((sparkId) => {
              const spark = chapter.sparks[sparkId];
              if (!spark) return null;
              return (
                <button
                  key={sparkId}
                  type="button"
                  onClick={() => setActiveSpark(spark)}
                  className="ml-2.5 inline-flex items-center gap-1.5 rounded-full border border-[var(--gold)]/50 bg-[var(--gold)]/15 px-3 py-1 font-sans text-xs sm:text-sm font-bold text-[var(--gold)] hover:bg-[var(--gold)]/25 transition-all align-middle shadow-sm"
                >
                  ✨ {spark.term}
                </button>
              );
            })}
          </p>
        ))}
      </article>

      {/* End-of-Chapter Active Recall Check-In Card */}
      <section className="mt-12 rounded-3xl border-2 border-[var(--gold)]/40 bg-[var(--canvas-2)] p-6 sm:p-10 shadow-2xl glass-sanctuary">
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-5">
          <div>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--gold)]">
              Active Recall Check-In
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--ink)] mt-1">
              Verify Your Understanding
            </h2>
          </div>
          <span className="rounded-full bg-[var(--gold)]/15 border border-[var(--gold)]/30 px-3.5 py-1.5 text-xs sm:text-sm font-bold text-[var(--gold)]">
            +50 Coins
          </span>
        </div>

        <div className="mt-8 divide-y divide-[var(--line)]">
          {questions.map((q, qIdx) => {
            const chosen = answers[qIdx];
            const isAnswered = chosen !== undefined;

            return (
              <div key={q.prompt} className="py-7 first:pt-0 last:pb-0">
                <p className="font-display text-xl sm:text-2xl font-bold text-[var(--ink)] leading-snug">
                  <span className="text-amber-500 font-sans mr-2.5">{qIdx + 1}.</span>
                  {q.prompt}
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {q.choices.map((choice, cIdx) => {
                    let btnStyle = "border-[var(--line)] bg-[var(--canvas-1)] text-[var(--ink)] hover:border-[var(--gold)]/50 hover:bg-black/5 dark:hover:bg-white/5";
                    if (isAnswered) {
                      if (cIdx === q.correctIndex) {
                        btnStyle = "border-2 border-emerald-500 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold shadow-md";
                      } else if (cIdx === chosen) {
                        btnStyle = "border-2 border-rose-500 bg-rose-500/20 text-rose-700 dark:text-rose-300";
                      } else {
                        btnStyle = "opacity-40 border-[var(--line)]";
                      }
                    }

                    return (
                      <button
                        key={choice}
                        type="button"
                        disabled={isAnswered}
                        onClick={() => handleSelectChoice(qIdx, cIdx)}
                        className={`min-h-[58px] rounded-2xl border p-4 sm:p-5 text-left text-base sm:text-lg font-medium transition-all tactile-tap ${btnStyle}`}
                      >
                        {choice}
                      </button>
                    );
                  })}
                </div>

                {isAnswered ? (
                  <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--canvas-1)] p-4 text-sm sm:text-base text-parchment/80 leading-relaxed">
                    <span className="font-bold text-[var(--gold)]">Context: </span>
                    {q.explanation}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        {allAnswered && rewardInfo ? (
          <div className="mt-8 rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/15 p-6 text-center animate-fade-in shadow-xl">
            <p className="font-display text-2xl font-bold text-emerald-400">
              Chapter Mastered!
            </p>
            <p className="mt-2 text-base text-parchment/90">
              You earned <strong>+{rewardInfo.earned} coins</strong> and advanced your reading streak to{" "}
              <strong>🔥 {rewardInfo.streak} Days</strong>.
            </p>
          </div>
        ) : null}
      </section>

      {/* Chapter Navigation Footer */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[var(--line)] pt-8">
        {prevChapterUrl ? (
          <Link
            href={prevChapterUrl}
            className="w-full sm:w-auto min-h-[52px] px-6 py-3.5 rounded-2xl border border-[var(--line)] bg-[var(--canvas-2)] text-base font-bold text-[var(--ink)] hover:border-[var(--gold)]/50 transition-all text-center flex items-center justify-center gap-2"
          >
            ← Previous Chapter
          </Link>
        ) : <div />}

        {nextChapterUrl ? (
          <Link
            href={nextChapterUrl}
            className="w-full sm:w-auto min-h-[52px] px-7 py-3.5 rounded-2xl bg-[var(--gold)] text-black text-base font-bold hover:brightness-110 shadow-lg shadow-[var(--gold)]/20 transition-all text-center flex items-center justify-center gap-2"
          >
            Next Chapter →
          </Link>
        ) : (
          <Link
            href="/read"
            className="w-full sm:w-auto min-h-[52px] px-7 py-3.5 rounded-2xl bg-[var(--gold)] text-black text-base font-bold hover:brightness-110 shadow-lg shadow-[var(--gold)]/20 transition-all text-center flex items-center justify-center gap-2"
          >
            Back to Reading Sanctuary
          </Link>
        )}
      </div>

      {/* WordSpark Insight Drawer */}
      <WordSparkModal spark={activeSpark} onClose={() => setActiveSpark(null)} />

      {/* Floating Reader Settings & Typography Drawer */}
      <ReaderSettingsDrawer
        prefs={prefs || { fontSize, showVerseNumbers, preferredMode: "scroll" }}
        onUpdatePrefs={(next) => {
          if (next.fontSize) handleSetFontSize(next.fontSize);
          if (next.showVerseNumbers !== undefined) {
            setLocalShowVerseNumbers(next.showVerseNumbers);
            onUpdatePrefs?.({ showVerseNumbers: next.showVerseNumbers });
          }
        }}
      />
    </div>
  );
}
