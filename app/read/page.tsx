"use client";

import { useApp } from "@/lib/store";
import { TopicExplorer } from "@/components/bible/TopicExplorer";

export default function ReadSanctuaryPage() {
  const { user } = useApp();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Header Banner */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--line)] pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--gold)] to-amber-600 font-bold text-black text-base shadow-md">
            {user?.email ? user.email.slice(0, 1).toUpperCase() : "✝"}
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--ink)] tracking-tight">
              Scripture &amp; Counsel
            </h1>
            <p className="text-xs sm:text-sm text-[var(--muted)]">
              Scripture for what you are facing: anxiety, grief, anger, loneliness and more
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--canvas-2)] px-3.5 py-1.5 text-xs text-[var(--muted)] font-medium">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Filter by Topic</span>
        </div>
      </div>

      {/* Scripture & Counsel Explorer */}
      <section id="scripture-counsel" className="rounded-3xl border border-[var(--line)] bg-[var(--canvas-2)] p-4 sm:p-7 shadow-sm">
        <TopicExplorer />
      </section>
    </div>
  );
}
