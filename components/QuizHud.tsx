"use client";

import { accuracyTone, hudAccuracy, hudCoins } from "@/lib/hud";

type Props = {
  questionNumber: number;
  total: number;
  correct: number;
  answered: number;
  streak: number;
  onRestart: () => void;
};

export function QuizHud({
  questionNumber,
  total,
  correct,
  answered,
  streak,
  onRestart,
}: Props) {
  const pct = hudAccuracy(correct, answered);
  const coins = hudCoins(correct);
  const tone = accuracyTone(pct);
  const pctColor = tone === "low" ? "#e07070" : tone === "high" ? "var(--gold)" : "var(--ink)";

  return (
    <div
      data-testid="quiz-hud"
      className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border px-4 py-3 text-sm"
      style={{ borderColor: "var(--line)", background: "var(--canvas-2)" }}
    >
      <p data-testid="hud-question" className="font-medium">
        Question {questionNumber}
        <span style={{ color: "var(--muted)" }}> / {total}</span>
      </p>
      <p data-testid="hud-accuracy">
        <span style={{ color: pctColor, fontWeight: 700 }}>{pct}%</span>{" "}
        <span style={{ color: "var(--muted)" }}>Correct</span>
      </p>
      <p data-testid="hud-coins" className="inline-flex items-center gap-2">
        <span
          aria-hidden
          className="grid h-6 w-6 place-items-center rounded-full text-xs font-bold"
          style={{ background: "var(--gold)", color: "var(--gold-ink)" }}
        >
          G
        </span>
        <span>
          {coins} <span style={{ color: "var(--muted)" }}>Coins</span>
        </span>
      </p>
      <p data-testid="hud-streak" className="inline-flex items-center gap-1">
        <span aria-hidden>🔥</span>
        {streak} <span style={{ color: "var(--muted)" }}>Streak</span>
      </p>
      <button
        type="button"
        data-testid="hud-restart"
        onClick={onRestart}
        className="ml-auto min-h-11 px-2 font-medium"
      >
        Restart
      </button>
    </div>
  );
}
