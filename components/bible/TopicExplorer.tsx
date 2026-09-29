"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  BIBLE_TOPICS,
  TOPIC_CATEGORIES,
  type BibleTopic,
  type TopicSubSection,
  type TopicCategoryId,
} from "@/lib/bible/topics";
import { getChapter } from "@/lib/bible/catalog";
import { triggerHaptic } from "@/lib/haptics";
import { PastoralAudioBanner } from "./PastoralAudioBanner";

export function TopicExplorer() {
  const [activeCategory, setActiveCategory] = useState<TopicCategoryId | "all">("all");
  const [selectedTopic, setSelectedTopic] = useState<BibleTopic | null>(null);
  const [selectedSubSection, setSelectedSubSection] = useState<TopicSubSection | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedVerse, setCopiedVerse] = useState(false);

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

  async function handleCopyVerse(text: string, ref: string) {
    triggerHaptic("medium");
    try {
      await navigator.clipboard.writeText(`"${text}" — ${ref} (Lampstand Bible)`);
      setCopiedVerse(true);
      setTimeout(() => setCopiedVerse(false), 2200);
    } catch {
      // fallback
    }
  }

  // Filter topics based on active category & search query
  const filteredTopics = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return BIBLE_TOPICS.filter((topic) => {
      // Category filter
      if (activeCategory !== "all" && topic.category !== activeCategory) {
        return false;
      }
      // If no search query, match category
      if (!q) return true;

      // Search match across topic label, summary, sub-sections, verses, and references
      if (topic.label.toLowerCase().includes(q)) return true;
      if (topic.summary.toLowerCase().includes(q)) return true;
      if (topic.categoryLabel.toLowerCase().includes(q)) return true;

      return topic.subSections.some(
        (sub) =>
          sub.title.toLowerCase().includes(q) ||
          sub.tag.toLowerCase().includes(q) ||
          sub.verse.reference.toLowerCase().includes(q) ||
          sub.verse.thematicTakeaway.toLowerCase().includes(q) ||
          sub.verse.verseSnippet.toLowerCase().includes(q),
      );
    });
  }, [activeCategory, searchQuery]);

  // Counts by category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: BIBLE_TOPICS.length };
    for (const cat of TOPIC_CATEGORIES) {
      counts[cat.id] = BIBLE_TOPICS.filter((t) => t.category === cat.id).length;
    }
    return counts;
  }, []);

  return (
    <div className="w-full">
      {/* Category Quick-Filter Tabs */}
      <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-[var(--line)] pb-5">
        <button
          type="button"
          onClick={() => {
            triggerHaptic("selection");
            setActiveCategory("all");
          }}
          className={`pressable inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
            activeCategory === "all"
              ? "bg-[var(--gold)] text-black shadow-lg shadow-[var(--gold)]/20"
              : "border border-[var(--line)] bg-[var(--canvas-1)] text-[var(--muted)] hover:border-[var(--gold)]/60 hover:text-[var(--ink)]"
          }`}
        >
          <span>✨</span>
          <span>All Topics</span>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
              activeCategory === "all"
                ? "bg-black/20 text-black"
                : "bg-black/5 dark:bg-white/10 text-[var(--muted)]"
            }`}
          >
            {categoryCounts.all}
          </span>
        </button>

        {TOPIC_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                triggerHaptic("selection");
                setActiveCategory(cat.id);
              }}
              className={`pressable inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                isActive
                  ? "bg-[var(--gold)] text-black shadow-lg shadow-[var(--gold)]/20"
                  : "border border-[var(--line)] bg-[var(--canvas-1)] text-[var(--muted)] hover:border-[var(--gold)]/60 hover:text-[var(--ink)]"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  isActive
                    ? "bg-black/20 text-black"
                    : "bg-black/5 dark:bg-white/10 text-[var(--muted)]"
                }`}
              >
                {categoryCounts[cat.id] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Input for Topics */}
      <div className="relative mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search life topics (e.g. anxiety, anger, grief, patience, 1 Peter 5:7)..."
          className="w-full rounded-2xl border border-[var(--line)] bg-[var(--canvas-1)] px-11 py-3.5 text-sm text-[var(--ink)] placeholder-[var(--muted)] focus:border-[var(--gold)] focus:outline-none transition-colors shadow-sm"
        />
        <span className="absolute left-4 top-3.5 text-base text-[var(--muted)]">🔍</span>
        {searchQuery ? (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-3.5 rounded-full bg-black/10 dark:bg-white/10 px-2 py-0.5 text-xs text-[var(--muted)] hover:text-[var(--ink)]"
          >
            Clear
          </button>
        ) : null}
      </div>

      {/* Search Result Feedback */}
      {searchQuery && (
        <div className="mb-4 flex items-center justify-between text-xs text-[var(--muted)] px-1">
          <span>
            Found <strong className="text-[var(--gold)]">{filteredTopics.length}</strong> topic
            {filteredTopics.length === 1 ? "" : "s"} matching &ldquo;{searchQuery}&rdquo;
          </span>
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="text-[var(--gold)] hover:underline"
          >
            Reset search
          </button>
        </div>
      )}

      {/* Topics Display: Grouped or Single Category */}
      {filteredTopics.length === 0 ? (
        <div className="rounded-3xl border border-[var(--line)] bg-[var(--canvas-1)] p-8 text-center">
          <span className="text-3xl">🕊️</span>
          <h4 className="font-display text-lg font-bold text-[var(--ink)] mt-2">
            No topics matched your search
          </h4>
          <p className="text-xs text-[var(--muted)] mt-1">
            Try searching for words like &ldquo;peace&rdquo;, &ldquo;fear&rdquo;, &ldquo;purpose&rdquo;, or &ldquo;Philippians&rdquo;.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
            }}
            className="pressable mt-4 rounded-xl bg-[var(--gold)] px-4 py-2 text-xs font-bold text-black"
          >
            Show All Topics
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {TOPIC_CATEGORIES.map((cat) => {
            if (activeCategory !== "all" && activeCategory !== cat.id) return null;
            const categoryTopics = filteredTopics.filter((t) => t.category === cat.id);
            if (categoryTopics.length === 0) return null;

            return (
              <div
                key={cat.id}
                className="rounded-3xl border border-[var(--line)] bg-[var(--canvas-2)] p-6 sm:p-7 shadow-xl"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{cat.icon}</span>
                    <h3 className="font-display text-lg sm:text-xl font-bold text-[var(--ink)] tracking-tight">
                      {cat.label}
                    </h3>
                  </div>
                  <span className="rounded-full bg-black/5 dark:bg-white/5 border border-[var(--line)] px-2.5 py-0.5 text-xs font-bold text-[var(--muted)]">
                    {categoryTopics.length} topics
                  </span>
                </div>

                {/* Topic Pills Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categoryTopics.map((topic) => {
                    const isSelected = selectedTopic?.id === topic.id;
                    const totalVerses = topic.subSections.length;
                    return (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => handleSelectTopic(topic)}
                        className={`pressable group flex items-center justify-between rounded-2xl border p-3.5 text-left transition-all ${
                          isSelected
                            ? "border-[var(--gold)] bg-[var(--gold)]/15 text-[var(--gold)] shadow-md"
                            : "border-[var(--line)] bg-[var(--canvas-1)] text-[var(--ink)] hover:border-[var(--gold)]/60 hover:bg-[var(--gold)]/5"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 pr-2">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 dark:bg-white/5 text-lg group-hover:scale-110 transition-transform">
                            {topic.icon}
                          </span>
                          <div className="min-w-0">
                            <h4 className="font-display text-sm font-bold truncate group-hover:text-[var(--gold)] transition-colors">
                              {topic.label}
                            </h4>
                            <p className="text-[11px] text-[var(--muted)] truncate">
                              {totalVerses} life {totalVerses === 1 ? "situation" : "situations"}
                            </p>
                          </div>
                        </div>
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/5 dark:bg-white/5 text-xs text-[var(--muted)] group-hover:bg-[var(--gold)] group-hover:text-black transition-all">
                          ›
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================= */}
      {/* DRAWER / BOTTOM SHEET: Sub-Sections List                   */}
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
              <p className="text-xs text-[var(--muted)] mt-1.5 max-w-md mx-auto leading-relaxed">
                {selectedTopic.summary}
              </p>
            </div>

            {/* Sub-Section Cards List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  Select Your Specific Situation:
                </p>
                <span className="text-[11px] text-[var(--gold)] font-bold">
                  {selectedTopic.subSections.length} scriptures
                </span>
              </div>

              {selectedTopic.subSections.map((sub, idx) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => handleSelectSubSection(sub)}
                  className="pressable group w-full flex items-center justify-between rounded-2xl border border-[var(--line)] bg-[var(--canvas-1)] p-4 text-left hover:border-[var(--gold)]/70 hover:bg-[var(--gold)]/5 transition-all shadow-sm"
                >
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--gold)]">
                        {idx + 1}. {sub.tag}
                      </span>
                      <span className="rounded-md bg-black/5 dark:bg-white/5 px-2 py-0.5 text-[10px] font-medium text-[var(--muted)]">
                        {sub.verse.reference}
                      </span>
                    </div>
                    <h4 className="font-display text-base font-bold text-[var(--ink)] group-hover:text-[var(--gold)] transition-colors mt-1">
                      {sub.title}
                    </h4>
                    <span className="text-xs text-[var(--muted)] mt-0.5 block truncate">
                      {sub.verse.thematicTakeaway}
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
      {/* DETAIL MODAL: Specific Verse, Anchor & Pastoral Counsel    */}
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
                className="pressable flex items-center gap-1.5 rounded-full bg-black/10 dark:bg-white/10 px-3.5 py-1.5 text-xs font-bold text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black transition-all"
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
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[var(--gold)]/15 border border-[var(--gold)]/30 px-2.5 py-0.5 text-xs font-bold uppercase text-[var(--gold)]">
                  {selectedSubSection.tag}
                </span>
                <span className="text-xs text-[var(--muted)] font-medium">
                  {selectedTopic.label} · {selectedTopic.categoryLabel}
                </span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-[var(--ink)] mt-2">
                {selectedSubSection.title}
              </h3>
            </div>

            {/* Scripture Verse Card */}
            <div className="mt-5 rounded-3xl border border-[var(--gold)]/40 bg-[var(--canvas-1)] p-6 shadow-inner">
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📜</span>
                  <span className="font-display text-base font-bold text-[var(--gold)]">
                    {selectedSubSection.verse.reference}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyVerse(
                        selectedSubSection.verse.verseSnippet,
                        selectedSubSection.verse.reference,
                      )
                    }
                    className="pressable rounded-lg border border-[var(--line)] bg-black/5 dark:bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-[var(--muted)] hover:text-[var(--gold)] hover:border-[var(--gold)] transition-colors"
                  >
                    {copiedVerse ? "✓ Copied" : "Copy Verse"}
                  </button>
                  <span className="rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
                    Scripture Anchor
                  </span>
                </div>
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

            {/* Actions to Readers */}
            <div className="mt-6 pt-4 border-t border-[var(--line)]">
              {(() => {
                const isChapterInCatalog = Boolean(
                  getChapter(
                    selectedSubSection.verse.bookSlug,
                    selectedSubSection.verse.chapterNumber,
                  ),
                );

                if (isChapterInCatalog) {
                  return (
                    <div className="flex flex-col sm:flex-row items-center gap-3">
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
                  );
                }

                return (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-[var(--line)] bg-[var(--canvas-1)] p-4">
                    <div className="text-xs text-[var(--muted)]">
                      <span className="font-semibold text-[var(--ink)]">Curated Topical Anchor</span>
                      <p className="mt-0.5">
                        Reflect on this counsel or explore the 30 Landmark Illuminated Chapters.
                      </p>
                    </div>
                    <Link
                      href="/read/genesis/1"
                      className="pressable shrink-0 rounded-xl bg-[var(--gold)] px-4 py-2 text-xs font-bold text-black hover:brightness-110 shadow-md transition-all"
                    >
                      Explore 30 Landmark Chapters →
                    </Link>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
