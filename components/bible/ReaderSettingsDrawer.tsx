"use client";

import { useState } from "react";
import type { ReaderPreferences } from "@/lib/bible/reading-store";

interface Props {
  prefs: ReaderPreferences;
  onUpdatePrefs: (next: Partial<ReaderPreferences>) => void;
}

export function ReaderSettingsDrawer({ prefs, onUpdatePrefs }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating "Aa" Accessibility Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Reader Typography & Display Settings"
        className="fixed bottom-20 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--gold)]/40 bg-[#18201b]/90 text-[var(--gold)] shadow-2xl backdrop-blur-md transition-all hover:scale-105 active:scale-95 glass-specular"
      >
        <span className="font-serif text-lg font-bold tracking-tight">Aa</span>
      </button>

      {/* Drawer Overlay & Sheet */}
      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in p-0 sm:p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border border-[var(--line)] bg-[#141814] p-6 shadow-2xl glass-sanctuary animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-[var(--gold)]">Aa</span>
                <h3 className="font-display text-lg font-bold text-white tracking-tight">
                  Typography & Reading Sanctuary
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-full bg-white/5 text-sm text-parchment/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Font Size Selector */}
            <div className="mt-5 space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Font Scale
              </label>
              <div className="grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-black/30 p-1.5">
                {(
                  [
                    { id: "normal", label: "Compact", sizeText: "A" },
                    { id: "large", label: "Comfortable", sizeText: "A+" },
                    { id: "xlarge", label: "Expanded", sizeText: "A++" },
                  ] as const
                ).map((opt) => {
                  const isSelected = prefs.fontSize === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => onUpdatePrefs({ fontSize: opt.id })}
                      className={`flex flex-col items-center justify-center rounded-xl py-2.5 transition-all tactile-tap ${
                        isSelected
                          ? "bg-[var(--gold)] text-black font-bold shadow-md"
                          : "text-parchment/70 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span className="text-base leading-none font-serif">{opt.sizeText}</span>
                      <span className="text-[10px] mt-1 font-sans">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Verse Numbers Toggle */}
            <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-4">
              <div>
                <p className="text-sm font-semibold text-white">Verse Number Markers</p>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  Show or hide superscripts for distraction-free immersion
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={prefs.showVerseNumbers}
                onClick={() => onUpdatePrefs({ showVerseNumbers: !prefs.showVerseNumbers })}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  prefs.showVerseNumbers ? "bg-[var(--gold)]" : "bg-white/20"
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
                onClick={() => setIsOpen(false)}
                className="btn btn-primary text-xs py-2 px-6 tactile-tap"
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
