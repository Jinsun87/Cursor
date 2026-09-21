"use client";

import type { WordSpark } from "@/lib/bible/types";

interface Props {
  spark: WordSpark | null;
  onClose: () => void;
}

export function WordSparkModal({ spark, onClose }: Props) {
  if (!spark) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl border border-[var(--gold)]/40 bg-[var(--canvas-2)] p-6 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-[var(--gold)]/10 px-2.5 py-0.5 text-xs font-semibold text-[var(--gold)]">
              WordSpark · {spark.language}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full text-sm text-[var(--muted)] hover:bg-[var(--canvas-3)] hover:text-white"
            aria-label="Close insight"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 flex items-baseline gap-3">
          <span className="font-display text-4xl text-[var(--gold)]" dir="rtl">
            {spark.originalScript}
          </span>
          <div>
            <p className="font-display text-xl font-semibold">{spark.transliteration}</p>
            <p className="text-xs text-[var(--muted)]">English: &ldquo;{spark.term}&rdquo;</p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--canvas-1)] p-4 text-sm">
          <p className="font-semibold text-[var(--ink)]">Root Meaning</p>
          <p className="mt-1 text-[var(--muted)]">{spark.rootMeaning}</p>
        </div>

        <div className="mt-4 text-sm text-[var(--ink)]">
          <p className="font-semibold text-[var(--gold)]">Cultural & Theological Context</p>
          <p className="mt-1 leading-relaxed text-[var(--muted)]">{spark.culturalInsight}</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="btn btn-primary mt-6 w-full"
        >
          Return to Reading
        </button>
      </div>
    </div>
  );
}
