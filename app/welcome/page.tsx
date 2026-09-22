import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Welcome to Lampstand Pro — Know the text.",
  description: "Thank you for subscribing to Lampstand Pro. Your quiet study and mastery benefits are now active.",
};

export default function WelcomePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      {/* Illuminated Icon */}
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[var(--gold)]/40 bg-[var(--gold)]/10 text-[var(--gold)] shadow-xl shadow-[var(--gold)]/10">
        <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      </div>

      <div className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Subscription Confirmed
      </div>

      <h1 className="mt-4 font-display text-4xl sm:text-5xl font-bold text-[var(--ink)] tracking-tight">
        Welcome to Lampstand Pro
      </h1>

      <p className="mt-4 text-base sm:text-lg text-[var(--muted)] leading-relaxed">
        Thank you for supporting the Lampstand Scripture recall mission. Your account has been upgraded with full access to
        our quiet study room, mastery certificates, and an ad-free experience.
      </p>

      {/* Activated Perks Summary */}
      <div className="mt-10 rounded-3xl border border-[var(--line)] bg-[var(--canvas-2)]/60 p-6 text-left shadow-sm">
        <h2 className="font-display text-lg font-semibold text-[var(--ink)]">Your Pro Benefits:</h2>
        <ul className="mt-4 space-y-3 text-sm text-[var(--ink)]/85">
          <li className="flex items-center gap-3">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs">
              ✓
            </span>
            <span><strong>Quiet Room:</strong> Complete longform study and quizzes without any advertising interruptions.</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs">
              ✓
            </span>
            <span><strong>Certificates of Mastery:</strong> Earn accredited completion badges on all 50+ question review sittings.</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs">
              ✓
            </span>
            <span><strong>Pro Badge & Coin Grant:</strong> Special profile badge with 5,000 bonus coins credited for lifelines.</span>
          </li>
        </ul>
      </div>

      {/* Navigation Links */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/read"
          className="min-h-12 w-full sm:w-auto rounded-2xl btn btn-primary px-8 py-3 font-semibold shadow-lg shadow-[var(--gold)]/20 text-center"
        >
          Begin Reading Scripture
        </Link>
        <Link
          href="/secret"
          className="min-h-12 w-full sm:w-auto rounded-2xl border border-[var(--line-strong)] bg-[var(--canvas-2)] px-6 py-3 font-medium text-[var(--ink)] hover:border-[var(--gold)] hover:text-[var(--gold)] text-center transition-all"
        >
          Open Quiet Room
        </Link>
      </div>

      <p className="mt-8 text-xs text-[var(--muted)]">
        A receipt and invoice have been emailed to you directly by Paddle. You can manage or cancel your subscription at
        any time from your profile.
      </p>
    </div>
  );
}
