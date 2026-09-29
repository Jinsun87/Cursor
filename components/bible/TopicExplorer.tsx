"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import {
  BIBLE_TOPICS,
  TOPIC_CATEGORIES,
  type BibleTopic,
  type TopicSubSection,
  type TopicVerse,
} from "@/lib/bible/topics";
import { getChapter } from "@/lib/bible/catalog";
import { triggerHaptic } from "@/lib/haptics";

export function TopicExplorer() {
  const [selectedTopic, setSelectedTopic] = useState<BibleTopic | null>(null);
  const [selectedSubSection, setSelectedSubSection] = useState<TopicSubSection | null>(null);
  const [verseSearchQuery, setVerseSearchQuery] = useState("");
  const [expandedVerseIdx, setExpandedVerseIdx] = useState<number | null>(0);
  const [playingVerseRef, setPlayingVerseRef] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"chapter" | "topic">("topic");

  const subTopicsRef = useRef<HTMLDivElement | null>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Pre-select first topic (Anger) on mount so sub-topics are immediately discoverable
  useEffect(() => {
    if (!selectedTopic) {
      const defaultTopic = BIBLE_TOPICS.find((t) => t.id === "anger") || BIBLE_TOPICS[0];
      setSelectedTopic(defaultTopic);
    }
  }, [selectedTopic]);

  // Clean up audio on unmount or sub-section switch
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [selectedSubSection]);

  function handleSelectTopic(topic: BibleTopic) {
    triggerHaptic("selection");
    setSelectedTopic(topic);
    setSelectedSubSection(null);

    // Scroll down to the sub-topics card smoothly as requested
    setTimeout(() => {
      subTopicsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  }

  function handleSelectSubSection(sub: TopicSubSection) {
    triggerHaptic("selection");
    setSelectedSubSection(sub);
    setExpandedVerseIdx(0);
    setVerseSearchQuery("");
    stopAudio();
    // Scroll to top of view
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBackToTopics() {
    triggerHaptic("light");
    stopAudio();
    setSelectedSubSection(null);
    setTimeout(() => {
      subTopicsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  }

  function stopAudio() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setPlayingVerseRef(null);
  }

  function togglePlayVerse(verse: TopicVerse) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (playingVerseRef === verse.reference) {
      stopAudio();
      return;
    }

    stopAudio();
    triggerHaptic("selection");
    setPlayingVerseRef(verse.reference);

    const textToSpeak = `${verse.reference}. ${verse.verseSnippet}. Practical takeaway: ${verse.thematicTakeaway}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.88;
    utterance.pitch = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const naturalVoice =
      voices.find((v) => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Male") || v.name.includes("Daniel"))) ||
      voices.find((v) => v.lang.startsWith("en")) ||
      null;

    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onend = () => {
      setPlayingVerseRef(null);
    };

    utterance.onerror = () => {
      setPlayingVerseRef(null);
    };

    speechUtteranceRef.current = utterance;
    window.speechSynthesis.resume();
    window.speechSynthesis.speak(utterance);
  }

  // Resolve verses list for the active sub-section (either sub.verses array or fallback to sub.verse)
  const currentVerses = useMemo(() => {
    if (!selectedSubSection) return [];
    if (selectedSubSection.verses && selectedSubSection.verses.length > 0) {
      return selectedSubSection.verses;
    }
    return [
      {
        ...selectedSubSection.verse,
        categoryTag: selectedSubSection.verse.categoryTag || "Personal",
      },
    ];
  }, [selectedSubSection]);

  // Filtered verses based on inner search in Screen 2
  const filteredVerses = useMemo(() => {
    const q = verseSearchQuery.trim().toLowerCase();
    if (!q) return currentVerses;
    return currentVerses.filter(
      (v) =>
        v.reference.toLowerCase().includes(q) ||
        v.verseSnippet.toLowerCase().includes(q) ||
        v.thematicTakeaway.toLowerCase().includes(q) ||
        (v.categoryTag && v.categoryTag.toLowerCase().includes(q)),
    );
  }, [currentVerses, verseSearchQuery]);

  // =========================================================================
  // SCREEN 2: SUB-SUB-TOPICS (VERSE CARDS VIEW - Video Frames 00:02, 00:07)
  // =========================================================================
  if (selectedSubSection && selectedTopic) {
    return (
      <div className="w-full max-w-2xl mx-auto py-2 px-1 text-white animate-fade-in">
        {/* Top Header Bar with Back Button and Title */}
        <div className="flex items-center gap-3.5 border-b border-white/10 pb-4 mb-5">
          <button
            type="button"
            onClick={handleBackToTopics}
            aria-label="Back to topics list"
            className="pressable flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-xl font-bold text-white hover:bg-white/20 hover:border-pink-500/60 transition-all shadow-md active:scale-95"
          >
            ‹
          </button>
          <div className="min-w-0">
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-white tracking-tight truncate">
              {selectedSubSection.title}
            </h2>
            <p className="text-xs font-semibold text-pink-400 uppercase tracking-wider">
              {selectedTopic.label} · {selectedTopic.categoryLabel}
            </p>
          </div>
        </div>

        {/* Search Input for Scriptures (Matches Video Frame 00:02) */}
        <div className="relative mb-5">
          <input
            type="text"
            value={verseSearchQuery}
            onChange={(e) => setVerseSearchQuery(e.target.value)}
            placeholder="Search scriptures..."
            className="w-full rounded-2xl border border-white/20 bg-[#161726] px-11 py-3 text-sm text-white placeholder-white/50 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 transition-all shadow-inner"
          />
          <span className="absolute left-4 top-3.5 text-base text-white/50">🔍</span>
          <span className="absolute right-4 top-3.5 text-sm text-white/50">⚙️</span>
        </div>

        {/* List of Scripture Verse Cards (Matches Video Frames 00:02, 00:03, 00:12) */}
        <div className="space-y-3.5">
          {filteredVerses.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#161726] p-6 text-center text-white/70">
              No verses matching &ldquo;{verseSearchQuery}&rdquo; in this sub-topic.
            </div>
          ) : (
            filteredVerses.map((verse, idx) => {
              const isExpanded = expandedVerseIdx === idx;
              const isPlayingThisVerse = playingVerseRef === verse.reference;
              const tagLabel = verse.categoryTag || (idx % 2 === 0 ? "Personal" : "Social");
              const isChapterInCurriculum = Boolean(getChapter(verse.bookSlug, verse.chapterNumber));

              return (
                <div
                  key={verse.reference + idx}
                  className={`rounded-2xl border transition-all duration-200 shadow-lg overflow-hidden ${
                    isExpanded
                      ? "border-pink-500/50 bg-[#181928] ring-1 ring-pink-500/30"
                      : "border-white/15 bg-[#141523] hover:border-white/30"
                  }`}
                >
                  {/* Card Header (Click to toggle expansion) */}
                  <div
                    onClick={() => {
                      triggerHaptic("selection");
                      setExpandedVerseIdx(isExpanded ? null : idx);
                    }}
                    className="flex items-center justify-between p-4 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pink-500/15 text-pink-400 text-lg">
                        📜
                      </span>
                      <span className="font-display text-base sm:text-lg font-bold text-white tracking-wide">
                        {verse.reference}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="rounded-lg border border-pink-500/30 bg-pink-500/10 px-2.5 py-0.5 text-xs font-bold text-pink-300">
                        {tagLabel}
                      </span>
                      <span
                        className={`text-sm text-white/50 transition-transform duration-200 font-bold ${
                          isExpanded ? "rotate-90 text-pink-400" : ""
                        }`}
                      >
                        ›
                      </span>
                    </div>
                  </div>

                  {/* Expanded Card Body */}
                  {isExpanded && (
                    <div className="border-t border-white/10 px-5 pt-3 pb-5 animate-fade-in">
                      {/* Exact Scripture Quote Text */}
                      <blockquote className="font-serif text-base sm:text-lg leading-relaxed text-slate-100 italic my-2">
                        &ldquo;{verse.verseSnippet}&rdquo;
                      </blockquote>

                      {/* Practical Connection / Takeaway */}
                      <div className="mt-3.5 rounded-xl border border-white/10 bg-white/5 p-3.5">
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                          💡 <strong className="text-pink-400 font-semibold">Practical Connection:</strong>{" "}
                          {verse.thematicTakeaway}
                        </p>
                      </div>

                      {/* Action Buttons (Matches Video View Shloka & Play Shloka) */}
                      <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center gap-3">
                        {isChapterInCurriculum ? (
                          <Link
                            href={`/read/${verse.bookSlug}/${verse.chapterNumber}?mode=daily`}
                            className="pressable rounded-xl border border-pink-500/40 bg-pink-500/15 hover:bg-pink-500/25 text-pink-300 font-bold px-4 py-2.5 text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all"
                          >
                            <span>📖</span>
                            <span>View Passage</span>
                          </Link>
                        ) : (
                          <Link
                            href="/read/genesis/1"
                            className="pressable rounded-xl border border-pink-500/40 bg-pink-500/15 hover:bg-pink-500/25 text-pink-300 font-bold px-4 py-2.5 text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all"
                          >
                            <span>📖</span>
                            <span>View Full Bible</span>
                          </Link>
                        )}

                        <button
                          type="button"
                          onClick={() => togglePlayVerse(verse)}
                          className={`pressable rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md transition-all active:scale-95 ${
                            isPlayingThisVerse
                              ? "bg-amber-500 text-black animate-pulse"
                              : "bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white hover:brightness-110"
                          }`}
                        >
                          <span>{isPlayingThisVerse ? "⏸" : "▶"}</span>
                          <span>{isPlayingThisVerse ? "Pause Audio" : "Play Audio"}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // SCREEN 1: CATEGORIES & SUB-TOPICS LIST (Matches Video Frame 00:00)
  // =========================================================================
  return (
    <div className="w-full max-w-4xl mx-auto py-2 text-white">
      {/* Top Toggle Tabs: [ By Chapter ] and [ By Topic ] (Matches Video Frame 00:00) */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <button
          type="button"
          onClick={() => {
            triggerHaptic("light");
            setActiveTab("chapter");
            window.location.href = "/read#bible-canon";
          }}
          className={`pressable flex items-center gap-2 rounded-2xl border px-6 py-2.5 text-sm sm:text-base font-semibold transition-all ${
            activeTab === "chapter"
              ? "border-pink-500 bg-pink-500 text-white shadow-lg shadow-pink-500/20"
              : "border-white/15 bg-white/5 text-white/70 hover:text-white hover:border-white/30"
          }`}
        >
          <span>📖</span>
          <span>By Chapter</span>
        </button>

        <button
          type="button"
          onClick={() => {
            triggerHaptic("selection");
            setActiveTab("topic");
          }}
          className={`pressable flex items-center gap-2 rounded-2xl px-6 py-2.5 text-sm sm:text-base font-bold transition-all ${
            activeTab === "topic"
              ? "bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white shadow-xl shadow-pink-500/25 ring-2 ring-pink-500/40"
              : "border border-white/15 bg-white/5 text-white/70 hover:text-white"
          }`}
        >
          <span>🏷️</span>
          <span>By Topic</span>
        </button>
      </div>

      {/* Categories Cards List (Matches Video Frames 00:00, 00:04, 00:08, 00:16, 00:21) */}
      <div className="space-y-6">
        {TOPIC_CATEGORIES.map((cat) => {
          const categoryTopics = BIBLE_TOPICS.filter((t) => t.category === cat.id);

          return (
            <div
              key={cat.id}
              className="rounded-3xl border border-white/10 bg-[#12131f] p-5 sm:p-7 shadow-xl"
            >
              {/* Category Header with Yellow Dot (Matches Video Frame 00:00) */}
              <div className="flex items-center gap-2.5 mb-4">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/60" />
                <h3 className="font-display text-lg sm:text-xl font-extrabold text-white tracking-tight">
                  {cat.label}
                </h3>
              </div>

              {/* Topic Pills with Chevrons > (Matches Video Frames) */}
              <div className="flex flex-wrap gap-2.5">
                {categoryTopics.map((topic) => {
                  const isSelected = selectedTopic?.id === topic.id;

                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => handleSelectTopic(topic)}
                      className={`pressable inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm sm:text-base font-semibold transition-all min-h-[44px] ${
                        isSelected
                          ? "border-pink-500 bg-pink-500/20 text-pink-300 ring-2 ring-pink-500/40 shadow-lg shadow-pink-500/20"
                          : "border-white/15 bg-[#1b1c2b] text-white hover:border-pink-500/50 hover:bg-white/10"
                      }`}
                    >
                      <span className="text-white font-medium">{topic.label}</span>
                      <span className="text-xs text-white/50 font-bold">›</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* SUB-TOPICS SECTION (Matches Video Bottom Panel 00:00, 00:05, 00:10, 00:18) */}
      {/* ========================================================================= */}
      {selectedTopic && (
        <div
          ref={subTopicsRef}
          className="mt-8 rounded-3xl border border-pink-500/40 bg-[#161726] p-6 sm:p-8 shadow-2xl animate-fade-in scroll-mt-6"
        >
          {/* Sub-Topics Header */}
          <div className="text-center mb-6">
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {selectedTopic.label}
            </h3>
            <p className="text-xs font-bold uppercase tracking-widest text-pink-400 mt-1">
              {selectedTopic.categoryLabel}
            </p>
          </div>

          {/* Sub-Topics Cards List with Practical Connection (Matches Video Frames 00:00, 00:10) */}
          <div className="space-y-3">
            {selectedTopic.subSections.map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => handleSelectSubSection(sub)}
                className="pressable w-full flex items-center justify-between rounded-2xl border border-white/15 bg-[#1f2033] px-5 py-4 text-left hover:border-pink-500/70 hover:bg-pink-500/10 transition-all group shadow-sm min-h-[56px] active:scale-[0.99]"
              >
                <span className="font-bold text-white text-base sm:text-lg group-hover:text-pink-300 transition-colors">
                  {sub.title}
                </span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-pink-400 group-hover:bg-pink-500 group-hover:text-white transition-all text-sm font-bold">
                  →
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
