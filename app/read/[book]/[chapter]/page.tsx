import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CHAPTERS, getChapter } from "@/lib/bible/catalog";
import { BibleChapterClient } from "@/components/bible/BibleChapterClient";
import { BibleChapterSkeleton } from "@/components/bible/BibleChapterSkeleton";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return CHAPTERS.map((c) => ({
    book: c.bookSlug,
    chapter: String(c.chapterNumber),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { book, chapter: chapterParam } = await params;
  const chapter = getChapter(book.toLowerCase(), parseInt(chapterParam, 10));
  if (!chapter) return { title: "Chapter not found", robots: { index: false } };
  return pageMetadata({
    title: `${chapter.bookTitle} ${chapter.chapterNumber}: ${chapter.title}`,
    description: chapter.subtitle,
    // One canonical URL per chapter; ?mode=daily|scroll|story are views of it.
    path: `/read/${chapter.bookSlug}/${chapter.chapterNumber}`,
  });
}

interface PageProps {
  params: Promise<{
    book: string;
    chapter: string;
  }>;
}

export default async function BibleChapterPage({ params }: PageProps) {
  const resolvedParams = await params;
  const bookSlug = resolvedParams.book.toLowerCase();
  const chapterNumber = parseInt(resolvedParams.chapter, 10);

  const chapter = getChapter(bookSlug, chapterNumber);
  if (!chapter) {
    notFound();
  }

  return (
    <Suspense fallback={<BibleChapterSkeleton />}>
      <BibleChapterClient chapter={chapter} />
    </Suspense>
  );
}
