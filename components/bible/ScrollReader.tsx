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
  const [localFontSize, setLocalFontSize] = useState<"normal" | "large" | "xlarge">("large");
  const [localShowVerseNumbers, setLocalShowVerseNumbers] = useState(true);
  const [activeSpark, setActiveSpark] = useState<WordSpark | null>(null);

  const fontSize = prefs?.fontSize ?? localFontSize;
  const showVerseNumbers = prefs?.showVerseNumbers ?? localShowVerseNumbers;

  function handleSetFontSize(val: "normal" | "large" | "xlarge") {
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
    normal: "text-base sm:text-lg leading-relaxed",
    large: "text-lg sm:text-xl leading-loose",
    xlarge: "text-xl sm:text-2xl leading-loose",
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
            <span className="rounded-full bg-[var(--gold)]/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--gold)] backdrop-blur-md">
              {chapter.bookTitle} · Chapter {chapter.chapterNumber}
            </span>
            <button
              type="button"
              onClick={onSwitchToStory}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md hover:bg-white/20 transition-all text-white"
            >
              <span>⚡ Switch to Story Reel</span>
            </button>
          </div>

          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight">
            {chapter.title}
          </h1>
          <p className="mt-1 text-sm sm:text-base text-white/80 max-w-xl">
            {chapter.subtitle}
          </p>
        </div>
      </div>

      {/* Reader Controls Toolbar */}
      <div className="sticky top-16 z-30 mb-8 flex items-center justify-between rounded-2xl border border-[var(--line)] bg-[var(--canvas-2)]/90 p-3 shadow-md backdrop-blur-md glass-specular">
        <div className="flex items-center gap-1">
          <span className="text-xs text-[var(--muted)] mr-1">Text size:</span>
          <button
            type="button"
            onClick={() => handleSetFontSize("normal")}
            className={`h-8 w-8 rounded-lg text-xs font-semibold transition-all tactile-tap ${
              fontSize === "normal" ? "bg-[var(--canvas-3)] text-[var(--gold)] border border-[var(--gold)]/40" : "text-[var(--muted)]"
            }`}
          >
            A
          </button>
          <button
            type="button"
            onClick={() => handleSetFontSize("large")}
            className={`h-8 w-8 rounded-lg text-sm font-semibold transition-all tactile-tap ${
              fontSize === "large" ? "bg-[var(--canvas-3)] text-[var(--gold)] border border-[var(--gold)]/40" : "text-[var(--muted)]"
            }`}
          >
            A+
          </button>
          <button
            type="button"
            onClick={() => handleSetFontSize("xlarge")}
            className={`h-8 w-8 rounded-lg text-base font-semibold transition-all tactile-tap ${
              fontSize === "xlarge" ? "bg-[var(--canvas-3)] text-[var(--gold)] border border-[var(--gold)]/40" : "text-[var(--muted)]"
            }`}
          >
            A++
          </button>
        </div>

        <button
          type="button"
          onClick={handleToggleVerseNumbers}
          className="rounded-full border border-[var(--line)] px-3 py-1 text-xs font-medium text-[var(--muted)] hover:text-[var(--ink)] transition-all tactile-tap"
        >
          {showVerseNumbers ? "Numbers: On" : "Numbers: Off"}
        </button>
      </div>

      {/* Scripture Verses Text */}
      <article className={`rounded-3xl border border-[var(--line)] bg-[var(--canvas-2)] p-6 sm:p-10 font-display text-[var(--ink)] shadow-sm ${fontClasses}`}>
        {chapter.verses.map((v) => (
          <p key={v.number} className="mb-4">
            {showVerseNumbers ? (
              <span className="mr-2.5 select-none text-xs font-sans font-bold text-[var(--gold)] opacity-70">
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
                  className="ml-2 inline-flex items-center gap-1 rounded-full border border-[var(--gold)]/40 bg-[var(--gold)]/10 px-2 py-0.5 font-sans text-xs font-semibold text-[var(--gold)] hover:bg-[var(--gold)]/20 transition-all align-middle"
                >
                  ✨ {spark.term}
                </button>
              );
            })}
          </p>
        ))}
      </article>

      {/* End-of-Chapter Active Recall Check-In Card */}
      <section className="mt-12 rounded-3xl border border-[var(--gold)]/40 bg-[var(--canvas-2)] p-6 sm:p-8 shadow-xl glass-sanctuary">
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--gold)]">
              Active Recall Check-In
            </span>
            <h2 className="font-display text-2xl font-bold text-[var(--ink)] mt-0.5">
              Verify Your Understanding
            </h2>
          </div>
          <span className="rounded-full bg-[var(--gold)]/10 px-3 py-1 text-xs font-semibold text-[var(--gold)]">
            +50 Coins
          </span>
        </div>

        <div className="mt-6 divide-y divide-[var(--line)]">
          {questions.map((q, qIdx) => {
            const chosen = answers[qIdx];
            const isAnswered = chosen !== undefined;

            return (
              <div key={q.prompt} className="py-6 first:pt-0 last:pb-0">
                <p className="font-display text-lg font-medium text-[var(--ink)]">
                  <span className="text-[var(--gold)] font-sans mr-2">{qIdx + 1}.</span>
                  {q.prompt}
                </p>

                <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {q.choices.map((choice, cIdx) => {
                    let btnStyle = "border-[var(--line)] bg-[var(--canvas-1)] text-[var(--ink)] hover:border-[var(--gold)]/40";
                    if (isAnswered) {
                      if (cIdx === q.correctIndex) {
                        btnStyle = "border-emerald-500 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold";
                      } else if (cIdx === chosen) {
                        btnStyle = "border-rose-500 bg-rose-500/20 text-rose-700 dark:text-rose-300";
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
                        className={`rounded-2xl border p-3.5 text-left text-sm transition-all ${btnStyle}`}
                      >
                        {choice}
                      </button>
                    );
                  })}
                </div>

                {isAnswered ? (
                  <div className="mt-3 rounded-xl border border-[var(--line)] bg-[var(--canvas-1)] p-3 text-xs text-parchment/75">
                    <span className="font-semibold text-[var(--gold)]">Context: </span>
                    {q.explanation}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        {allAnswered && rewardInfo ? (
          <div className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center animate-fade-in">
            <p className="font-display text-xl font-bold text-emerald-400">
              Chapter Mastered!
            </p>
            <p className="mt-1 text-sm text-parchment/80">
              You earned <strong>+{rewardInfo.earned} coins</strong> and advanced your reading streak to{" "}
              <strong>🔥 {rewardInfo.streak} Days</strong>.
            </p>
          </div>
        ) : null}
      </section>

      {/* Chapter Navigation Footer */}
      <div className="mt-8 flex items-center justify-between border-t border-[var(--line)] pt-6">
        {prevChapterUrl ? (
          <Link href={prevChapterUrl} className="btn btn-secondary text-sm">
            ← Previous Chapter
          </Link>
        ) : <div />}

        {nextChapterUrl ? (
          <Link href={nextChapterUrl} className="btn btn-primary text-sm">
            Next Chapter →
          </Link>
        ) : (
          <Link href="/read" className="btn btn-primary text-sm">
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
