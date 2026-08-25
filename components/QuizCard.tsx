import Link from "next/link";
import type { Quiz } from "@/lib/types";

export function QuizCard({ quiz }: { quiz: Quiz }) {
  return (
    <Link
      href={`/quizzes/${quiz.slug}`}
      className="group flex flex-col rounded-2xl border border-pine-700 bg-pine-900/50 p-5 hover:border-gold-400/60"
    >
      <p className="text-xs uppercase tracking-widest text-pine-400">
        {quiz.isSecret ? "Secret" : quiz.isReview ? "Review" : quiz.isDaily ? "Daily" : quiz.category}
      </p>
      <h3 className="mt-2 font-display text-xl group-hover:text-gold-400">{quiz.title}</h3>
      <p className="mt-2 flex-1 text-sm text-parchment/70">{quiz.blurb}</p>
      <p className="mt-4 text-xs text-gold-400">
        {quiz.questions.length} questions · {quiz.coinsOnComplete}+ coins
      </p>
    </Link>
  );
}
