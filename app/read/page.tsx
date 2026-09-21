"use client";

import Link from "next/link";
import Image from "next/image";
import { BOOKS, CHAPTERS, READING_PLANS } from "@/lib/bible/catalog";
import { useReadingTracker } from "@/lib/bible/reading-store";
import { useApp } from "@/lib/store";

export default function ReadSanctuaryPage() {
  const { user } = useApp();
  const { progress } = useReadingTracker();

  const featuredChapter = CHAPTERS[0]; // Genesis 1

  return (
    <div className="mx-auto max-w-5xl">
      {/* Hero / Daily Story Spotlight */}
      <div className="relative mb-12 overflow-hidden rounded-3xl border border-[var(--gold)]/30 bg-gradient-to-br from-black via-[var(--canvas-2)] to-black p-8 sm:p-12 shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-[var(--gold)]/40 bg-[var(--gold)]/15 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--gold)]">
              Daily Illuminated Scripture
            </span>
            {progress.streakDays > 0 ? (
              <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-medium text-orange-400">
                🔥 {progress.streakDays} Day Reading Streak
              </span>
            ) : null}
          </div>

          <h1 className="mt-4 font-display text-4xl sm:text-5xl font-bold tracking-tight text-white">
            The Illuminated Sanctuary
          </h1>
          <p className="mt-3 text-base sm:text-lg text-parchment/80 leading-relaxed">
            Experience Scripture through museum-grade classical art, Hebrew and Greek linguistic insights, WhatsApp-style story reels, and active recall check-ins.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href={`/read/${featuredChapter.bookSlug}/${featuredChapter.chapterNumber}?mode=story`}
              className="btn btn-primary inline-flex items-center gap-2 text-sm shadow-lg"
            >
              <span>⚡ Watch Today&apos;s Story</span>
              <span className="text-xs opacity-75">(Genesis 1)</span>
            </Link>
            <Link
              href={`/read/${featuredChapter.bookSlug}/${featuredChapter.chapterNumber}?mode=scroll`}
              className="btn btn-secondary inline-flex items-center gap-2 text-sm"
            >
              <span>📜 Read Full Chapter</span>
            </Link>
          </div>
        </div>

        {/* Ambient Artwork Watermark */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 -z-0 opacity-25 overflow-hidden pointer-events-none hidden md:block">
          <Image
            src={featuredChapter.artworkUrl}
            alt="Genesis Creation"
            fill
            className="object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--canvas-2)] to-transparent" />
        </div>
      </div>

      {/* Reading Journeys / Guided Plans */}
      <section className="mb-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Guided Reading Journeys
            </h2>
            <p className="text-xs sm:text-sm text-[var(--muted)]">
              Curated multi-day journeys combining visual stories with memory check-ins.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {READING_PLANS.map((plan) => (
            <div
              key={plan.slug}
              className="group relative flex flex-col justify-between rounded-3xl border border-[var(--line)] bg-[var(--canvas-2)] p-6 sm:p-8 transition-all hover:border-[var(--gold)]/50 hover:shadow-xl"
            >
              <div>
                <span className="rounded-full bg-[var(--gold)]/10 px-3 py-1 text-xs font-semibold text-[var(--gold)]">
                  {plan.badge} · {plan.days} Days
                </span>
                <h3 className="mt-3 font-display text-2xl font-bold text-white group-hover:text-[var(--gold)] transition-colors">
                  {plan.title}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-[var(--gold)]/80 font-medium">
                  {plan.subtitle}
                </p>
                <p className="mt-2 text-sm text-parchment/75 leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[var(--line)] pt-4">
                <span className="text-xs text-[var(--muted)]">
                  {plan.chapters.length} Illuminated Chapters
                </span>
                <Link
                  href={`/read/${plan.chapters[0].bookSlug}/${plan.chapters[0].chapterNumber}`}
                  className="text-xs font-semibold text-[var(--gold)] hover:underline"
                >
                  Start Journey →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Landmark Chapters Directory */}
      <section>
        <div className="mb-6">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Landmark Illuminated Chapters
          </h2>
          <p className="text-xs sm:text-sm text-[var(--muted)]">
            Explore pivotal biblical events with classical artwork, WordSparks, and active recall.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CHAPTERS.map((ch) => {
            const isCompleted = progress.completedChapters.includes(
              `${ch.bookSlug}-${ch.chapterNumber}`,
            );
            const isStoryWatched = progress.completedStories.includes(
              `${ch.bookSlug}-${ch.chapterNumber}`,
            );

            return (
              <div
                key={`${ch.bookSlug}-${ch.chapterNumber}`}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--canvas-2)] transition-all hover:border-[var(--gold)]/40 hover:shadow-lg"
              >
                {/* Artwork Thumbnail */}
                <div className="relative h-44 w-full overflow-hidden">
                  <Image
                    src={ch.artworkUrl}
                    alt={ch.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-semibold text-white">
                    <span className="rounded-md bg-black/60 px-2 py-0.5 backdrop-blur-md">
                      {ch.bookTitle} {ch.chapterNumber}
                    </span>
                    {isCompleted ? (
                      <span className="rounded-md bg-emerald-500/80 px-2 py-0.5 text-white">
                        ✓ Read
                      </span>
                    ) : isStoryWatched ? (
                      <span className="rounded-md bg-[var(--gold)]/80 px-2 py-0.5 text-black">
                        ⚡ Story Done
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-display text-xl font-bold text-white">
                      {ch.title}
                    </h3>
                    <p className="mt-1 text-xs text-parchment/70 line-clamp-2">
                      {ch.subtitle}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-[var(--line)] pt-3 text-xs">
                    <Link
                      href={`/read/${ch.bookSlug}/${ch.chapterNumber}?mode=story`}
                      className="inline-flex items-center gap-1 font-semibold text-[var(--gold)] hover:brightness-125"
                    >
                      <span>⚡ Story</span>
                    </Link>
                    <Link
                      href={`/read/${ch.bookSlug}/${ch.chapterNumber}?mode=scroll`}
                      className="text-[var(--muted)] hover:text-white"
                    >
                      📜 Full Text →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
