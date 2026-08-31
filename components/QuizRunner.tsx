"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Quiz } from "@/lib/types";
import { useApp } from "@/lib/store";
import { AdSlot } from "./AdSlot";
import { LONGFORM_AD_EVERY, shouldShowLongformAdBreak } from "@/lib/economy";

export function QuizRunner({ quiz }: { quiz: Quiz }) {
  const { user, recordAttempt } = useApp();
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [pageBreak, setPageBreak] = useState(false);
  const [reward, setReward] = useState<{ coinsEarned: number; mastered?: string } | null>(
    null,
  );

  const question = quiz.questions[index];
  const course = Math.floor(index / LONGFORM_AD_EVERY) + 1;
  const courses = Math.ceil(quiz.questions.length / LONGFORM_AD_EVERY);
  const progress = useMemo(
    () => Math.round((index / quiz.questions.length) * 100),
    [index, quiz.questions.length],
  );

  function choose(i: number) {
    if (picked !== null) return;
    setPicked(i);
    if (i === question.answerIndex) setCorrectCount((s) => s + 1);
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
    if (
      shouldShowLongformAdBreak({
        isLongform: quiz.isLongform,
        premium: user?.premium,
        questionsCompleted: completed,
        total: quiz.questions.length,
      })
    ) {
      setIndex(completed);
      setPicked(null);
      setPageBreak(true);
      return;
    }
    setIndex((n) => n + 1);
    setPicked(null);
  }

  if (done) {
    const pct = Math.round((finalScore / quiz.questions.length) * 100);
    return (
      <div className="rounded-2xl border p-8" style={{ borderColor: "var(--line)", background: "var(--canvas-2)" }}>
        {quiz.isSecret || quiz.isLongform ? <AdSlot label="Post-quiz ad" /> : null}
        <p className="text-sm uppercase tracking-widest" style={{ color: "var(--gold)" }} data-testid="quiz-complete">
          Complete
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
          <Link href="/quizzes" className="btn btn-primary">
            More quizzes
          </Link>
          {quiz.seriesSlug ? (
            <Link href={`/series/${quiz.seriesSlug}`} className="btn btn-ghost">
              Back to series
            </Link>
          ) : null}
        </div>
      </div>
    );
  }

  if (pageBreak) {
    return (
      <div className="rounded-2xl border p-6 md:p-8" style={{ borderColor: "var(--line)", background: "var(--canvas-2)" }}>
        <p className="text-sm uppercase tracking-widest" style={{ color: "var(--gold)" }}>
          Course {course} of {courses} plated
        </p>
        <h2 className="mt-2 font-display text-2xl">Next course is firing</h2>
        <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
          Question {index + 1} of {quiz.questions.length} is up after this break. Premium skips the
          kitchen radio.
        </p>
        <AdSlot label="Between-course ad" />
        <button type="button" className="btn btn-primary mt-2" onClick={() => setPageBreak(false)}>
          Continue the sitting
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border p-6 md:p-8" style={{ borderColor: "var(--line)", background: "var(--canvas-2)" }}>
      {quiz.isSecret ? <AdSlot /> : null}
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
        Question {index + 1} of {quiz.questions.length}
        {quiz.isLongform ? ` · Course ${course} of ${courses}` : ""}
      </p>
      <h2 className="mt-2 font-display text-2xl md:text-3xl">{question.prompt}</h2>
      <div className="mt-6 grid gap-3">
        {question.choices.map((choice, i) => {
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
              style={{ borderColor: border, background: bg }}
            >
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
    </div>
  );
}
