"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { EBook, EBookChapter } from "@/lib/ebooks/types";
import { trackEvent } from "@/lib/analytics";

export function EbookReader({
  ebook,
  initialUnlocked = false,
}: {
  ebook: EBook;
  initialUnlocked?: boolean;
}) {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [savedFactIds, setSavedFactIds] = useState<number[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(initialUnlocked);
  const [unlockEmail, setUnlockEmail] = useState("");
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  // Check localStorage for unlock status on client mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`lampstand_unlocked_${ebook.slug}`);
      if (stored === "true" || initialUnlocked) {
        setIsUnlocked(true);
      }
    }
  }, [ebook.slug, initialUnlocked]);

  const activeChapter: EBookChapter = ebook.chapters[activeChapterIndex] || ebook.chapters[0];

  const filteredFacts = useMemo(() => {
    if (!searchQuery.trim()) return activeChapter.facts;
    const query = searchQuery.toLowerCase();
    return activeChapter.facts.filter(
      (f) =>
        f.title.toLowerCase().includes(query) ||
        f.fact.toLowerCase().includes(query) ||
        f.explanation.toLowerCase().includes(query) ||
        f.biblicalReference.toLowerCase().includes(query),
    );
  }, [activeChapter, searchQuery]);

  const visibleFacts = useMemo(() => {
    if (isUnlocked) return filteredFacts;
    return filteredFacts.slice(0, 5);
  }, [filteredFacts, isUnlocked]);

  const totalFactsCount = useMemo(() => {
    return ebook.chapters.reduce((acc, ch) => acc + ch.facts.length, 0);
  }, [ebook]);

  function toggleSaveFact(id: number) {
    setSavedFactIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }

  function handleUnlockSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!unlockEmail.trim() || !unlockEmail.includes("@")) return;

    if (typeof window !== "undefined") {
      localStorage.setItem(`lampstand_unlocked_${ebook.slug}`, "true");
    }
    setIsUnlocked(true);
    setShowUnlockModal(false);

    trackEvent("ebook_claim", {
      ebook_slug: ebook.slug,
      source: "reader_preview",
      email: unlockEmail,
    });
  }

  function handlePrint() {
    if (!isUnlocked) {
      setShowUnlockModal(true);
      return;
    }
    if (typeof window !== "undefined") {
      window.print();
    }
  }

  function handleChapterClick(idx: number) {
    if (idx > 0 && !isUnlocked) {
      setShowUnlockModal(true);
      return;
    }
    setActiveChapterIndex(idx);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--fg-main)]">
      {/* Top sticky navigation bar */}
      <header className="sticky top-0 z-30 border-b border-[var(--border-subtle)] bg-[var(--bg-card)]/95 backdrop-blur px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/ebooks"
              className="rounded-lg border border-[var(--border-subtle)] px-3 py-1.5 text-xs font-semibold hover:bg-[var(--bg-hover)]"
            >
              ← All eBooks
            </Link>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold truncate max-w-xs md:max-w-md">{ebook.title}</h1>
              <p className="text-xs text-emerald-500 font-medium">
                Chapter {activeChapter.number} of {ebook.chapters.length}: {activeChapter.title}
                {!isUnlocked && " (5-Fact Teaser Preview)"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isUnlocked ? (
              <button
                onClick={() => setShowUnlockModal(true)}
                className="rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-extrabold text-slate-950 shadow-sm hover:bg-amber-400 transition-colors animate-pulse"
              >
                🔓 Unlock 100 Facts & PDF Free
              </button>
            ) : (
              <button
                onClick={handlePrint}
                className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 transition-colors"
              >
                🖨️ Print / Save PDF
              </button>
            )}

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg border border-[var(--border-subtle)] px-3 py-1.5 text-xs font-semibold hover:bg-[var(--bg-hover)] md:hidden"
            >
              📖 Contents
            </button>
          </div>
        </div>

        {/* Reading progress bar */}
        <div className="mt-2 h-1 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{
              width: isUnlocked
                ? `${((activeChapterIndex + 1) / ebook.chapters.length) * 100}%`
                : "5%",
            }}
          />
        </div>
      </header>

      {/* Main Layout */}
      <div className="mx-auto max-w-6xl px-4 py-6 md:py-8 flex gap-8 relative">
        {/* Sidebar / Table of Contents */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 bg-[var(--bg-card)] p-5 border-r border-[var(--border-subtle)] shadow-xl transition-transform md:static md:z-0 md:w-64 md:shadow-none md:border-r-0 md:bg-transparent md:p-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)] md:hidden">
            <h2 className="font-bold text-sm">Table of Contents</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-xs px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded"
            >
              Close
            </button>
          </div>

          <div className="sticky top-24 space-y-6 pt-4 md:pt-0">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-500">
                  Digital Edition • {totalFactsCount} Facts
                </span>
                {!isUnlocked && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Preview
                  </span>
                )}
              </div>
              <h3 className="text-lg font-extrabold mt-1">{ebook.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{ebook.subtitle}</p>
            </div>

            <nav className="space-y-1">
              {ebook.chapters.map((ch, idx) => {
                const isActive = idx === activeChapterIndex;
                const isLocked = idx > 0 && !isUnlocked;
                return (
                  <button
                    key={ch.id}
                    onClick={() => handleChapterClick(idx)}
                    className={`w-full text-left p-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-between ${
                      isActive
                        ? "bg-emerald-600 text-white shadow"
                        : isLocked
                        ? "opacity-60 hover:opacity-100 hover:bg-[var(--bg-hover)] text-slate-400"
                        : "hover:bg-[var(--bg-hover)] text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      {isLocked ? "🔒" : `${ch.number}.`} {ch.title}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded shrink-0 ${
                        isActive ? "bg-emerald-700 text-white" : "bg-slate-200 dark:bg-slate-800"
                      }`}
                    >
                      {!isUnlocked && idx === 0 ? "5/20" : ch.facts.length}
                    </span>
                  </button>
                );
              })}
            </nav>

            {!isUnlocked && (
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs space-y-2">
                <p className="font-extrabold text-amber-400">
                  🔒 5-Fact Teaser Preview
                </p>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Enter your email or score 70%+ on any quiz to unlock all 100 Facts & PDF Export ($29 value)!
                </p>
                <button
                  onClick={() => setShowUnlockModal(true)}
                  className="w-full rounded-lg bg-amber-500 py-1.5 font-bold text-slate-950 text-[11px] hover:bg-amber-400 transition-colors"
                >
                  Unlock All 100 Facts Free →
                </button>
              </div>
            )}

            {savedFactIds.length > 0 && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs">
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  ⭐ Bookmarked Facts ({savedFactIds.length})
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                  You have saved {savedFactIds.length} key facts for quick review.
                </p>
              </div>
            )}
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {/* Chapter Header Card */}
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 md:p-8 shadow-sm mb-8 overflow-hidden relative">
            <div className="relative z-10">
              <span className="inline-block rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Chapter {activeChapter.number} of {ebook.chapters.length}
                {!isUnlocked && " • 5-Fact Teaser Preview"}
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-3">
                {activeChapter.title}
              </h2>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                {activeChapter.subtitle}
              </p>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-4 leading-relaxed max-w-3xl">
                {activeChapter.description}
              </p>
            </div>

            {/* Chapter Illustration */}
            {activeChapter.image && (
              <div className="mt-6 rounded-xl overflow-hidden relative h-48 md:h-64 w-full border border-[var(--border-subtle)]">
                <Image
                  src={activeChapter.image}
                  alt={activeChapter.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          {/* Search / Filter within Chapter */}
          <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <input
              type="text"
              placeholder={`Search in Chapter ${activeChapter.number}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-72 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3.5 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <span className="text-xs text-slate-500 font-medium self-end sm:self-center">
              Showing {visibleFacts.length} of {activeChapter.facts.length} facts {!isUnlocked && "(Preview)"}
            </span>
          </div>

          {/* Facts List */}
          <div className="space-y-6">
            {visibleFacts.map((fact) => {
              const isSaved = savedFactIds.includes(fact.id);
              return (
                <article
                  key={fact.id}
                  id={`fact-${fact.id}`}
                  className={`group rounded-xl border p-5 md:p-6 transition-all shadow-sm ${
                    isSaved
                      ? "border-amber-500/40 bg-amber-500/5 dark:bg-amber-500/10"
                      : "border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-emerald-500/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold text-white shadow-xs">
                        {fact.id}
                      </span>
                      <span className="rounded bg-slate-200 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                        {fact.biblicalReference}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleSaveFact(fact.id)}
                      className="text-xs px-2.5 py-1 rounded-md border border-[var(--border-subtle)] hover:bg-[var(--bg-hover)] transition-colors flex items-center gap-1 font-medium"
                      title="Save Fact"
                    >
                      {isSaved ? "⭐ Saved" : "☆ Save"}
                    </button>
                  </div>

                  <h3 className="text-base md:text-lg font-bold text-[var(--fg-main)] group-hover:text-emerald-500 transition-colors">
                    {fact.title}
                  </h3>

                  <p className="mt-2 text-xs md:text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20 leading-relaxed">
                    💡 {fact.fact}
                  </p>

                  <p className="mt-3 text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {fact.explanation}
                  </p>
                </article>
              );
            })}
          </div>

          {/* Locked End-of-Preview Card */}
          {!isUnlocked && (
            <div className="mt-8 rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 p-6 md:p-8 text-white shadow-2xl text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-40 h-40 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10 max-w-lg mx-auto">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-2xl mb-3 border border-amber-500/30">
                  🔒
                </div>
                <h3 className="text-xl md:text-2xl font-black text-amber-200">
                  End of Free 5-Fact Teaser Preview
                </h3>
                <p className="mt-2 text-xs md:text-sm text-slate-300 leading-relaxed">
                  You have reached the end of the 5-fact teaser preview. Unlock all 5 chapters ({totalFactsCount} illustrated facts) and printable PDF export ($29 value) completely <strong>FREE</strong>!
                </p>

                <form onSubmit={handleUnlockSubmit} className="mt-5 flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    placeholder="Enter email to unlock all 100 facts & PDF..."
                    value={unlockEmail}
                    onChange={(e) => setUnlockEmail(e.target.value)}
                    required
                    className="flex-1 rounded-xl border border-amber-400/30 bg-slate-950 px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-extrabold text-slate-950 shadow-lg hover:bg-amber-400 transition-colors whitespace-nowrap"
                  >
                    Unlock All 100 Facts Free →
                  </button>
                </form>

                <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-center gap-2">
                  <span>Or score 70%+ on any quiz</span>
                  <span>•</span>
                  <Link href="/quizzes/open-the-book" className="text-amber-400 hover:underline font-bold">
                    Take Flagship Quiz →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Chapter Bottom Pagination */}
          <div className="mt-10 pt-6 border-t border-[var(--border-subtle)] flex items-center justify-between">
            {activeChapterIndex > 0 ? (
              <button
                onClick={() => handleChapterClick(activeChapterIndex - 1)}
                className="rounded-lg border border-[var(--border-subtle)] px-4 py-2 text-xs font-bold hover:bg-[var(--bg-hover)]"
              >
                ← Previous Chapter
              </button>
            ) : (
              <div />
            )}

            {activeChapterIndex < ebook.chapters.length - 1 ? (
              <button
                onClick={() => handleChapterClick(activeChapterIndex + 1)}
                className="rounded-lg bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-500 shadow flex items-center gap-1"
              >
                {!isUnlocked && activeChapterIndex === 0 ? "🔒 Unlock Next Chapter →" : "Next Chapter →"}
              </button>
            ) : (
              <div className="text-xs font-bold text-emerald-500">
                🎉 You have completed all {totalFactsCount} facts!
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Unlock Modal */}
      {showUnlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-amber-500/40 bg-slate-900 p-6 md:p-8 text-white shadow-2xl relative">
            <button
              onClick={() => setShowUnlockModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-sm"
            >
              ✕
            </button>

            <div className="text-center">
              <span className="text-4xl">🎁</span>
              <h3 className="text-xl md:text-2xl font-black text-amber-200 mt-2">
                Unlock Full eBook ($29 Value) FREE!
              </h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Get full access to all 5 chapters, 100 illustrated facts, and printable PDF export.
              </p>

              <form onSubmit={handleUnlockSubmit} className="mt-5 space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  value={unlockEmail}
                  onChange={(e) => setUnlockEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-amber-400/30 bg-slate-950 px-4 py-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <button
                  type="submit"
                  className="w-full rounded-xl bg-amber-500 py-3 text-xs font-bold text-slate-950 shadow-lg hover:bg-amber-400 transition-colors"
                >
                  Unlock 100 Facts & PDF Export →
                </button>
              </form>

              <p className="mt-4 text-[11px] text-slate-400">
                Or <Link href="/quizzes/open-the-book" onClick={() => setShowUnlockModal(false)} className="text-amber-400 underline font-bold">score 70%+ on Open the Book</Link> to unlock in-game!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
