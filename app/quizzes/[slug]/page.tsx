import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QUIZZES, getQuiz } from "@/lib/catalog";
import { QuizRunner } from "@/components/QuizRunner";
import { EbookRewardBanner } from "@/components/EbookRewardBanner";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

// Pre-render every quiz at build time so landing pages are served from the CDN.
export function generateStaticParams() {
  return QUIZZES.map((quiz) => ({ slug: quiz.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const quiz = getQuiz((await params).slug);
  if (!quiz) return { title: "Quiz not found", robots: { index: false } };
  return pageMetadata({
    title: quiz.title,
    description: `${quiz.blurb} ${quiz.questions.length} questions, with a short fact after every answer.`,
    path: `/quizzes/${quiz.slug}`,
    // Secret quizzes are deliberately off the public catalog.
    noindex: quiz.isSecret,
  });
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const quiz = getQuiz(slug);
  if (!quiz) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-3">
        <EbookRewardBanner />
      </div>
      <p className="text-xs uppercase tracking-widest text-pine-400">{quiz.category}</p>
      <h1 className="mt-2 font-display text-3xl md:text-4xl leading-tight">{quiz.title}</h1>
      <p className="mt-3 text-parchment/75">{quiz.blurb}</p>
      {quiz.expert ? (
        <p className="mt-2 text-sm text-gold-400">Written in the voice of {quiz.expert}.</p>
      ) : null}
      {quiz.isLongform ? (
        <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
          {quiz.questions.length} questions split into narrative acts with rich story commentary.
        </p>
      ) : null}
      {quiz.seriesSlug ? (
        <Link href={`/series/${quiz.seriesSlug}`} className="mt-3 inline-block text-sm text-pine-400">
          Part of a mastery pack →
        </Link>
      ) : null}
      <div className="mt-8">
        <QuizRunner quiz={quiz} />
      </div>
    </div>
  );
}
