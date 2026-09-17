"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { EBook, EBookChapter } from "@/lib/ebooks/types";

export function EbookReader({ ebook }: { ebook: EBook }) {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [savedFactIds, setSavedFactIds] = useState<number[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const totalFactsCount = useMemo(() => {
    return ebook.chapters.reduce((acc, ch) => acc + ch.facts.length, 0);
  }, [ebook]);

  function toggleSaveFact(id: number) {
    setSavedFactIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }

  function handlePrint() {
    if (typeof window !== "undefined") {
      window.print();
    }
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
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg border border-[var(--border-subtle)] px-3 py-1.5 text-xs font-semibold hover:bg-[var(--bg-hover)] md:hidden"
            >
              📖 Contents
            </button>
            <button
              onClick={handlePrint}
              className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 transition-colors"
            >
              🖨️ Print / Save PDF
            </button>
          </div>
        </div>

        {/* Reading progress bar */}
        <div className="mt-2 h-1 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{
              width: `${((activeChapterIndex + 1) / ebook.chapters.length) * 100}%`,
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
              <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-500">
                Digital Edition • {totalFactsCount} Facts
              </span>
              <h3 className="text-lg font-extrabold mt-1">{ebook.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{ebook.subtitle}</p>
            </div>

            <nav className="space-y-1">
              {ebook.chapters.map((ch, idx) => {
                const isActive = idx === activeChapterIndex;
                return (
                  <button
                    key={ch.id}
                    onClick={() => {
                      setActiveChapterIndex(idx);
                      setSidebarOpen(false);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`w-text-left w-full text-left p-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-between ${
                      isActive
                        ? "bg-emerald-600 text-white shadow"
                        : "hover:bg-[var(--bg-hover)] text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span>
                      {ch.number}. {ch.title}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        isActive ? "bg-emerald-700 text-white" : "bg-slate-200 dark:bg-slate-800"
                      }`}
                    >
                      {ch.facts.length}
                    </span>
                  </button>
                );
              })}
            </nav>

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
              Showing {filteredFacts.length} of {activeChapter.facts.length} facts
            </span>
          </div>

          {/* Facts List */}
          <div className="space-y-6">
            {filteredFacts.map((fact) => {
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

          {/* Chapter Bottom Pagination */}
          <div className="mt-10 pt-6 border-t border-[var(--border-subtle)] flex items-center justify-between">
            {activeChapterIndex > 0 ? (
              <button
                onClick={() => {
                  setActiveChapterIndex((prev) => prev - 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="rounded-lg border border-[var(--border-subtle)] px-4 py-2 text-xs font-bold hover:bg-[var(--bg-hover)]"
              >
                ← Previous Chapter
              </button>
            ) : (
              <div />
            )}

            {activeChapterIndex < ebook.chapters.length - 1 ? (
              <button
                onClick={() => {
                  setActiveChapterIndex((prev) => prev + 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="rounded-lg bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-500 shadow"
              >
                Next Chapter →
              </button>
            ) : (
              <div className="text-xs font-bold text-emerald-500">
                🎉 You have completed all {totalFactsCount} facts!
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
