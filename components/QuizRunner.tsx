"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Quiz } from "@/lib/types";
import { useApp } from "@/lib/store";
import { AdSlot } from "./AdSlot";

export function QuizRunner({ quiz }: { quiz: Quiz }) {
  const { user, recordAttempt } = useApp();
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [reward, setReward] = useState<{ coinsEarned: number; mastered?: string } | null>(
    null,
  );

  const question = quiz.questions[index];
  const progress = useMemo(
    () => Math.round((index / quiz.questions.length) * 100),
    [index, quiz.questions.length],
  );

  function choose(i: number) {
    if (picked !== null) return;
    setPicked(i);
    if (i === question.answerIndex) setCorrectCount((s) => s + 1);
  }

  function next() {
    if (index + 1 >= quiz.questions.length) {
      const totalScore = correctCount;
      const result = recordAttempt(quiz.slug, totalScore, quiz.questions.length);
      setFinalScore(totalScore);
      setReward(result);
      setDone(true);
      return;
    }
    setIndex((n) => n + 1);
    setPicked(null);
  }

  if (done) {
    const pct = Math.round((finalScore / quiz.questions.length) * 100);
    return (
      <div className="rounded-2xl border border-pine-700 bg-pine-900/60 p-8">
        {quiz.isSecret ? <AdSlot label="Post-quiz ad" /> : null}
        <p className="text-sm uppercase tracking-widest text-gold-400" data-testid="quiz-complete">
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
          <Link href="/quizzes" className="rounded-full bg-gold-400 px-4 py-2 text-pine-950">
            More quizzes
          </Link>
          {quiz.seriesSlug ? (
            <Link href={`/series/${quiz.seriesSlug}`} className="rounded-full border border-pine-500 px-4 py-2">
              Back to series
            </Link>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-pine-700 bg-pine-900/60 p-6 md:p-8">
      {quiz.isSecret ? <AdSlot /> : null}
      <div className="mb-6 h-2 overflow-hidden rounded-full bg-pine-800">
        <div className="h-full bg-gold-400" style={{ width: `${progress}%` }} />
      </div>
      <p className="text-sm text-pine-400">
        Question {index + 1} of {quiz.questions.length}
      </p>
      <h2 className="mt-2 font-display text-2xl md:text-3xl">{question.prompt}</h2>
      <div className="mt-6 grid gap-3">
        {question.choices.map((choice, i) => {
          const show = picked !== null;
          const correct = i === question.answerIndex;
          const selected = i === picked;
          let cls = "border-pine-600 hover:border-gold-400";
          if (show && correct) cls = "border-pine-400 bg-pine-700";
          if (show && selected && !correct) cls = "border-red-400/70 bg-red-950/40";
          return (
            <button
              key={choice}
              type="button"
              data-testid={`choice-${i}`}
              onClick={() => choose(i)}
              className={`rounded-xl border px-4 py-3 text-left ${cls}`}
            >
              {choice}
            </button>
          );
        })}
      </div>
      {picked !== null ? (
        <div className="mt-6">
          <p className="text-sm text-parchment/80">{question.explanation}</p>
          <button
            type="button"
            data-testid="quiz-next"
            onClick={next}
            className="mt-4 rounded-full bg-gold-400 px-5 py-2 font-medium text-pine-950"
          >
            {index + 1 >= quiz.questions.length ? "See results" : "Next"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
