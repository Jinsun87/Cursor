"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";
import { chaptersFundedPerMember } from "@/lib/founding";

/**
 * After checkout: thanks, what Pro gives them (Walk, Sleep, no ads), and a
 * straight path back to listening. Founding members get their own words.
 */
export function WelcomeContent() {
  const { user } = useApp();
  const founding = user?.premiumPlan === "lifetime";

  const benefits = founding
    ? [
        ["Pro for life", "One payment, nothing to renew or cancel, ever."],
        ["Everything new, forever", "Every book, voice and sound as it is recorded, starting with Genesis."],
        ["No ads anywhere", "Not while you listen, and not in the quizzes either."],
        ["Premium quizzes", "The Quiet Room's secret quizzes, ad-free, plus 5,000 coins for lifelines."],
      ]
    : [
        ["Every Walk and Sleep chapter", "Each book as it is recorded, read briskly by day and softly by night."],
        ["No ads anywhere", "Not while you listen, and not in the quizzes either."],
        ["Premium quizzes", "The Quiet Room's secret quizzes, ad-free, plus 5,000 coins for lifelines."],
        ["Your 7 days are free", "Cancel any time from your profile before the trial ends and you pay nothing."],
      ];

  return (
    <>
      <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-[var(--ink)] sm:text-5xl">
        {founding ? "Welcome, founding member" : "Welcome to Lampstand Pro"}
      </h1>
      <p className="mt-4 text-base leading-relaxed text-[var(--muted)] sm:text-lg">
        {founding
          ? `Thank you. Your one payment funds about ${chaptersFundedPerMember()} chapters of Scripture, read aloud and painted, and Pro is yours for life.`
          : "Thank you for joining. Every chapter, by day and by night, with no ads in the way."}
      </p>

      <ul className="mt-10 grid gap-3 rounded-3xl border border-[var(--line)] bg-[var(--canvas-2)]/60 p-6 text-left">
        {benefits.map(([title, note]) => (
          <li key={title} className="flex gap-3">
            <span
              aria-hidden="true"
              className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[var(--gold)]/15 text-sm text-[var(--gold)]"
            >
              ✓
            </span>
            <span>
              <strong className="block text-[var(--ink)]">{title}</strong>
              <span className="text-sm text-[var(--muted)]">{note}</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        <Link href="/?tab=sleep" className="btn btn-primary min-h-12 rounded-2xl px-6 py-3 text-center font-semibold">
          Listen tonight
        </Link>
        <Link
          href="/?tab=walk"
          className="min-h-12 rounded-2xl border border-[var(--line-strong)] bg-[var(--canvas-2)] px-6 py-3 text-center font-medium text-[var(--ink)] transition-all hover:border-[var(--gold)] hover:text-[var(--gold)]"
        >
          Walk with it today
        </Link>
      </div>

      <p className="mt-8 text-xs text-[var(--muted)]">
        Paddle has emailed your receipt.{" "}
        {founding ? "There is nothing to renew or cancel." : "You can manage or cancel any time from your profile."}{" "}
        <Link href="/open" className="text-[var(--gold)] underline underline-offset-4">
          See what your support pays for
        </Link>
      </p>
    </>
  );
}
