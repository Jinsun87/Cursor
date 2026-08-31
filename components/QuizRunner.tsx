"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import type { Question, Quiz } from "@/lib/types";
import { useApp } from "@/lib/store";
import { AdSlot } from "./AdSlot";
import { QuizHud } from "./QuizHud";
import {
  FIFTY_FIFTY_COST,
  LONGFORM_AD_EVERY,
  SKIP_AD_COST,
  STREAK_SKIPS_AD,
  shouldShowLongformAdBreak,
  wouldLongformAdBreak,
} from "@/lib/economy";
import { shareScoreText, sittingGrade } from "@/lib/grade";
import { fiftyFiftyHidden } from "@/lib/lifelines";
import { shuffleQuizDeck } from "@/lib/shuffle";
import {
  browserStorage,
  clearSitting,
  loadSitting,
  medalsPlated,
  saveSitting,
  sittingIsResumable,
} from "@/lib/sitting";
import { CourseMedals } from "./CourseMedals";

export function QuizRunner({ quiz }: { quiz: Quiz }) {
  const { user, recordAttempt, spendCoins } = useApp();
  const [deck, setDeck] = useState<Question[] | null>(null);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [streak, setStreak] = useState(0);
  const [done, setDone] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [pageBreak, setPageBreak] = useState(false);
  const [hiddenChoices, setHiddenChoices] = useState<number[]>([]);
  const [streakSkipNote, setStreakSkipNote] = useState(false);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [reward, setReward] = useState<{ coinsEarned: number; mastered?: string } | null>(
    null,
  );

  const booted = useRef(false);
  const fiftyLock = useRef(false);

  const questions = deck ?? quiz.questions;
  const question = questions[index];
  const course = Math.floor(index / LONGFORM_AD_EVERY) + 1;
  const courses = Math.ceil(questions.length / LONGFORM_AD_EVERY);
  const plated = medalsPlated(answered, LONGFORM_AD_EVERY, quiz.questions.length);
  const progress = useMemo(
    () => Math.round((index / questions.length) * 100),
    [index, questions.length],
  );

  function freshDeal() {
    clearSitting(quiz.slug, browserStorage());
    setDeck(shuffleQuizDeck(quiz.questions));
    setIndex(0);
    setPicked(null);
    setCorrectCount(0);
    setAnswered(0);
    setStreak(0);
    setDone(false);
    setFinalScore(0);
    setPageBreak(false);
    setHiddenChoices([]);
    setStreakSkipNote(false);
    setShareStatus(null);
    setReward(null);
    fiftyLock.current = false;
  }

  useEffect(() => {
    booted.current = false;
    const saved = loadSitting(quiz.slug, browserStorage());
    if (sittingIsResumable(saved, quiz.slug, quiz.questions.length)) {
      setDeck(saved.deck);
      setIndex(saved.index);
      setPicked(saved.picked);
      setCorrectCount(saved.correctCount);
      setAnswered(saved.answered);
      setStreak(saved.streak);
      setPageBreak(saved.pageBreak);
      setHiddenChoices(saved.hiddenChoices ?? []);
      fiftyLock.current = (saved.hiddenChoices ?? []).length > 0;
      setDone(false);
      setFinalScore(0);
      setReward(null);
    } else {
      freshDeal();
    }
    booted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz.slug]);

  useEffect(() => {
    if (!booted.current || !deck) return;
    const storage = browserStorage();
    if (done) {
      clearSitting(quiz.slug, storage);
      return;
    }
    saveSitting(
      {
        slug: quiz.slug,
        index,
        picked,
        correctCount,
        answered,
        streak,
        pageBreak,
        hiddenChoices,
        deck,
        savedAt: new Date().toISOString(),
      },
      storage,
    );
  }, [
    quiz.slug,
    index,
    picked,
    correctCount,
    answered,
    streak,
    pageBreak,
    hiddenChoices,
    done,
    deck,
  ]);

  function choose(i: number) {
    if (picked !== null) return;
    if (hiddenChoices.includes(i)) return;
    const ok = i === question.answerIndex;
    setPicked(i);
    setAnswered((n) => n + 1);
    if (ok) {
      setCorrectCount((s) => s + 1);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
  }

  function restart() {
    freshDeal();
  }

  function useFiftyFifty() {
    if (fiftyLock.current || picked !== null || hiddenChoices.length > 0) return;
    if (!spendCoins(FIFTY_FIFTY_COST)) return;
    fiftyLock.current = true;
    setHiddenChoices(fiftyFiftyHidden(question.answerIndex, question.choices.length));
  }

  function skipAdBreak() {
    if (!spendCoins(SKIP_AD_COST)) return;
    setPageBreak(false);
  }

  async function shareScore() {
    const grade = sittingGrade(finalScore, quiz.questions.length);
    const text = shareScoreText({
      title: quiz.title,
      score: finalScore,
      total: quiz.questions.length,
      letter: grade.letter,
      url: window.location.href,
    });
    try {
      if (navigator.share) {
        await navigator.share({ title: "QuizForge", text });
        setShareStatus("Shared.");
        return;
      }
    } catch {
      /* fall through to clipboard */
    }
    try {
      await navigator.clipboard.writeText(text);
      setShareStatus("Copied to clipboard.");
    } catch {
      setShareStatus("Copy the score from the card.");
    }
  }

  const hud = (
    <QuizHud
      questionNumber={Math.min(index + 1, quiz.questions.length)}
      total={quiz.questions.length}
      correct={correctCount}
      answered={answered}
      streak={streak}
      onRestart={restart}
    />
  );

  const medals = quiz.isLongform ? (
    <CourseMedals answered={answered} total={quiz.questions.length} />
  ) : null;

  function frame(body: ReactNode) {
    return (
      <div>
        {hud}
        {medals}
        {body}
      </div>
    );
  }

  function advance() {
    if (index + 1 >= quiz.questions.length) {
      const totalScore = correctCount;
      const result = recordAttempt(quiz.slug, totalScore, quiz.questions.length);
      setFinalScore(totalScore);
      setReward(result);
      setDone(true);
      return;
    }
    const completed = index + 1;
    const breakInput = {
      isLongform: quiz.isLongform,
      premium: user?.premium,
      questionsCompleted: completed,
      total: quiz.questions.length,
    };
    if (wouldLongformAdBreak(breakInput) && streak >= STREAK_SKIPS_AD) {
      setStreakSkipNote(true);
      setIndex(completed);
      setPicked(null);
      setHiddenChoices([]);
      fiftyLock.current = false;
      return;
    }
    if (shouldShowLongformAdBreak({ ...breakInput, streak })) {
      setIndex(completed);
      setPicked(null);
      setHiddenChoices([]);
      fiftyLock.current = false;
      setPageBreak(true);
      setStreakSkipNote(false);
      return;
    }
    setIndex((n) => n + 1);
    setPicked(null);
    setHiddenChoices([]);
    fiftyLock.current = false;
  }

  if (!deck) {
    return frame(
      <p className="rounded-2xl border p-8 text-sm" style={{ borderColor: "var(--line)" }}>
        Shuffling the options…
      </p>,
    );
  }

  if (done) {
    const pct = Math.round((finalScore / quiz.questions.length) * 100);
    const grade = sittingGrade(finalScore, quiz.questions.length);
    return frame(
      <div className="rounded-2xl border p-8" style={{ borderColor: "var(--line)", background: "var(--canvas-2)" }}>
        {quiz.isSecret || quiz.isLongform ? <AdSlot label="Post-quiz ad" /> : null}
        <p className="text-sm uppercase tracking-widest" style={{ color: "var(--gold)" }} data-testid="quiz-complete">
          Complete
        </p>
        <p
          className="mt-3 inline-flex min-h-12 min-w-12 items-center justify-center rounded-full border text-2xl font-display"
          data-testid="end-grade"
          style={{ borderColor: "var(--gold)", color: "var(--gold)" }}
        >
          {grade.letter}
        </p>
        <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
          {grade.title}
        </p>
        <h2 className="mt-2 font-display text-3xl">
          {finalScore}/{quiz.questions.length} · {pct}%
        </h2>
        {user ? (
          <p className="mt-3 text-parchment/80">
            +{reward?.coinsEarned ?? 0} coins landed in {user.username}&apos;s pouch.
          </p>
        ) : (
          <p className="mt-3 text-parchment/80">
            <Link href="/register" className="text-gold-400">
              Create a free account
            </Link>{" "}
            to keep coins, progress, and certificates.
          </p>
        )}
        {reward?.mastered ? (
          <p className="mt-4 rounded-xl bg-gold-400/15 p-4 text-gold-400">
            Certificate unlocked: {reward.mastered}.{" "}
            <Link href={`/certificate/${quiz.seriesSlug}`} className="underline">
              View it
            </Link>
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" className="btn btn-primary" data-testid="share-score" onClick={shareScore}>
            Share score
          </button>
          <Link href="/quizzes" className="btn btn-ghost">
            More quizzes
          </Link>
          {quiz.seriesSlug ? (
            <Link href={`/series/${quiz.seriesSlug}`} className="btn btn-ghost">
              Back to series
            </Link>
          ) : null}
        </div>
        {shareStatus ? (
          <p className="mt-3 text-sm" data-testid="share-status" style={{ color: "var(--muted)" }}>
            {shareStatus}
          </p>
        ) : null}
      </div>,
    );
  }

  if (pageBreak) {
    const canSkip = Boolean(user && !user.premium && user.coins >= SKIP_AD_COST);
    return frame(
      <div className="rounded-2xl border p-6 md:p-8" style={{ borderColor: "var(--line)", background: "var(--canvas-2)" }}>
        <p className="text-sm uppercase tracking-widest" style={{ color: "var(--gold)" }}>
          Course {course} of {courses} plated
        </p>
        <h2 className="mt-2 font-display text-2xl">Next course is firing</h2>
        <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
          {plated} of {courses} course medals are plated. Question {index + 1} of{" "}
          {quiz.questions.length} is up after this break. A streak of {STREAK_SKIPS_AD} skips the
          radio. Coins skip it once.
        </p>
        <AdSlot label="Between-course ad" />
        <div className="mt-2 flex flex-wrap gap-3">
          <button type="button" className="btn btn-primary" onClick={() => setPageBreak(false)}>
            Continue the sitting
          </button>
          {user && !user.premium ? (
            <button
              type="button"
              className="btn btn-ghost"
              data-testid="skip-ad"
              disabled={!canSkip}
              onClick={skipAdBreak}
            >
              Skip break · {SKIP_AD_COST} coins
            </button>
          ) : null}
        </div>
      </div>,
    );
  }

  const visibleChoices = question.choices.map((choice, i) => ({ choice, i })).filter(({ i }) => {
    if (picked !== null) return true;
    return !hiddenChoices.includes(i);
  });

  return frame(
    <div className="rounded-2xl border p-6 md:p-8" style={{ borderColor: "var(--line)", background: "var(--canvas-2)" }}>
      {quiz.isSecret ? <AdSlot /> : null}
      {streakSkipNote ? (
        <p
          className="mb-4 rounded-xl border px-3 py-2 text-sm"
          data-testid="streak-skip-note"
          style={{ borderColor: "var(--gold)", color: "var(--gold)" }}
        >
          Hot streak of {STREAK_SKIPS_AD} — the kitchen radio skipped this plate.
        </p>
      ) : null}
      <div
        className="mb-6 h-2 overflow-hidden rounded-full"
        style={{ background: "var(--pine-800)" }}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        aria-label="Quiz progress"
      >
        <div className="h-full" style={{ width: `${progress}%`, background: "var(--gold)" }} />
      </div>
      <p className="text-sm" style={{ color: "var(--muted)" }}>
        {quiz.isLongform ? `Course ${course} of ${courses}` : `${quiz.questions.length} questions`}
      </p>
      <h2 className="mt-2 font-display text-2xl md:text-3xl">{question.prompt}</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {user ? (
          <button
            type="button"
            data-testid="lifeline-5050"
            className="btn btn-ghost"
            disabled={picked !== null || hiddenChoices.length > 0 || user.coins < FIFTY_FIFTY_COST}
            onClick={useFiftyFifty}
          >
            50/50 · {FIFTY_FIFTY_COST} coins
          </button>
        ) : (
          <Link href="/register" className="btn btn-ghost" data-testid="lifeline-5050-locked">
            Join to use 50/50
          </Link>
        )}
      </div>
      <div className="mt-6 grid gap-3">
        {visibleChoices.map(({ choice, i }) => {
          const show = picked !== null;
          const correct = i === question.answerIndex;
          const selected = i === picked;
          let border = "var(--line)";
          let bg = "transparent";
          if (show && correct) {
            border = "var(--pine-400)";
            bg = "var(--pine-800)";
          }
          if (show && selected && !correct) {
            border = "#c45c5c";
            bg = "color-mix(in srgb, #c45c5c 16%, transparent)";
          }
          return (
            <button
              key={choice}
              type="button"
              data-testid={`choice-${i}`}
              onClick={() => choose(i)}
              className="min-h-12 rounded-xl border px-4 py-3 text-left"
              style={{ borderColor: border, background: bg, color: "var(--ink)" }}
            >
              {choice}
              {show && correct ? " · Correct" : ""}
              {show && selected && !correct ? " · Your pick" : ""}
            </button>
          );
        })}
      </div>
      {picked !== null ? (
        <div
          className="mt-6 rounded-2xl border p-4"
          data-testid="answer-fact"
          role="status"
          aria-live="polite"
          style={{
            borderColor: picked === question.answerIndex ? "var(--gold)" : "#c45c5c",
            background: "var(--canvas)",
          }}
        >
          <p className="text-sm font-semibold">
            {picked === question.answerIndex ? "That's right." : "Not this time."}
          </p>
          <p className="mt-1 text-sm">
            Correct answer:{" "}
            <strong>{question.choices[question.answerIndex]}</strong>
          </p>
          <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
            <span className="font-semibold" style={{ color: "var(--ink)" }}>
              Fact:{" "}
            </span>
            {question.explanation}
          </p>
          <button type="button" data-testid="quiz-next" onClick={advance} className="btn btn-primary mt-4">
            {index + 1 >= quiz.questions.length ? "See results" : "Next question"}
          </button>
        </div>
      ) : null}
    </div>,
  );
}
