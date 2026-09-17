import Link from "next/link";
import type { Quiz } from "@/lib/types";
import { EbookRewardBanner } from "./EbookRewardBanner";

export function QuizCard({ quiz, featured = false }: { quiz: Quiz; featured?: boolean }) {
  const isEbookEligible = quiz.slug === "open-the-book" || featured;
  return (
    <Link
      href={`/quizzes/${quiz.slug}`}
      className={`lift group flex h-full flex-col rounded-2xl border bg-[var(--canvas-2)] p-5 md:col-span-2 ${
        featured ? "md:row-span-2 md:p-8" : ""
      }`}
      style={{ borderColor: "var(--line)" }}
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <p className="text-xs uppercase tracking-widest" style={{ color: "var(--muted)" }}>
          {quiz.isSecret ? "Secret" : quiz.isReview ? "Review" : quiz.isDaily ? "Daily" : quiz.category}
        </p>
        {isEbookEligible && <EbookRewardBanner compact />}
      </div>
      <h3 className={`mt-2 font-display ${featured ? "text-3xl" : "text-xl"}`}>{quiz.title}</h3>
      <p className="mt-2 flex-1 text-sm" style={{ color: "var(--muted)" }}>
        {quiz.blurb}
      </p>
      <p className="mt-4 text-xs" style={{ color: "var(--gold)" }}>
        {quiz.questions.length} questions · {quiz.coinsOnComplete}+ coins
      </p>
    </Link>
  );
}
