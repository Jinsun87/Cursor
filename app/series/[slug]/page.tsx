"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { getQuiz, getSeries } from "@/lib/catalog";
import { useApp } from "@/lib/store";

export default function SeriesPage() {
  const params = useParams<{ slug: string }>();
  const series = getSeries(params.slug);
  const { seriesProgress, bestScore, user } = useApp();

  if (!series) {
    return <p>That pack does not exist.</p>;
  }

  const progress = seriesProgress(series.slug);
  const quizzes = series.quizSlugs.map((slug) => getQuiz(slug)!);
  const review = getQuiz(series.reviewSlug)!;

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-xs uppercase tracking-widest text-gold-400">Path to mastery</p>
      <h1 className="mt-2 font-display text-4xl">{series.title}</h1>
      <p className="mt-3 text-parchment/75">{series.description}</p>
      <p className="mt-4 text-sm">
        {progress.completed}/{progress.total} pack quizzes complete
        {progress.mastered ? " · Certificate earned" : ""}
      </p>
      <ol className="mt-8 space-y-3">
        {quizzes.map((q, i) => {
          const best = bestScore(q.slug);
          return (
            <li key={q.slug}>
              <Link
                href={`/quizzes/${q.slug}`}
                className="flex items-center justify-between rounded-2xl border border-pine-700 bg-pine-900/50 p-4 hover:border-gold-400/50"
              >
                <span>
                  <span className="text-pine-400">{i + 1}.</span> {q.title}
                </span>
                <span className="text-sm text-gold-400">
                  {best ? `${Math.round((best.score / best.total) * 100)}%` : "Take quiz"}
                </span>
              </Link>
            </li>
          );
        })}
        <li>
          {progress.canTakeReview ? (
            <Link
              href={`/quizzes/${review.slug}`}
              className="flex items-center justify-between rounded-2xl border border-gold-500/50 bg-gold-400/10 p-4"
            >
              <span>Certificate review · 70% to master</span>
              <span className="text-sm text-gold-400">
                {progress.reviewBest !== undefined ? `${progress.reviewBest}%` : "Start"}
              </span>
            </Link>
          ) : (
            <div className="rounded-2xl border border-dashed border-pine-600 p-4 text-parchment/60">
              Finish every pack quiz to unlock the review and Certificate of Mastery.
            </div>
          )}
        </li>
      </ol>
      {progress.mastered ? (
        <Link
          href={`/certificate/${series.slug}`}
          className="mt-6 inline-block rounded-full bg-gold-400 px-5 py-2 text-pine-950"
        >
          View certificate
        </Link>
      ) : null}
      {!user ? (
        <p className="mt-6 text-sm text-parchment/70">
          <Link href="/register" className="text-gold-400">
            Register
          </Link>{" "}
          to save this path.
        </p>
      ) : null}
    </div>
  );
}
