"use client";

import { use, useEffect, useState } from "react";
import { notFound, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getChapter, getAdjacentChapters } from "@/lib/bible/catalog";
import { StoryReader } from "@/components/bible/StoryReader";
import { ScrollReader } from "@/components/bible/ScrollReader";
import { ModeToggle } from "@/components/bible/ModeToggle";
import { useReadingTracker } from "@/lib/bible/reading-store";
import { useApp } from "@/lib/store";

interface PageProps {
  params: Promise<{
    book: string;
    chapter: string;
  }>;
}

export default function BibleChapterPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();

  const bookSlug = resolvedParams.book.toLowerCase();
  const chapterNumber = parseInt(resolvedParams.chapter, 10);

  const chapter = getChapter(bookSlug, chapterNumber);
  if (!chapter) {
    notFound();
  }

  const { prev, next } = getAdjacentChapters(bookSlug, chapterNumber);
  const prevUrl = prev ? `/read/${prev.bookSlug}/${prev.chapterNumber}` : undefined;
  const nextUrl = next ? `/read/${next.bookSlug}/${next.chapterNumber}` : undefined;

  const { recordChapterCompletion, recordStoryCompletion, prefs, updatePrefs } =
    useReadingTracker();
  const { user } = useApp();

  // Mode defaults to URL search param ?mode=story | scroll, or user pref
  const modeQuery = searchParams.get("mode");
  const [mode, setMode] = useState<"story" | "scroll">(
    modeQuery === "scroll" || modeQuery === "story"
      ? modeQuery
      : prefs.preferredMode || "story",
  );

  useEffect(() => {
    if (modeQuery === "scroll" || modeQuery === "story") {
      setMode(modeQuery);
    }
  }, [modeQuery]);

  function handleModeChange(newMode: "story" | "scroll") {
    setMode(newMode);
    updatePrefs({ preferredMode: newMode });
  }

  function handleStoryComplete(chapterKey: string) {
    return recordStoryCompletion(chapterKey, 25, chapter?.dayNumber);
  }

  function handleChapterComplete(chapterKey: string) {
    return recordChapterCompletion(chapterKey, 50, chapter?.dayNumber);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      {/* Top Header Navigation Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] pb-4">
        <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
          <Link href="/read" className="hover:text-[var(--gold)] transition-colors">
            Course Hub
          </Link>
          <span>/</span>
          {chapter.dayNumber ? (
            <>
              <span className="rounded-md bg-[var(--gold)]/10 px-2 py-0.5 text-xs font-bold text-[var(--gold)] border border-[var(--gold)]/20">
                Day {chapter.dayNumber} of 30
              </span>
              <span>·</span>
            </>
          ) : null}
          <span className="font-semibold text-[var(--ink)]">
            {chapter.bookTitle} {chapter.chapterNumber}
          </span>
        </div>

        <ModeToggle mode={mode} onChange={handleModeChange} />
      </div>

      {/* Reader Body based on active mode */}
      {mode === "story" ? (
        <StoryReader
          chapter={chapter}
          onSwitchToScroll={() => handleModeChange("scroll")}
          onStoryComplete={handleStoryComplete}
          nextChapterUrl={nextUrl ? `${nextUrl}?mode=story` : undefined}
        />
      ) : (
        <ScrollReader
          chapter={chapter}
          onSwitchToStory={() => handleModeChange("story")}
          onChapterComplete={handleChapterComplete}
          prevChapterUrl={prevUrl ? `${prevUrl}?mode=scroll` : undefined}
          nextChapterUrl={nextUrl ? `${nextUrl}?mode=scroll` : undefined}
          prefs={prefs}
          onUpdatePrefs={updatePrefs}
        />
      )}
    </div>
  );
}
