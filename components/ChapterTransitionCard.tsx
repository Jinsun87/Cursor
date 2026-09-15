"use client";

import type { QuizChapter } from "@/lib/types";

export function ChapterTransitionCard({
  prevChapter,
  nextChapter,
  chapterNumber,
  totalChapters,
  onContinue,
}: {
  prevChapter?: QuizChapter;
  nextChapter: QuizChapter;
  chapterNumber: number;
  totalChapters: number;
  onContinue: () => void;
}) {
  return (
    <div
      className="rounded-2xl border p-6 md:p-8"
      style={{ borderColor: "var(--gold)", background: "var(--canvas-2)" }}
      data-testid="chapter-transition"
    >
      <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--gold)" }}>
        Milestone Reached · Chapter {chapterNumber - 1} of {totalChapters} Complete
      </p>

      {prevChapter ? (
        <h2 className="mt-2 font-display text-2xl md:text-3xl text-parchment">
          {prevChapter.title} — Completed!
        </h2>
      ) : null}

      <div
        className="mt-6 rounded-xl border p-5"
        style={{ borderColor: "var(--line)", background: "var(--canvas)" }}
      >
        <p className="text-xs uppercase tracking-wider font-semibold text-pine-400">
          Up Next · Chapter {chapterNumber} of {totalChapters}
        </p>
        <h3 className="mt-1 font-display text-xl text-gold-400">
          {nextChapter.title}
        </h3>
        {nextChapter.subtitle ? (
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
            {nextChapter.subtitle}
          </p>
        ) : null}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm font-medium" style={{ color: "var(--gold)" }}>
          ✨ Auto-saved! Take a breath or dive straight in.
        </p>
        <button
          type="button"
          className="btn btn-primary"
          data-testid="continue-chapter"
          onClick={onContinue}
        >
          Begin {nextChapter.title.split(":")[0]} →
        </button>
      </div>
    </div>
  );
}
