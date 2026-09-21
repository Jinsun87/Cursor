"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { useReadingTracker, getTodayDateString } from "@/lib/bible/reading-store";

interface DailyActivity {
  id: string;
  title: string;
  subtitle: string;
  timeEstimate: string;
  icon: string;
  tag: string;
}

const DAILY_ACTIVITIES: DailyActivity[] = [
  {
    id: "quote",
    title: "Verse of the Day",
    subtitle: "“The light shines in the darkness, and the darkness has not overcome it.”",
    timeEstimate: "1 min",
    icon: "🕊️",
    tag: "John 1:5",
  },
  {
    id: "passage",
    title: "Today's Story: The First Light",
    subtitle: "Experience Genesis 1 in visual Story Mode.",
    timeEstimate: "2 min",
    icon: "📖",
    tag: "Genesis 1:1–5",
  },
  {
    id: "wordspark",
    title: "WordSpark: Bārā' (בָּרָא)",
    subtitle: "Hebrew: To shape or create out of nothing (ex nihilo).",
    timeEstimate: "30s",
    icon: "✨",
    tag: "Ancient Root",
  },
  {
    id: "trivia",
    title: "Daily Active Recall Check",
    subtitle: "What divine distinction was granted to humanity in Genesis 1?",
    timeEstimate: "1 min",
    icon: "🎯",
    tag: "Trivia +25 Coins",
  },
  {
    id: "prayer",
    title: "Sanctuary Daily Prayer",
    subtitle: "A 60-second guided contemplative prayer for peace and courage.",
    timeEstimate: "1 min",
    icon: "🕯️",
    tag: "Prayer",
  },
];

const DAYS_OF_WEEK = ["M", "T", "W", "T", "F", "S", "S"];

