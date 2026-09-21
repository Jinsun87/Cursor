import { VISIBLE_QUIZZES } from "@/lib/catalog";
import { QuizCard } from "@/components/QuizCard";
import Link from "next/link";

export default function QuizzesPage() {
  const bibleQuizzes = VISIBLE_QUIZZES;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--gold)]">
            Scripture Mastery
          </span>
          <h1 className="mt-1 font-display text-4xl text-white">Bible Quiz Desk</h1>
          <p className="mt-2 text-parchment/70 max-w-2xl">
            Original Scripture sittings testing narrative, theology, geography, and Greek/Hebrew text. Score 70%+ to earn Certificates of Mastery and bonus coins.
          </p>
        </div>

        <Link href="/read" className="btn btn-ghost text-sm shrink-0">
          📖 Switch to Bible Reader
        </Link>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {bibleQuizzes.map((q, idx) => (
          <QuizCard key={q.slug} quiz={q} featured={idx === 0} />
        ))}
      </div>
    </div>
  );
}
