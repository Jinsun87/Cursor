"use client";

import { useState, useRef } from "react";
import type { WordSpark } from "@/lib/bible/types";
import { triggerHaptic } from "@/lib/haptics";

interface Props {
  spark: WordSpark | null;
  onClose: () => void;
}

export function WordSparkModal({ spark, onClose }: Props) {
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartY = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);

  if (!spark) return null;

  function handleTouchStart(e: React.TouchEvent) {
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
    setIsDragging(true);
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (touchStartY.current === null) return;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - touchStartY.current;

    // Only allow dragging downwards to dismiss
    if (deltaY > 0) {
      setDragY(deltaY);
    } else {
      // Small resistance when pulling up
      setDragY(deltaY * 0.2);
    }
  }

  function handleTouchEnd() {
    setIsDragging(false);
    if (touchStartY.current === null) return;

    const duration = Math.max(1, Date.now() - touchStartTime.current);
    const velocity = dragY / duration; // px per ms

    // Dismiss if pulled down > 70px or flicked down with velocity
    if (dragY > 70 || (dragY > 30 && velocity > 0.35)) {
      triggerHaptic("light");
      onClose();
    }

    setDragY(0);
    touchStartY.current = null;
  }

  const backdropOpacity = Math.max(0.15, 1 - Math.min(1, dragY / 280));

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm transition-opacity duration-150"
      style={{
        backgroundColor: `rgba(0, 0, 0, ${0.75 * backdropOpacity})`,
      }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl border border-[var(--gold)]/40 bg-[var(--canvas-2)] p-6 shadow-2xl touch-pan-y"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        style={{
          transform: `translate3d(0, ${Math.max(0, dragY)}px, 0)`,
          transition: isDragging
            ? "none"
            : "transform 280ms cubic-bezier(0.2, 0.9, 0.3, 1)",
          willChange: "transform",
        }}
      >
        {/* iOS Drag Handle Pill */}
        <div className="flex justify-center pb-3 -mt-1 sm:hidden">
          <div className="h-1.5 w-12 rounded-full bg-white/25 active:bg-white/40" />
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-[var(--gold)]/10 px-2.5 py-0.5 text-xs font-semibold text-[var(--gold)]">
              WordSpark · {spark.language}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              triggerHaptic("light");
              onClose();
            }}
            className="pressable grid h-8 w-8 place-items-center rounded-full text-sm text-[var(--muted)] hover:bg-[var(--canvas-3)] hover:text-white"
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
          onClick={() => {
            triggerHaptic("light");
            onClose();
          }}
          className="pressable btn btn-primary mt-6 w-full"
        >
          Return to Reading
        </button>
      </div>
    </div>
  );
}