export function TodayHabitHub() {
  const { user } = useApp();
  const { progress } = useReadingTracker();

  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const [activeModal, setActiveModal] = useState<"quote" | "wordspark" | "trivia" | "prayer" | null>(null);

  // Trivia state
  const [triviaAnswer, setTriviaAnswer] = useState<number | null>(null);
  const [triviaFeedback, setTriviaFeedback] = useState<string | null>(null);

  // Prayer state
  const [prayerAmens, setPrayerAmens] = useState(3842);
  const [hasPrayed, setHasPrayed] = useState(false);

  // Quote copy state
  const [copiedQuote, setCopiedQuote] = useState(false);

  const todayStr = getTodayDateString();
  const storageKey = `lampstand_daily_ritual_${todayStr}`;

  // Load daily progress
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setCompletedItems(JSON.parse(saved));
      }
    } catch {
      // Fallback
    }
  }, [storageKey]);

  // Sync completion
  function markCompleted(id: string) {
    setCompletedItems((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, JSON.stringify(next));
      }
      return next;
    });
  }

  // Today's day of week (0 = Sunday, 1 = Monday)
  const currentDayIndex = (new Date().getDay() + 6) % 7; // Convert to M-S (0 = Mon, 6 = Sun)

  const streakCount = Math.max(progress.streakDays || 1, 1);
  const isAllComplete = completedItems.length >= DAILY_ACTIVITIES.length;

  function handleTriviaChoice(index: number) {
    setTriviaAnswer(index);
    if (index === 1) {
      setTriviaFeedback("Correct! Humanity alone bears the Imago Dei (Image of God). +25 Coins!");
      markCompleted("trivia");
    } else {
      setTriviaFeedback("Not quite. Genesis 1:26–27 reveals humanity was created in the Image of God.");
    }
  }

  function handlePrayAmen() {
    if (!hasPrayed) {
      setHasPrayed(true);
      setPrayerAmens((c) => c + 1);
      markCompleted("prayer");
    }
  }

  function handleCopyQuote() {
    const text = `“The light shines in the darkness, and the darkness has not overcome it.” — John 1:5 (via Lampstand)`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedQuote(true);
      setTimeout(() => setCopiedQuote(false), 2000);
      markCompleted("quote");
    }
  }

  return (
    <div className="w-full">
      {/* 1. Glorify-style Top Banner: Streak, Day Tracker & Lamp Flame */}
      <div className="rounded-3xl border border-[var(--line)] bg-gradient-to-b from-[#14120e] via-[#0d0f12] to-[#0a0a0a] p-5 sm:p-7 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--gold)]/40 bg-[var(--gold)]/10 text-xl font-bold text-[var(--gold)] shadow-inner">
              {user?.username ? user.username.charAt(0).toUpperCase() : "L"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[var(--gold)]">
                  <span className="animate-pulse">🔥</span> {streakCount} Day Streak
                </span>
                <span className="text-[var(--muted)] text-xs">·</span>
                <span className="text-xs text-parchment/70 font-medium">Keep the Lamp Burning</span>
              </div>
              <h1 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                Today&apos;s Sacred Rhythm
              </h1>
            </div>
          </div>

          <Link
            href="/pricing"
            className="flex items-center gap-1.5 rounded-full border border-[var(--gold)]/30 bg-[var(--gold)]/10 px-3.5 py-1.5 text-xs font-semibold text-[var(--gold)] hover:bg-[var(--gold)]/20 transition-all"
          >
            <span>👑</span>
            <span>Lampstand Plus</span>
          </Link>
        </div>

        {/* Weekly Day Circles (M T W T F S S) */}
        <div className="mt-6 flex items-center justify-between gap-1 border-t border-white/5 pt-4">
          {DAYS_OF_WEEK.map((day, idx) => {
            const isToday = idx === currentDayIndex;
            const isPast = idx < currentDayIndex;
            const isDone = isPast || (isToday && completedItems.length > 0);

            return (
              <div key={idx} className="flex flex-1 flex-col items-center gap-1.5">
                <span
                  className={`text-[11px] font-bold uppercase ${
                    isToday ? "text-[var(--gold)]" : "text-white/40"
                  }`}
                >
                  {day}
                </span>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all ${
                    isToday
                      ? "border-2 border-[var(--gold)] bg-[var(--gold)]/20 text-white shadow-[0_0_12px_var(--gold)]"
                      : isDone
                      ? "bg-white/15 text-parchment"
                      : "bg-white/5 text-white/30"
                  }`}
                >
                  {isDone ? "✓" : ""}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Bar & Status */}
        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-500"
              style={{ width: `${(completedItems.length / DAILY_ACTIVITIES.length) * 100}%` }}
            />
          </div>
          <span className="text-xs font-medium text-[var(--gold)] whitespace-nowrap">
            {completedItems.length} of {DAILY_ACTIVITIES.length} Done
          </span>
        </div>

        {isAllComplete ? (
          <div className="mt-4 flex items-center justify-between rounded-2xl border border-emerald-500/40 bg-emerald-950/40 px-4 py-2.5 text-xs text-emerald-300 animate-fade-in">
            <span className="font-semibold">✨ All Lamps Lit! Daily Liturgy Complete (+50 Coins)</span>
            <span className="text-base">🏆</span>
          </div>
        ) : null}
      </div>

      {/* 2. The Daily Activity Checklist (Glorify Style) */}
      <div className="mt-6 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)] px-1">
          Daily Devotional Rituals
        </h2>

        {DAILY_ACTIVITIES.map((activity) => {
          const isDone = completedItems.includes(activity.id);

          return (
            <div
              key={activity.id}
              onClick={() => {
                if (activity.id === "passage") {
                  markCompleted("passage");
                } else {
                  setActiveModal(activity.id as any);
                }
              }}
              className={`group flex cursor-pointer items-center justify-between gap-4 rounded-2xl border p-4 transition-all ${
                isDone
                  ? "border-emerald-500/30 bg-[#0d1511]/80 hover:border-emerald-500/50"
                  : "border-[var(--line)] bg-[var(--canvas-2)] hover:border-white/20 hover:bg-white/[0.03]"
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-lg">
                  {activity.icon}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-base font-semibold text-white tracking-tight truncate">
                      {activity.title}
                    </h3>
                    <span className="rounded-full bg-white/10 px-2 py-0.2 text-[10px] text-parchment/70 shrink-0">
                      {activity.tag}
                    </span>
                  </div>
                  <p className="text-xs text-parchment/70 truncate mt-0.5">
                    {activity.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[11px] text-[var(--muted)] hidden sm:inline">
                  {activity.timeEstimate}
                </span>

                {activity.id === "passage" ? (
                  <Link
                    href="/read/genesis/1"
                    onClick={(e) => {
                      e.stopPropagation();
                      markCompleted("passage");
                    }}
                    className="rounded-full bg-[var(--gold)]/20 px-3 py-1 text-xs font-semibold text-[var(--gold)] hover:bg-[var(--gold)]/30 transition-all"
                  >
                    Open Story
                  </Link>
                ) : (
                  <button
                    type="button"
                    aria-label={`Complete ${activity.title}`}
                    className={`flex h-7 w-7 items-center justify-center rounded-full border transition-all ${
                      isDone
                        ? "border-emerald-500 bg-emerald-500 text-black font-bold"
                        : "border-white/20 bg-white/5 text-transparent group-hover:border-white/40"
                    }`}
                  >
                    ✓
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Featured Story Card with Vibrant Art Preview */}
      <div className="mt-8 overflow-hidden rounded-3xl border border-[var(--line)] bg-gradient-to-r from-[#12100e] to-[#1a150d] p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="rounded-full bg-[var(--gold)]/20 px-3 py-1 text-xs font-semibold text-[var(--gold)] uppercase tracking-wider">
              Featured Illuminated Story
            </span>
            <h3 className="mt-3 font-display text-2xl sm:text-3xl font-bold text-white">
              Genesis 1: The First Light
            </h3>
            <p className="mt-2 text-sm text-parchment/80 leading-relaxed">
              Before stars burned or seas crashed, the Spirit of God moved upon the deep. Experience the creation narrative in the full-bleed Vibrant Frame story reader.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                href="/read/genesis/1"
                className="btn btn-primary"
                onClick={() => markCompleted("passage")}
              >
                ✨ Read Visual Story (2 min)
              </Link>
              <Link href="/read" className="btn btn-ghost">
                Browse All Books
              </Link>
            </div>
          </div>

          <div className="relative h-44 w-32 sm:h-56 sm:w-40 shrink-0 overflow-hidden rounded-2xl border border-[var(--gold)]/30 shadow-2xl">
            <Image
              src="/images/stories/genesis-1/s1.jpg"
              alt="Genesis 1 The First Light"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-semibold text-[var(--gold)]">
              9:16 Art
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: Verse of the Day */}
      {activeModal === "quote" ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl border border-[var(--gold)]/40 bg-[#0d0f12] p-6 sm:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-xs uppercase tracking-widest text-[var(--gold)] font-bold">
              Verse of the Day · John 1:5
            </span>
            <blockquote className="mt-4 font-display text-2xl sm:text-3xl leading-snug text-white">
              “The light shines in the darkness, and the darkness has not overcome it.”
            </blockquote>
            <p className="mt-3 text-sm text-parchment/70 leading-relaxed">
              No matter how dense or intimidating the shadows feel, darkness has no active power to extinguish light. A single candle pierces a cavern of shadows.
            </p>

            <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={handleCopyQuote}
                className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10 transition-all"
              >
                <span>📋</span>
                <span>{copiedQuote ? "Copied to Clipboard!" : "Copy & Share Verse"}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  markCompleted("quote");
                  setActiveModal(null);
                }}
                className="btn btn-primary text-xs py-2 px-5"
              >
                Mark Complete ✓
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* MODAL 2: WordSpark */}
      {activeModal === "wordspark" ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl border border-[var(--gold)]/40 bg-[#0d0f12] p-6 sm:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-xs uppercase tracking-widest text-[var(--gold)] font-bold">
              Hebrew WordSpark · Genesis 1:1
            </span>
            <div className="mt-3 flex items-baseline gap-3">
              <h3 className="text-3xl font-bold text-white">Bārā&apos;</h3>
              <span className="font-serif text-2xl text-[var(--gold)]" dir="rtl">
                בָּרָא
              </span>
            </div>
            <p className="mt-2 text-sm font-semibold text-amber-300">
              Literal Meaning: To create out of nothing (ex nihilo)
            </p>
            <p className="mt-3 text-sm text-parchment/80 leading-relaxed">
              In Hebrew scripture, the verb <em>bara</em> has only one subject: God. Human beings make, form, or craft from existing elements. Only God brings cosmos out of utter nothingness.
            </p>

            <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={() => {
                  markCompleted("wordspark");
                  setActiveModal(null);
                }}
                className="btn btn-primary text-xs py-2 px-5"
              >
                Understood & Done ✓
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* MODAL 3: Daily Active Recall Trivia */}
      {activeModal === "trivia" ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl border border-[var(--gold)]/40 bg-[#0d0f12] p-6 sm:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-xs uppercase tracking-widest text-[var(--gold)] font-bold">
              Daily Recall Question · +25 Coins
            </span>
            <h3 className="mt-3 font-display text-xl font-bold text-white leading-snug">
              In Genesis 1, what divine distinction was bestowed exclusively upon humanity?
            </h3>

            <div className="mt-4 space-y-2.5">
              {[
                "Immunity from physical death and toil",
                "Created in the Image of God (Imago Dei)",
                "Authority above the heavenly archangels",
              ].map((choice, i) => (
                <button
                  key={choice}
                  type="button"
                  onClick={() => handleTriviaChoice(i)}
                  className={`w-full rounded-2xl border p-3.5 text-left text-sm transition-all ${
                    triviaAnswer === i
                      ? i === 1
                        ? "border-emerald-500 bg-emerald-950/40 text-emerald-200 font-semibold"
                        : "border-rose-500 bg-rose-950/40 text-rose-200"
                      : "border-white/10 bg-white/5 text-parchment hover:border-white/30"
                  }`}
                >
                  <span className="mr-2 font-bold">{String.fromCharCode(65 + i)}.</span>
                  {choice}
                </button>
              ))}
            </div>

            {triviaFeedback ? (
              <p
                className={`mt-3 text-xs leading-relaxed ${
                  triviaAnswer === 1 ? "text-emerald-300" : "text-amber-300"
                }`}
              >
                {triviaFeedback}
              </p>
            ) : null}

            <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="btn btn-ghost text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* MODAL 4: Guided Daily Prayer */}
      {activeModal === "prayer" ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl border border-[var(--gold)]/40 bg-[#0d0f12] p-6 sm:p-8 shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-xs uppercase tracking-widest text-[var(--gold)] font-bold">
              Sanctuary Daily Prayer
            </span>
            <h3 className="mt-2 font-display text-2xl font-bold text-white">
              Prayer for Radiant Trust
            </h3>
            <blockquote className="mt-4 font-display text-lg text-parchment/90 leading-relaxed italic border-y border-white/10 py-4">
              “Lord of the Dawn, You spoke and light shattered the void. Shine into every quiet shadow of my heart today. Where there is anxiety, grant peace; where there is weary routine, restore sacred wonder. Keep my lamp burning. Amen.”
            </blockquote>

            <p className="mt-4 text-xs text-[var(--muted)]">
              🕯️ {prayerAmens.toLocaleString()} believers have prayed this today
            </p>

            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={handlePrayAmen}
                className={`rounded-full px-6 py-2.5 text-sm font-bold transition-all shadow-lg ${
                  hasPrayed
                    ? "bg-emerald-600 text-white"
                    : "bg-[var(--gold)] text-black hover:brightness-110 active:scale-95"
                }`}
              >
                {hasPrayed ? "Amen Recorded ✓" : "Lift Prayer · Tap Amen"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
