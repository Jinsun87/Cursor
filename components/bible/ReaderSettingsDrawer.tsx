"use client";

import { useState, useRef } from "react";
import type { ReaderPreferences } from "@/lib/bible/reading-store";
import { triggerHaptic } from "@/lib/haptics";

interface Props {
  prefs: ReaderPreferences;
  onUpdatePrefs: (next: Partial<ReaderPreferences>) => void;
}

export function ReaderSettingsDrawer({ prefs, onUpdatePrefs }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartY = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
    setIsDragging(true);
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (touchStartY.current === null) return;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - touchStartY.current;

    // Allow downward drag with natural damping when pulling up
    if (deltaY > 0) {
      setDragY(deltaY);
    } else {
      setDragY(deltaY * 0.2);
    }
  }

  function handleTouchEnd() {
    setIsDragging(false);
    if (touchStartY.current === null) return;

    const duration = Math.max(1, Date.now() - touchStartTime.current);
    const velocity = dragY / duration; // px per ms

    // Dismiss if pulled down > 70px or flicked down
    if (dragY > 70 || (dragY > 30 && velocity > 0.35)) {
      triggerHaptic("light");
      setIsOpen(false);
    }

    setDragY(0);
    touchStartY.current = null;
  }

  const backdropOpacity = Math.max(0.15, 1 - Math.min(1, dragY / 280));

  return (
    <>
      {/* Floating "Aa" Accessibility Trigger Button */}
      <button
        type="button"
        onClick={() => {
          triggerHaptic("light");
          setIsOpen(true);
        }}
        aria-label="Reader Typography & Display Settings"
        className="pressable fixed bottom-24 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[var(--gold)]/60 bg-[#141b17] text-[var(--gold)] shadow-2xl backdrop-blur-md glass-specular"
      >
        <span className="font-serif text-xl font-bold tracking-tight">Aa</span>
      </button>

      {/* Drawer Overlay & Sheet */}
      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm transition-opacity duration-150"
          style={{
            backgroundColor: `rgba(0, 0, 0, ${0.75 * backdropOpacity})`,
          }}
          onClick={() => {
            triggerHaptic("light");
            setIsOpen(false);
          }}
        >
          <div
            className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border border-[var(--line)] bg-[var(--canvas-2)] p-6 sm:p-7 shadow-2xl glass-sanctuary touch-pan-y"
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

            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--gold)]/15 text-lg font-bold text-[var(--gold)]">
                  Aa
                </span>
                <div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-[var(--ink)] tracking-tight">
                    Readability & Text Size
                  </h3>
                  <p className="text-xs text-[var(--muted)]">Senior-friendly comfort settings</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic("light");
                  setIsOpen(false);
                }}
                className="pressable flex h-9 w-9 items-center justify-center rounded-full bg-black/10 dark:bg-white/10 text-base text-[var(--muted)] hover:text-[var(--ink)]"
              >
                ✕
              </button>
            </div>

            {/* Font Size Selector */}
            <div className="mt-6 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  Scripture Font Scale
                </label>
                <span className="text-xs font-semibold text-[var(--gold)]">
                  {prefs.fontSize === "jumbo"
                    ? "Senior Magnified (32px)"
                    : prefs.fontSize === "xlarge"
                    ? "Extra Large (26px)"
                    : prefs.fontSize === "large"
                    ? "Comfortable (22px)"
                    : "Standard (18px)"}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 rounded-2xl border border-[var(--line)] bg-black/5 dark:bg-black/30 p-2">
                {(
                  [
                    { id: "normal", label: "Std", sizeText: "A" },
                    { id: "large", label: "Large", sizeText: "A+" },
                    { id: "xlarge", label: "XL", sizeText: "A++" },
                    { id: "jumbo", label: "Senior", sizeText: "A+++" },
                  ] as const
                ).map((opt) => {
                  const isSelected = prefs.fontSize === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        triggerHaptic("selection");
                        onUpdatePrefs({ fontSize: opt.id });
                      }}
                      className={`pressable flex flex-col items-center justify-center rounded-xl py-3 transition-all min-h-[60px] ${
                        isSelected
                          ? "bg-[var(--gold)] text-black font-bold shadow-lg"
                          : "text-[var(--muted)] hover:text-[var(--ink)] hover:bg-black/5 dark:hover:bg-white/5"
                      }`}
                    >
                      <span className="text-lg leading-none font-serif font-bold">{opt.sizeText}</span>
                      <span className="text-[11px] mt-1 font-sans font-medium">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Verse Numbers Toggle */}
            <div className="mt-5 flex items-center justify-between rounded-2xl border border-[var(--line)] bg-black/5 dark:bg-black/20 p-4">
              <div>
                <p className="text-sm font-semibold text-[var(--ink)]">Verse Number Markers</p>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  Show or hide superscripts for distraction-free immersion
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={prefs.showVerseNumbers}
                onClick={() => {
                  triggerHaptic("light");
                  onUpdatePrefs({ showVerseNumbers: !prefs.showVerseNumbers });
                }}
                className={`pressable relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  prefs.showVerseNumbers ? "bg-[var(--gold)]" : "bg-black/20 dark:bg-white/20"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow ring-0 transition duration-200 ease-in-out ${
                    prefs.showVerseNumbers ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Close / Apply button */}
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic("light");
                  setIsOpen(false);
                }}
                className="pressable btn btn-primary text-xs py-2 px-6"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

