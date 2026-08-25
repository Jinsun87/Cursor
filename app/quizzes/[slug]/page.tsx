import { notFound } from "next/navigation";
import { getQuiz } from "@/lib/catalog";
import { QuizRunner } from "@/components/QuizRunner";
import Link from "next/link";

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
      <p className="text-xs uppercase tracking-widest text-pine-400">{quiz.category}</p>
      <h1 className="mt-2 font-display text-4xl">{quiz.title}</h1>
      <p className="mt-3 text-parchment/75">{quiz.blurb}</p>
      {quiz.expert ? (
        <p className="mt-2 text-sm text-gold-400">Written in the voice of {quiz.expert}.</p>
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
