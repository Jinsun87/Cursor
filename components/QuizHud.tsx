"use client";

import { accuracyTone, hudAccuracy, hudCoins } from "@/lib/hud";
import type { QuizChapter } from "@/lib/types";
import { getChapterNumber } from "@/lib/chapters";

type Props = {
  questionNumber: number;
  total: number;
  correct: number;
  answered: number;
  streak: number;
  onRestart: () => void;
  chapters?: QuizChapter[];
  currentIndex?: number;
};

export function QuizHud({
  questionNumber,
  total,
  correct,
  answered,
  streak,
  onRestart,
  chapters,
  currentIndex = 0,
}: Props) {
  const pct = hudAccuracy(correct, answered);
  const coins = hudCoins(correct);
  const tone = accuracyTone(pct);
  const pctColor = tone === "low" ? "#e07070" : tone === "high" ? "var(--gold)" : "var(--ink)";

  const activeChapterNum = chapters ? getChapterNumber(chapters, currentIndex) : 1;
  const activeChapter = chapters ? chapters[activeChapterNum - 1] : null;

  return (
    <div
      data-testid="quiz-hud"
      className="mb-6 rounded-2xl border p-4 md:p-5 shadow-sm"
      style={{ borderColor: "var(--line)", background: "var(--canvas-2)" }}
    >
      {/* Chapter Title & Segmented Track (if chapters exist) */}
      {chapters && chapters.length > 0 && (
        <div className="mb-4 pb-3 border-b border-[var(--line)]">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-widest">
            <span style={{ color: "var(--gold)" }} className="font-bold">
              Chapter {activeChapterNum} of {chapters.length}
            </span>
            <span style={{ color: "var(--muted)" }}>
              {activeChapter?.title}
            </span>
          </div>

          {/* Segmented Chapter Track */}
          <div className="mt-2.5 grid gap-1.5" style={{ gridTemplateColumns: `repeat(${chapters.length}, minmax(0, 1fr))` }}>
            {chapters.map((ch, i) => {
              const chNum = i + 1;
              const isPast = activeChapterNum > chNum;
              const isActive = activeChapterNum === chNum;

              let fillPct = 0;
              if (isPast) {
                fillPct = 100;
              } else if (isActive) {
                const nextStart = chapters[i + 1]?.startIndex ?? total;
                const chapterTotal = nextStart - ch.startIndex;
                const completedInCh = currentIndex - ch.startIndex;
                fillPct = Math.min(100, Math.max(0, Math.round((completedInCh / chapterTotal) * 100)));
              }

              return (
                <div key={ch.startIndex} className="group relative">
                  <div
                    className="h-2 overflow-hidden rounded-full transition-all"
                    style={{ background: "var(--pine-800)" }}
                  >
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${fillPct}%`,
                        background: isActive ? "var(--gold)" : isPast ? "var(--pine-400)" : "transparent",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Stats Bar */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs md:text-sm">
        <p data-testid="hud-question" className="font-medium">
          Question {questionNumber}
          <span style={{ color: "var(--muted)" }}> / {total}</span>
        </p>

        <p data-testid="hud-accuracy">
          <span style={{ color: pctColor, fontWeight: 700 }}>{pct}%</span>{" "}
          <span style={{ color: "var(--muted)" }}>Correct</span>
        </p>

        <p data-testid="hud-coins" className="inline-flex items-center gap-1.5">
          <span
            aria-hidden
            className="grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold"
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
          className="ml-auto px-2 py-1 text-xs font-semibold rounded hover:bg-[var(--bg-hover)] transition-colors"
          style={{ color: "var(--muted)" }}
        >
          Restart 🔄
        </button>
      </div>
    </div>
  );
}
