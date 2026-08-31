import { notFound } from "next/navigation";
import { getCategory, quizzesInCategory, seriesInCategory } from "@/lib/catalog";
import { QuizCard } from "@/components/QuizCard";
import Link from "next/link";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const quizzes = quizzesInCategory(slug);
  const series = seriesInCategory(slug);

  return (
    <div>
      <h1 className="font-display text-4xl">{category.name} quizzes</h1>
      <p className="mt-3 max-w-2xl text-parchment/75">{category.description}</p>
      {category.expert ? (
        <p className="mt-2 text-sm text-gold-400">Featuring work styled after {category.expert}.</p>
      ) : null}

      {series.length ? (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {series.map((s) => (
            <Link
              key={s.slug}
              href={`/series/${s.slug}`}
              className="rounded-2xl border border-gold-500/30 p-6"
            >
              <p className="text-xs uppercase tracking-widest text-gold-400">Quiz pack</p>
              <h2 className="mt-1 font-display text-2xl">{s.title}</h2>
              <p className="mt-2 text-sm text-parchment/70">{s.description}</p>
            </Link>
          ))}
        </div>
      ) : null}

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {quizzes.length ? (
          quizzes.map((q) => <QuizCard key={q.slug} quiz={q} />)
        ) : (
          <p className="text-parchment/70">Packs for this topic are still being forged. Try another category.</p>
        )}
      </div>
    </div>
  );
}
