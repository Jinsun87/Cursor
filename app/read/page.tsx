"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CHAPTERS, READING_PLANS } from "@/lib/bible/catalog";
import { useReadingTracker } from "@/lib/bible/reading-store";
import { useApp } from "@/lib/store";

export default function ReadSanctuaryPage() {
  const { user } = useApp();
  const { progress } = useReadingTracker();
  const [selectedArc, setSelectedArc] = useState<string>("all");

  const anchorsPlan = READING_PLANS[0]; // Anchors of Scripture (30 Days)
  const currentDay = progress.currentCourseDay || 1;
  const featuredChapter = CHAPTERS.find((c) => c.dayNumber === currentDay) || CHAPTERS[0];

  const completedDaysCount = progress.completedCourseDays?.length || 0;
  const completionPercent = Math.round((completedDaysCount / 30) * 100);

  const filteredChapters =
    selectedArc === "all"
      ? CHAPTERS
      : CHAPTERS.filter((c) => c.arcName?.toLowerCase().includes(selectedArc.toLowerCase()));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Hero / Course Spotlight */}
      <div className="relative mb-12 overflow-hidden rounded-3xl border border-[var(--gold)]/30 bg-[var(--canvas-2)] p-8 sm:p-12 shadow-2xl glass-sanctuary">
        <div className="relative z-10 max-w-2xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-[var(--gold)]/40 bg-[var(--gold)]/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
              Flagship 30-Day Course
            </span>
            {progress.streakDays > 0 ? (
              <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-semibold text-orange-400">
                🔥 {progress.streakDays} Day Reading Streak
              </span>
            ) : null}
            <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-400">
              {completedDaysCount}/30 Days Completed ({completionPercent}%)
            </span>
          </div>

          <h1 className="mt-4 font-display text-4xl sm:text-5xl font-bold tracking-tight text-[var(--ink)]">
            Anchors of Scripture
          </h1>
          <p className="mt-3 text-base sm:text-lg text-[var(--muted)] leading-relaxed">
            A 30-day illuminated journey through Scripture’s greatest landmark events. Experience museum-grade
            classical art, Hebrew & Greek root WordSparks, vertical visual reels, and active recall.
          </p>

          {/* Current Day Callout */}
          <div className="mt-6 rounded-2xl border border-[var(--line)] bg-[var(--canvas)]/80 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs text-[var(--muted)]">
              <span className="font-semibold text-[var(--gold)]">TODAY’S READING · DAY {featuredChapter.dayNumber}</span>
              <span>{featuredChapter.bookTitle} {featuredChapter.chapterNumber}</span>
            </div>
            <p className="mt-1 font-display text-xl font-bold text-[var(--ink)]">
              {featuredChapter.title}
            </p>
            <p className="mt-0.5 text-xs text-[var(--muted)] line-clamp-1">
              {featuredChapter.subtitle}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3.5">
            <Link
              href={`/read/${featuredChapter.bookSlug}/${featuredChapter.chapterNumber}?mode=story`}
              className="w-full sm:w-auto min-h-[52px] px-6 py-3.5 rounded-2xl bg-[var(--gold)] text-black text-base font-bold hover:brightness-110 shadow-lg shadow-[var(--gold)]/20 transition-all flex items-center justify-center gap-2"
            >
              <span>⚡ Watch Today&apos;s Story</span>
              <span className="text-xs font-semibold bg-black/15 px-2 py-0.5 rounded-full">Day {featuredChapter.dayNumber}</span>
            </Link>
            <Link
              href={`/read/${featuredChapter.bookSlug}/${featuredChapter.chapterNumber}?mode=scroll`}
              className="w-full sm:w-auto min-h-[52px] px-6 py-3.5 rounded-2xl border border-[var(--line)] bg-[var(--canvas)] text-base font-semibold text-[var(--ink)] hover:border-[var(--gold)]/50 transition-all flex items-center justify-center gap-2"
            >
              <span>📜 Read Full Chapter</span>
            </Link>
          </div>
        </div>

        {/* Ambient Artwork Watermark */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 -z-0 opacity-25 overflow-hidden pointer-events-none hidden md:block">
          <Image
            src={featuredChapter.artworkUrl}
            alt={featuredChapter.title}
            fill
            className="object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--canvas-2)] via-[var(--canvas-2)]/60 to-transparent" />
        </div>
      </div>

      {/* Course Roadmap Arcs & Weekly Filter */}
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
            <button
              type="button"
              onClick={() => setSelectedArc("all")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all min-h-[42px] ${
                selectedArc === "all"
                  ? "bg-[var(--gold)] text-black font-bold shadow-md"
                  : "text-[var(--muted)] hover:text-[var(--ink)]"
              }`}
            >
              All 30 Days
            </button>
            <button
              type="button"
              onClick={() => setSelectedArc("Week 1")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all min-h-[42px] ${
                selectedArc === "Week 1"
                  ? "bg-[var(--gold)] text-black font-bold shadow-md"
                  : "text-[var(--muted)] hover:text-[var(--ink)]"
              }`}
            >
              Wk 1: Covenants
            </button>
            <button
              type="button"
              onClick={() => setSelectedArc("Week 2")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all min-h-[42px] ${
                selectedArc === "Week 2"
                  ? "bg-[var(--gold)] text-black font-bold shadow-md"
                  : "text-[var(--muted)] hover:text-[var(--ink)]"
              }`}
            >
              Wk 2: Kingdom
            </button>
            <button
              type="button"
              onClick={() => setSelectedArc("Week 3")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all min-h-[42px] ${
                selectedArc === "Week 3"
                  ? "bg-[var(--gold)] text-black font-bold shadow-md"
                  : "text-[var(--muted)] hover:text-[var(--ink)]"
              }`}
            >
              Wk 3: Gospels
            </button>
            <button
              type="button"
              onClick={() => setSelectedArc("Week 4")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all min-h-[42px] ${
                selectedArc === "Week 4"
                  ? "bg-[var(--gold)] text-black font-bold shadow-md"
                  : "text-[var(--muted)] hover:text-[var(--ink)]"
              }`}
            >
              Wk 4: Church & Glory
            </button>
          </div>
        </div>

        {/* 30-Day Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredChapters.map((ch) => {
            const isCompleted = progress.completedChapters.includes(
              `${ch.bookSlug}-${ch.chapterNumber}`,
            );
            const isStoryWatched = progress.completedStories.includes(
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
                    ) : isStoryWatched ? (
                      <span className="rounded-md bg-[var(--gold)]/90 px-2 py-0.5 text-black">
                        ⚡ Story Watched
                      </span>
                    ) : isCurrent ? (
                      <span className="rounded-md bg-[var(--gold)] px-2 py-0.5 text-[var(--gold-ink)] font-bold animate-pulse">
                        Next Up
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

                  {/* Actions: Chunky Touch Targets */}
                  <div className="mt-5 grid grid-cols-2 gap-2.5 border-t border-[var(--line)] pt-4">
                    <Link
                      href={`/read/${ch.bookSlug}/${ch.chapterNumber}?mode=story`}
                      className="min-h-[46px] rounded-xl bg-[var(--gold)] px-3 py-2 text-xs sm:text-sm font-bold text-black hover:brightness-110 shadow-sm transition-all flex items-center justify-center gap-1.5 text-center tactile-tap"
                    >
                      <span>⚡ Watch Story</span>
                    </Link>
                    <Link
                      href={`/read/${ch.bookSlug}/${ch.chapterNumber}?mode=scroll`}
                      className="min-h-[46px] rounded-xl border border-[var(--line)] bg-[var(--canvas-1)] px-3 py-2 text-xs sm:text-sm font-semibold text-[var(--ink)] hover:border-[var(--gold)]/50 hover:bg-black/5 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-1.5 text-center tactile-tap"
                    >
                      <span>📜 Read Chapter</span>
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
                  href={`/read/${plan.chapters[0].bookSlug}/${plan.chapters[0].chapterNumber}`}
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
