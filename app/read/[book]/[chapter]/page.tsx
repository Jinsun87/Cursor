import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CHAPTERS, getChapter } from "@/lib/bible/catalog";
import { BibleChapterClient } from "@/components/bible/BibleChapterClient";
import { BibleChapterSkeleton } from "@/components/bible/BibleChapterSkeleton";

export function generateStaticParams() {
  return CHAPTERS.map((c) => ({
    book: c.bookSlug,
    chapter: String(c.chapterNumber),
  }));
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
