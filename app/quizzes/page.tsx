import { CATEGORIES, QUIZZES } from "@/lib/catalog";
import { QuizCard } from "@/components/QuizCard";
import Link from "next/link";

export default function QuizzesPage() {
  const popular = QUIZZES.filter((q) => !q.isSecret);

  return (
    <div>
      <h1 className="font-display text-4xl">Popular quizzes</h1>
      <p className="mt-2 text-parchment/70">
        Packs, reviews, and one-off challenges. Secret quizzes live on their own
        trail.
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            className="rounded-full border border-pine-600 px-3 py-1 text-sm hover:border-gold-400"
          >
            {c.name}
          </Link>
        ))}
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {popular.map((q) => (
          <QuizCard key={q.slug} quiz={q} />
        ))}
      </div>
    </div>
  );
}
