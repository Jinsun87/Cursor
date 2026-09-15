"use client";

import type { QuizChapter } from "@/lib/types";
import { getChapterNumber } from "@/lib/chapters";

export function ChapterProgress({
  chapters,
  currentIndex,
  totalQuestions,
}: {
  chapters: QuizChapter[];
  currentIndex: number;
  totalQuestions: number;
}) {
  const activeChapterNum = getChapterNumber(chapters, currentIndex);
  const activeChapter = chapters[activeChapterNum - 1];

  return (
    <div
      className="mb-6 rounded-2xl border p-4"
      style={{ borderColor: "var(--line)", background: "var(--canvas-2)" }}
      data-testid="chapter-progress"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-widest">
        <span style={{ color: "var(--gold)" }}>
          Chapter {activeChapterNum} of {chapters.length}
        </span>
        <span style={{ color: "var(--muted)" }}>
          Question {currentIndex + 1} / {totalQuestions}
        </span>
      </div>

      <h3 className="mt-1 font-display text-lg font-semibold" style={{ color: "var(--ink)" }}>
        {activeChapter?.title}
      </h3>
      {activeChapter?.subtitle ? (
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          {activeChapter.subtitle}
        </p>
      ) : null}

      {/* Segmented Chapter Track */}
      <div className="mt-3 grid gap-1.5" style={{ gridTemplateColumns: `repeat(${chapters.length}, minmax(0, 1fr))` }}>
        {chapters.map((ch, i) => {
          const chNum = i + 1;
          const isPast = activeChapterNum > chNum;
          const isActive = activeChapterNum === chNum;

          // Calculate chapter progress % if active
          let fillPct = 0;
          if (isPast) {
            fillPct = 100;
          } else if (isActive) {
            const nextStart = chapters[i + 1]?.startIndex ?? totalQuestions;
            const chapterTotal = nextStart - ch.startIndex;
            const completedInCh = currentIndex - ch.startIndex;
            fillPct = Math.min(100, Math.max(0, Math.round((completedInCh / chapterTotal) * 100)));
          }

          return (
            <div key={ch.startIndex} className="group relative">
              <div
                className="h-2.5 overflow-hidden rounded-full transition-all"
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
              <p
                className="mt-1 truncate text-[10px] font-medium"
                style={{ color: isActive ? "var(--gold)" : isPast ? "var(--pine-400)" : "var(--muted)" }}
              >
                {ch.title.split(":")[0]}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
