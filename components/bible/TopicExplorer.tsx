"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BIBLE_TOPICS,
  TOPIC_CATEGORIES,
  type BibleTopic,
  type TopicSubSection,
} from "@/lib/bible/topics";
import { triggerHaptic } from "@/lib/haptics";
import { PastoralAudioBanner } from "./PastoralAudioBanner";

export function TopicExplorer() {
  const [selectedTopic, setSelectedTopic] = useState<BibleTopic | null>(null);
  const [selectedSubSection, setSelectedSubSection] = useState<TopicSubSection | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  function handleSelectTopic(topic: BibleTopic) {
    triggerHaptic("selection");
    setSelectedTopic(topic);
    setSelectedSubSection(null);
  }

  function handleSelectSubSection(sub: TopicSubSection) {
    triggerHaptic("selection");
    setSelectedSubSection(sub);
  }

  function handleBack() {
    triggerHaptic("light");
    if (selectedSubSection) {
      setSelectedSubSection(null);
    } else if (selectedTopic) {
      setSelectedTopic(null);
    }
  }

  // Filter topics based on search
  const filteredTopics = BIBLE_TOPICS.filter(
    (t) =>
      t.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subSections.some((s) => s.title.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  return (
    <div className="w-full">
      {/* Search Input for Topics */}
      <div className="relative mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search life topics (e.g. anger at work, anxiety, grief, patience)..."
          className="w-full rounded-2xl border border-[var(--line)] bg-[var(--canvas-1)] px-11 py-3 text-sm text-[var(--ink)] placeholder-[var(--muted)] focus:border-[var(--gold)] focus:outline-none transition-colors"
        />
        <span className="absolute left-4 top-3.5 text-base text-[var(--muted)]">🔍</span>
        {searchQuery ? (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-3 text-xs text-[var(--muted)] hover:text-[var(--ink)]"
          >
            ✕
          </button>
        ) : null}
      </div>

      {/* Main Categories & Topic Pills (Matches Video Layout) */}
      <div className="space-y-8">
        {TOPIC_CATEGORIES.map((cat) => {
          const categoryTopics = filteredTopics.filter((t) => t.category === cat.id);
          if (categoryTopics.length === 0) return null;

          return (
            <div
              key={cat.id}
              className="rounded-3xl border border-[var(--line)] bg-[var(--canvas-2)] p-6 sm:p-7 shadow-xl"
            >
              {/* Category Header */}
              <div className="flex items-center gap-2 mb-4">
                <span className="h-2 w-2 rounded-full bg-[var(--gold)]" />
                <h3 className="font-display text-lg sm:text-xl font-bold text-[var(--ink)] tracking-tight">
                  {cat.label}
                </h3>
              </div>

              {/* Topic Pills Grid (with chevrons >) */}
              <div className="flex flex-wrap gap-2.5">
                {categoryTopics.map((topic) => {
                  const isSelected = selectedTopic?.id === topic.id;
                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => handleSelectTopic(topic)}
                      className={`pressable inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition-all ${
                        isSelected
                          ? "border-[var(--gold)] bg-[var(--gold)]/20 text-[var(--gold)] shadow-md"
                          : "border-[var(--line)] bg-black/5 dark:bg-white/5 text-[var(--ink)] hover:border-[var(--gold)]/60 hover:text-[var(--gold)]"
                      }`}
                    >
                      <span>{topic.icon}</span>
                      <span>{topic.label}</span>
                      <span className="text-xs text-[var(--muted)]">›</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* DRAWER / BOTTOM SHEET: Sub-Sections List (Video Frame 3) */}
      {/* ========================================================= */}
      {selectedTopic && !selectedSubSection && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedTopic(null)}
        >
          <div
            className="w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-[var(--gold)]/40 bg-[var(--canvas-2)] p-6 sm:p-8 shadow-2xl text-[var(--ink)] touch-pan-y animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* iOS Drag Handle */}
            <div className="flex justify-center pb-3 -mt-2">
              <div className="h-1.5 w-12 rounded-full bg-white/20" />
            </div>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="text-3xl mb-1">{selectedTopic.icon}</div>
              <h3 className="font-display text-2xl font-bold text-[var(--ink)]">
                {selectedTopic.label}
              </h3>
              <p className="text-xs text-[var(--gold)] font-semibold mt-0.5 uppercase tracking-wider">
                {selectedTopic.categoryLabel}
              </p>
              <p className="text-xs text-[var(--muted)] mt-1 max-w-md mx-auto">
                {selectedTopic.summary}
              </p>
            </div>

            {/* Sub-Section Cards List (Matches Video Frame 3) */}
            <div className="space-y-2.5">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] px-1">
                Select Your Specific Situation:
              </p>
              {selectedTopic.subSections.map((sub, idx) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => handleSelectSubSection(sub)}
                  className="pressable group w-full flex items-center justify-between rounded-2xl border border-[var(--line)] bg-[var(--canvas-1)] p-4 text-left hover:border-[var(--gold)]/70 hover:bg-[var(--gold)]/5 transition-all shadow-sm"
                >
                  <div className="min-w-0 pr-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--gold)]">
                      {idx + 1}. {sub.tag}
                    </span>
                    <h4 className="font-display text-base font-bold text-[var(--ink)] group-hover:text-[var(--gold)] transition-colors mt-0.5">
                      {sub.title}
                    </h4>
                    <span className="text-xs text-[var(--muted)] mt-0.5 block truncate">
                      {sub.verse.reference} · {sub.verse.thematicTakeaway}
                    </span>
                  </div>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/10 dark:bg-white/10 text-sm text-[var(--gold)] group-hover:bg-[var(--gold)] group-hover:text-black transition-all">
                    →
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--line)] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedTopic(null)}
                className="pressable rounded-xl bg-black/10 dark:bg-white/10 px-5 py-2 text-xs font-semibold text-[var(--muted)] hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DETAIL MODAL: Specific Verse & Readers (Video Frame 5)     */}
      {/* ========================================================= */}
      {selectedSubSection && selectedTopic && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedSubSection(null)}
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[var(--gold)]/50 bg-[var(--canvas-2)] p-6 sm:p-8 shadow-2xl text-[var(--ink)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Navigation Bar with Back Button */}
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-4 mb-5">
              <button
                type="button"
                onClick={handleBack}
                className="pressable flex items-center gap-1.5 rounded-full bg-black/10 dark:bg-white/10 px-3 py-1.5 text-xs font-bold text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black transition-all"
              >
                <span>‹</span>
                <span>Back to {selectedTopic.label}</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedSubSection(null)}
                className="text-xs text-[var(--muted)] hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Sub-Section Title */}
            <div>
              <span className="rounded-full bg-[var(--gold)]/15 border border-[var(--gold)]/30 px-2.5 py-0.5 text-xs font-bold uppercase text-[var(--gold)]">
                {selectedSubSection.tag}
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-[var(--ink)] mt-2">
                {selectedSubSection.title}
              </h3>
            </div>

            {/* Scripture Verse Card (Matches Video Frame 5) */}
            <div className="mt-5 rounded-3xl border border-[var(--gold)]/40 bg-[var(--canvas-1)] p-6 shadow-inner">
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📜</span>
                  <span className="font-display text-base font-bold text-[var(--gold)]">
                    {selectedSubSection.verse.reference}
                  </span>
                </div>
                <span className="rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
                  Scripture Anchor
                </span>
              </div>

              <blockquote className="mt-4 font-serif text-lg sm:text-xl leading-relaxed text-[var(--ink)]">
                &ldquo;{selectedSubSection.verse.verseSnippet}&rdquo;
              </blockquote>

              <p className="mt-4 text-xs sm:text-sm text-[var(--muted)] leading-relaxed italic border-t border-[var(--line)] pt-3">
                💡 <strong className="text-[var(--gold)]">Theological Anchor:</strong>{" "}
                {selectedSubSection.verse.thematicTakeaway}
              </p>
            </div>

            {/* 2-Minute Church Father Preaching Audio Banner */}
            <div className="mt-6">
              <PastoralAudioBanner
                homily={selectedSubSection.homily}
                scriptureReference={selectedSubSection.verse.reference}
              />
            </div>

            {/* Two Action Buttons to Readers */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-[var(--line)]">
              <Link
                href={`/read/${selectedSubSection.verse.bookSlug}/${selectedSubSection.verse.chapterNumber}?mode=story&topic=${selectedSubSection.id}`}
                className="pressable w-full sm:flex-1 min-h-[48px] rounded-2xl bg-[var(--gold)] px-5 py-3 text-center text-sm font-bold text-black hover:brightness-110 shadow-lg shadow-[var(--gold)]/20 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span>⚡ Interactive Story / Shorts</span>
                <span>→</span>
              </Link>

              <Link
                href={`/read/${selectedSubSection.verse.bookSlug}/${selectedSubSection.verse.chapterNumber}?mode=scroll&topic=${selectedSubSection.id}`}
                className="pressable w-full sm:flex-1 min-h-[48px] rounded-2xl border border-[var(--line)] bg-[var(--canvas-1)] px-5 py-3 text-center text-sm font-bold text-[var(--ink)] hover:border-[var(--gold)]/60 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span>📖 Read Full Chapter</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
