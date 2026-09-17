"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

export function EbookRewardCard({ quizTitle }: { quizTitle: string }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;

    if (typeof window !== "undefined") {
      localStorage.setItem("lampstand_unlocked_bible-foundations", "true");
    }

    trackEvent("ebook_claim", {
      ebook_slug: "bible-foundations",
      quiz_title: quizTitle,
      email,
    });
    setSubmitted(true);
  }

  return (
    <div className="my-6 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-40 h-40 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
        <div className="relative w-28 h-36 md:w-32 md:h-44 shrink-0 rounded-xl overflow-hidden shadow-2xl border-2 border-amber-400/40">
          <Image
            src="/images/ebooks/bible-foundations-cover.png"
            alt="Bible Foundations eBook Cover"
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1 text-center md:text-left">
          <span className="inline-block rounded-full bg-amber-400/20 px-3 py-1 text-[11px] font-extrabold text-amber-300 uppercase tracking-wider mb-2">
            🏆 Completion Gift Unlocked
          </span>

          <h3 className="text-xl md:text-2xl font-black text-amber-100">
            Bible Foundations: 100 Facts Every Reader Should Know
          </h3>

          <p className="mt-2 text-xs md:text-sm text-slate-300 leading-relaxed max-w-xl">
            Congratulations on finishing <strong>{quizTitle}</strong>! Claim your copy of the 100-fact illustrated eBook & digital reference guide.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="mt-4 flex flex-col sm:flex-row gap-2 max-w-md">
              <input
                type="email"
                placeholder="Enter your email to claim PDF & Read online..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 rounded-xl border border-amber-400/30 bg-slate-900/90 px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                type="submit"
                className="rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-lg hover:bg-amber-400 transition-colors whitespace-nowrap"
              >
                Claim Free eBook →
              </button>
            </form>
          ) : (
            <div className="mt-4 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs">
              <p className="font-bold text-sm">🎉 Your eBook is ready!</p>
              <p className="mt-1">We sent a copy to {email}. You can also read it right now online:</p>
              <div className="mt-3 flex gap-3">
                <Link
                  href="/ebooks/bible-foundations"
                  className="inline-block rounded-lg bg-emerald-600 px-4 py-2 font-bold text-white shadow hover:bg-emerald-500 text-xs"
                >
                  📖 Open eBook Reader Now
                </Link>
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center justify-center md:justify-start gap-4 text-[11px] text-slate-400">
            <span>✨ 100% Free</span>
            <span>•</span>
            <span>📱 Mobile & PDF Friendly</span>
            <span>•</span>
            <Link href="/ebooks/bible-foundations" className="text-amber-400 hover:underline">
              Instant Reader Preview
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
