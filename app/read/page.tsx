"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BOOKS, CHAPTERS, READING_PLANS } from "@/lib/bible/catalog";
import { useReadingTracker } from "@/lib/bible/reading-store";
import { useApp } from "@/lib/store";
import { TodayHabitHub } from "@/components/home/TodayHabitHub";

export default function ReadSanctuaryPage() {
  const { user } = useApp();
  const { progress } = useReadingTracker();

  // Tab states
  const [selectedArc, setSelectedArc] = useState<string>("all");
  const [bibleTestament, setBibleTestament] = useState<"OT" | "NT" | "DISCUSS">("OT");
  const [selectedTranslation, setSelectedTranslation] = useState<string>("NIV");
  const [publicNotesEnabled, setPublicNotesEnabled] = useState<boolean>(true);
  const [bibleSearchQuery, setBibleSearchQuery] = useState<string>("");

  const currentDay = progress.currentCourseDay || 1;

  const filteredChapters =
    selectedArc === "all"
      ? CHAPTERS
      : CHAPTERS.filter((c) => c.arcName?.toLowerCase().includes(selectedArc.toLowerCase()));

  // Filter books for Bible section
  const filteredBooks = BOOKS.filter((b) => {
    if (bibleTestament === "DISCUSS") return true;
    return b.testament === bibleTestament;
  }).filter((b) =>
    b.title.toLowerCase().includes(bibleSearchQuery.toLowerCase()) ||
    b.summary.toLowerCase().includes(bibleSearchQuery.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* ========================================================= */}
      {/* 1. DAILY WORSHIP RITUAL HUB (Unified with Home Page)       */}
      {/* ========================================================= */}
      <section className="mb-12">
        <TodayHabitHub showNavigationToRead={false} />
      </section>

      {/* ========================================================= */}
      {/* 2. FAITH ESSENTIALS TRACKS (Glorify Essentials)           */}
      {/* ========================================================= */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[var(--ink)]">
            Faith Essentials
          </h2>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
            Daily Companions
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              title: "Daily Walk With God",
              duration: "6 MIN",
              icon: "☀️",
              desc: "Step-by-step biblical perspective for navigating your workday.",
              tag: "PLUS",
            },
            {
              title: "Thought for the Day",
              duration: "2 MIN",
              icon: "☕",
              desc: "A quick mental calibration to anchor your focus in Christ.",
              tag: "PLUS",
            },
            {
              title: "Evening Psalms Meditation",
              duration: "10 MIN",
              icon: "🌙",
              desc: "Calm your nervous system and sleep in the secret place of God.",
              tag: "PLUS",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-2xl border border-[var(--line)] bg-[var(--canvas-2)] p-4 hover:border-[var(--gold)]/40 transition-all cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{item.icon}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--muted)]">{item.duration}</span>
                    <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-400 border border-indigo-500/30">
                      {item.tag}
                    </span>
                  </div>
                </div>
                <h3 className="mt-3 font-display text-base font-bold text-[var(--ink)] group-hover:text-[var(--gold)] transition-colors">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-[var(--muted)] leading-relaxed">{item.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-[var(--line)] flex items-center justify-between text-xs font-semibold text-[var(--gold)]">
                <span>Listen Track</span>
                <span>▶</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. BIBLE SECTION (Glorify OT / NT / Discuss Explorer)     */}
      {/* ========================================================= */}
      <section id="bible-canon" className="mb-14 rounded-3xl border border-[var(--line)] bg-[var(--canvas-2)] p-6 sm:p-8 scroll-mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--line)] pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--gold)] font-bold text-black text-sm">
              {user?.email ? user.email.slice(0, 1).toUpperCase() : "J"}
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-[var(--ink)]">
                Scripture Canon
              </h2>
              <p className="text-xs text-[var(--muted)]">Explore the books of the Old and New Testament</p>
            </div>
          </div>

          {/* Translation selector & Public Notes toggle */}
          <div className="flex items-center gap-3">
            <select
              value={selectedTranslation}
              onChange={(e) => setSelectedTranslation(e.target.value)}
              className="rounded-xl border border-[var(--line)] bg-[var(--canvas)] px-3 py-1.5 text-xs font-semibold text-[var(--ink)] focus:outline-none focus:border-[var(--gold)]"
            >
              <option value="NIV">NIV (New International)</option>
              <option value="ESV">ESV (English Standard)</option>
              <option value="KJV">KJV (King James)</option>
            </select>

            <button
              onClick={() => setPublicNotesEnabled((p) => !p)}
              className="flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--canvas)] px-3 py-1.5 text-xs font-medium text-[var(--ink)]"
            >
              <span>Public Notes</span>
              <span
                className={`inline-block h-3.5 w-7 rounded-full transition-colors relative ${
                  publicNotesEnabled ? "bg-[var(--gold)]" : "bg-neutral-600"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-2.5 w-2.5 rounded-full bg-white transition-transform ${
                    publicNotesEnabled ? "left-4" : "left-0.5"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        {/* OT / NT / DISCUSS Segmented Switcher & Search Bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="inline-flex rounded-2xl border border-[var(--line)] bg-[var(--canvas)] p-1 text-xs font-bold">
            {(["OT", "NT", "DISCUSS"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setBibleTestament(tab)}
                className={`rounded-xl px-5 py-2 transition-all ${
                  bibleTestament === tab
                    ? "bg-[var(--gold)] text-black shadow-md"
                    : "text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
              >
                {tab === "OT" ? "Old Testament" : tab === "NT" ? "New Testament" : "💬 Discussions"}
              </button>
            ))}
          </div>

          <div className="relative flex-1 max-w-xs">
            <input
              type="text"
              placeholder="Search bible books..."
              value={bibleSearchQuery}
              onChange={(e) => setBibleSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-[var(--line)] bg-[var(--canvas)] px-4 py-2 text-xs text-[var(--ink)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--gold)]"
            />
            {bibleSearchQuery ? (
              <button
                onClick={() => setBibleSearchQuery("")}
                className="absolute right-3 top-2 text-xs text-[var(--muted)] hover:text-[var(--ink)]"
              >
                ✕
              </button>
            ) : null}
          </div>
        </div>

        {/* Books List Grid with Avatars and Discussion Counters */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBooks.map((book) => {
            // Find if any chapters of this book are in our catalog
            const bookChapters = CHAPTERS.filter((c) => c.bookSlug === book.slug);
            const firstChapter = bookChapters[0] || { chapterNumber: 1 };
            const discussionTotal = book.discussionCount || (book.totalChapters * 18);

            return (
              <Link
                key={book.slug}
                href={`/read/${book.slug}/${firstChapter.chapterNumber}?mode=daily`}
                className="group flex flex-col justify-between rounded-2xl border border-[var(--line)] bg-[var(--canvas)] p-4 hover:border-[var(--gold)] hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-display text-lg font-bold text-[var(--ink)] group-hover:text-[var(--gold)] transition-colors">
                      {book.title}
                    </h4>
                    <span className="text-xs text-[var(--muted)]">
                      {book.totalChapters} {book.totalChapters === 1 ? "Chapter" : "Chapters"} · {book.testament}
                    </span>
                  </div>

                  {/* Social Avatars & Discussion Count (Glorify Style) */}
                  <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                    <div className="flex -space-x-1.5 overflow-hidden">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-700 text-[9px] font-bold text-white ring-1 ring-black">
                        {book.title.slice(0, 1)}
                      </span>
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-sky-700 text-[9px] font-bold text-white ring-1 ring-black">
                        D
                      </span>
                    </div>
                    <span className="font-semibold text-[var(--ink)] flex items-center gap-1">
                      <span>💬</span>
                      <span>{discussionTotal.toLocaleString()}</span>
                    </span>
                  </div>
                </div>

                <p className="mt-2 text-xs text-[var(--muted)] line-clamp-2 leading-relaxed">
                  {book.summary}
                </p>

                <div className="mt-4 pt-3 border-t border-[var(--line)] flex items-center justify-between text-xs font-semibold text-[var(--gold)]">
                  <span>Open Book</span>
                  <span>→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. THE 30-DAY COURSE ROADMAP                              */}
      {/* ========================================================= */}
      <section className="mb-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--ink)]">
              The 30-Day Course Roadmap
            </h2>
            <p className="text-sm text-[var(--muted)] mt-0.5">
              Four progressive narrative arcs bridging Creation to the New Jerusalem.
            </p>
          </div>

          {/* Arc Tabs */}
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[var(--line)] bg-[var(--canvas-2)] p-1.5 text-sm">
            {[
              { id: "all", label: "All 30 Days" },
              { id: "Week 1", label: "Wk 1: Covenants" },
              { id: "Week 2", label: "Wk 2: Kingdom" },
              { id: "Week 3", label: "Wk 3: Gospels" },
              { id: "Week 4", label: "Wk 4: Church" },
            ].map((arc) => (
              <button
                key={arc.id}
                type="button"
                onClick={() => setSelectedArc(arc.id)}
                className={`rounded-xl px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition-all ${
                  selectedArc === arc.id
                    ? "bg-[var(--gold)] text-black font-bold shadow-md"
                    : "text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
              >
                {arc.label}
              </button>
            ))}
          </div>
        </div>

        {/* 30-Day Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredChapters.map((ch) => {
            const isCompleted = progress.completedChapters.includes(
              `${ch.bookSlug}-${ch.chapterNumber}`,
            );
            const isDayFinished = progress.completedCourseDays?.includes(ch.dayNumber || 0);
            const isCurrent = ch.dayNumber === currentDay;

            return (
              <div
                key={`${ch.bookSlug}-${ch.chapterNumber}`}
                className={`group flex flex-col justify-between overflow-hidden rounded-2xl border transition-all ${
                  isCurrent
                    ? "border-[var(--gold)] bg-[var(--canvas-2)] shadow-xl ring-1 ring-[var(--gold)]/40"
                    : isDayFinished
                    ? "border-emerald-500/30 bg-[var(--canvas-2)]/80"
                    : "border-[var(--line)] bg-[var(--canvas-2)] hover:border-[var(--gold)]/40 hover:shadow-md"
                }`}
              >
                {/* Artwork Thumbnail */}
                <div className="relative h-44 w-full overflow-hidden">
                  <Image
                    src={ch.artworkUrl}
                    alt={ch.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />

                  {/* Top Day Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="rounded-lg bg-black/70 backdrop-blur-md px-2.5 py-1 text-xs font-bold text-[var(--gold)] border border-[var(--gold)]/30">
                      Day {ch.dayNumber}
                    </span>
                    {ch.dayNumber === 7 && (
                      <span className="rounded-lg bg-amber-500/80 px-2 py-0.5 text-xs font-bold text-black">
                        7-Day Milestone
                      </span>
                    )}
                    {ch.dayNumber === 30 && (
                      <span className="rounded-lg bg-[var(--gold)] px-2 py-0.5 text-xs font-bold text-[var(--gold-ink)]">
                        Certificate Finale
                      </span>
                    )}
                  </div>

                  {/* Bottom Completion Status */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-semibold text-white">
                    <span className="rounded-md bg-black/60 px-2 py-0.5 backdrop-blur-md">
                      {ch.bookTitle} {ch.chapterNumber}
                    </span>
                    {isDayFinished || isCompleted ? (
                      <span className="rounded-md bg-emerald-500/90 px-2 py-0.5 text-white flex items-center gap-1">
                        ✓ Completed
                      </span>
                    ) : isCurrent ? (
                      <span className="rounded-md bg-[var(--gold)] px-2 py-0.5 text-[var(--gold-ink)] font-bold animate-pulse">
                        Today&apos;s Walk
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
                      {ch.arcName?.split(":")[0]}
                    </span>
                    <h3 className="font-display text-xl font-bold text-[var(--ink)] leading-snug mt-1">
                      {ch.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-[var(--muted)] line-clamp-2 leading-relaxed">
                      {ch.subtitle}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 grid grid-cols-2 gap-2.5 border-t border-[var(--line)] pt-4">
                    <Link
                      href={`/read/${ch.bookSlug}/${ch.chapterNumber}?mode=daily`}
                      className="min-h-[46px] rounded-xl bg-[var(--gold)] px-3 py-2 text-xs sm:text-sm font-bold text-black hover:brightness-110 shadow-sm transition-all flex items-center justify-center gap-1.5 text-center"
                    >
                      <span>🕊️ Daily Walk</span>
                    </Link>
                    <Link
                      href={`/read/${ch.bookSlug}/${ch.chapterNumber}?mode=scroll`}
                      className="min-h-[46px] rounded-xl border border-[var(--line)] bg-[var(--canvas-1)] px-3 py-2 text-xs sm:text-sm font-semibold text-[var(--ink)] hover:border-[var(--gold)]/50 transition-all flex items-center justify-center gap-1.5 text-center"
                    >
                      <span>📜 Full Text</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Alternative Starter Plans */}
      <section className="mt-16 rounded-3xl border border-[var(--line)] bg-[var(--canvas-2)]/40 p-8">
        <h3 className="font-display text-xl font-bold text-[var(--ink)]">
          Short Starter Journeys
        </h3>
        <p className="text-xs sm:text-sm text-[var(--muted)] mb-6">
          Prefer a shorter sitting before the 30-day journey? Try these bite-sized paths.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {READING_PLANS.slice(1).map((plan) => (
            <div
              key={plan.slug}
              className="flex flex-col justify-between rounded-2xl border border-[var(--line)] bg-[var(--canvas-2)] p-5"
            >
              <div>
                <span className="rounded-full bg-[var(--gold)]/10 px-2.5 py-0.5 text-xs font-semibold text-[var(--gold)]">
                  {plan.badge} · {plan.days} Days
                </span>
                <h4 className="mt-2 font-display text-lg font-bold text-[var(--ink)]">{plan.title}</h4>
                <p className="mt-1 text-xs text-[var(--muted)]">{plan.description}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-[var(--line)] flex justify-end">
                <Link
                  href={`/read/${plan.chapters[0].bookSlug}/${plan.chapters[0].chapterNumber}?mode=daily`}
                  className="text-xs font-semibold text-[var(--gold)] hover:underline"
                >
                  Start Plan →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
