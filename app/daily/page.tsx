import { getDailyQuiz } from "@/lib/catalog";
import { QuizRunner } from "@/components/QuizRunner";
import Link from "next/link";

export default function DailyPage() {
  const quiz = getDailyQuiz();
  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-xs uppercase tracking-widest text-gold-400">Quiz of the day</p>
      <h1 className="mt-2 font-display text-4xl">{quiz.title}</h1>
      <p className="mt-3 text-parchment/75">{quiz.blurb}</p>
      <p className="mt-4 text-sm text-parchment/70">
        Rotates on UTC midnight.{" "}
        <Link href="/secret" className="text-gold-400">
          Try secret quizzes
        </Link>{" "}
        when you want something less public.
      </p>
      <div className="mt-8">
        <QuizRunner quiz={quiz} />
      </div>
      <section className="mt-12 text-sm text-parchment/75">
        <h2 className="font-display text-2xl text-parchment">How to play</h2>
        <p className="mt-3">
          Each quiz can stand alone, but the real product is the pack: about five
          subject quizzes plus a final review. Complete the pack and score 70% or
          better on the review to become a Master of that topic.
        </p>
      </section>
    </div>
  );
}
