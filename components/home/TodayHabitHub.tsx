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

type CircadianPhase = "morning" | "afternoon" | "evening";

interface CircadianData {
  phase: CircadianPhase;
  badge: string;
  salutation: string;
  subtitle: string;
  prayerTitle: string;
  prayerText: string;
}

const CIRCADIAN_CONFIG: Record<CircadianPhase, CircadianData> = {
  morning: {
    phase: "morning",
    badge: "🌅 Morning Awakening",
    salutation: "Good Morning",
    subtitle: "Begin your day in clarity and unshakeable light.",
    prayerTitle: "Morning Invocation of Light",
    prayerText:
      "“Lord of the Dawn, You spoke and light shattered the void. Shine into every quiet shadow of my day ahead. Where there is anxiety, grant purpose; where there is confusion, give holy wisdom. Guide my footsteps in peace. Amen.”",
  },
  afternoon: {
    phase: "afternoon",
    badge: "☀️ Midday Restoration",
    salutation: "Good Afternoon",
    subtitle: "Pause the rush. Step into the sanctuary of His presence.",
    prayerTitle: "Midday Renewal of Strength",
    prayerText:
      "“Lord of All Grace, in the heat and momentum of the day, I pause to remember Your steadfast presence. Reset my weary thoughts. Let patience replace hurry, and gentle courage crown my actions. Amen.”",
  },
  evening: {
    phase: "evening",
    badge: "🌙 Evening Surrender",
    salutation: "Good Evening",
    subtitle: "Release the burdens of today into capable hands.",
    prayerTitle: "Evening Compline of Trust",
    prayerText:
      "“Keeper of the Stars, as night descends and labor ceases, I release every care into Your hands. You neither slumber nor sleep. Watch over my rest, hush all fearful striving, and grant sacred stillness to my soul. Amen.”",
  },
};

export function TodayHabitHub() {
  const { user } = useApp();
  const { progress } = useReadingTracker();

  const [circadian, setCircadian] = useState<CircadianData>(CIRCADIAN_CONFIG.morning);
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const [activeModal, setActiveModal] = useState<"quote" | "wordspark" | "trivia" | "prayer" | "shareCard" | null>(null);

  // Trivia state
  const [triviaAnswer, setTriviaAnswer] = useState<number | null>(null);
  const [triviaFeedback, setTriviaFeedback] = useState<string | null>(null);

  // Prayer state
  const [prayerAmens, setPrayerAmens] = useState(3842);
  const [hasPrayed, setHasPrayed] = useState(false);

  // Quote / Share state
  const [copiedQuote, setCopiedQuote] = useState(false);
  const [copiedShareText, setCopiedShareText] = useState(false);

  const todayStr = getTodayDateString();
  const storageKey = `lampstand_daily_ritual_${todayStr}`;

  // Circadian phase calculation on mount
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setCircadian(CIRCADIAN_CONFIG.morning);
    } else if (hour >= 12 && hour < 17) {
      setCircadian(CIRCADIAN_CONFIG.afternoon);
    } else {
      setCircadian(CIRCADIAN_CONFIG.evening);
    }
  }, []);

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
    const text = `“The light shines in the darkness, and the darkness has not overcome it.” — John 1:5\n\nDaily verse via Lampstand: https://lampstandbible.com`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedQuote(true);
      setTimeout(() => setCopiedQuote(false), 2000);
      markCompleted("quote");
    }
  }

  function handleWhatsAppShare() {
    const text = `“The light shines in the darkness, and the darkness has not overcome it.” — John 1:5 ✨\n\nRead more on Lampstand: https://lampstandbible.com`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
      markCompleted("quote");
    }
  }


  return (
    <div className="w-full">
      {/* 1. Glorify-style Top Banner: Streak, Day Tracker & Lamp Flame with Circadian Mood */}
      <div className="rounded-3xl border border-[var(--line)] bg-[var(--canvas-2)] p-5 sm:p-7 shadow-2xl glass-specular">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--gold)]/40 bg-[var(--gold)]/10 text-xl font-bold text-[var(--gold)] shadow-inner">
              {user?.username ? user.username.charAt(0).toUpperCase() : "L"}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[var(--gold)]">
                  <span className="animate-pulse">🔥</span> {streakCount} Day Streak
                </span>
                <span className="text-[var(--muted)] text-xs">·</span>
                <span className="rounded-full bg-[var(--gold)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--gold)]">
                  {circadian.badge}
                </span>
              </div>
              <h1 className="font-display text-xl sm:text-2xl font-bold text-[var(--ink)] tracking-tight mt-0.5">
                {user?.username ? `${circadian.salutation}, ${user.username}` : `${circadian.salutation} · Sacred Rhythm`}
              </h1>
              <p className="text-xs text-[var(--muted)] mt-0.5">
                {circadian.subtitle}
              </p>
            </div>
          </div>

          <Link
            href="/pricing"
            className="flex items-center gap-1.5 rounded-full border border-[var(--gold)]/30 bg-[var(--gold)]/10 px-3.5 py-1.5 text-xs font-semibold text-[var(--gold)] hover:bg-[var(--gold)]/20 transition-all tactile-tap"
          >
            <span>👑</span>
            <span>Lampstand Plus</span>
          </Link>
        </div>

        {/* Weekly Day Circles (M T W T F S S) */}
        <div className="mt-6 flex items-center justify-between gap-1 border-t border-[var(--line)] pt-4">
          {DAYS_OF_WEEK.map((day, idx) => {
            const isToday = idx === currentDayIndex;
            const isPast = idx < currentDayIndex;
            const isDone = isPast || (isToday && completedItems.length > 0);

            return (
              <div key={idx} className="flex flex-1 flex-col items-center gap-1.5">
                <span
                  className={`text-[11px] font-bold uppercase ${
                    isToday ? "text-[var(--gold)]" : "text-[var(--muted)]"
                  }`}
                >
                  {day}
                </span>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all ${
                    isToday
                      ? "border-2 border-[var(--gold)] bg-[var(--gold)]/20 text-[var(--gold)] shadow-[0_0_12px_var(--gold)] font-bold"
                      : isDone
                      ? "bg-[var(--gold)]/15 text-[var(--gold)] font-bold border border-[var(--gold)]/30"
                      : "bg-black/5 dark:bg-white/5 text-[var(--muted)]"
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
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
              style={{ width: `${(completedItems.length / DAILY_ACTIVITIES.length) * 100}%` }}
            />
          </div>
          <span className="text-xs font-medium text-[var(--gold)] whitespace-nowrap">
            {completedItems.length} of {DAILY_ACTIVITIES.length} Done
          </span>
        </div>

        {isAllComplete ? (
          <div className="mt-4 flex items-center justify-between rounded-2xl border border-emerald-500/40 bg-emerald-950/20 px-4 py-2.5 text-xs text-emerald-600 dark:text-emerald-300 animate-fade-in">
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
              className={`group flex cursor-pointer items-center justify-between gap-4 rounded-3xl border p-5 sm:p-6 min-h-[82px] transition-all tactile-tap ${
                isDone
                  ? "border-emerald-500/50 bg-emerald-500/15 hover:border-emerald-500/70"
                  : "border-[var(--line)] bg-[var(--canvas-2)] hover:border-[var(--gold)]/50 hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
              }`}
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-black/5 dark:bg-white/5 text-2xl shadow-inner">
                  {activity.icon}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="font-display text-lg sm:text-xl font-bold text-[var(--ink)] tracking-tight">
                      {activity.title}
                    </h3>
                    <span className="rounded-full bg-black/5 dark:bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-[var(--muted)] shrink-0">
                      {activity.tag}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--muted)] line-clamp-1 mt-1 leading-relaxed">
                    {activity.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-semibold text-[var(--muted)] hidden sm:inline">
                  {activity.timeEstimate}
                </span>

                {activity.id === "passage" ? (
                  <Link
                    href="/read/genesis/1"
                    onClick={(e) => {
                      e.stopPropagation();
                      markCompleted("passage");
                    }}
                    className="min-h-[44px] rounded-xl bg-[var(--gold)] px-4 py-2 text-sm font-bold text-black hover:brightness-110 shadow-md transition-all flex items-center gap-1.5"
                  >
                    Open Story
                  </Link>
                ) : (
                  <button
                    type="button"
                    aria-label={`Complete ${activity.title}`}
                    className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border-2 text-base transition-all shadow-sm ${
                      isDone
                        ? "border-emerald-500 bg-emerald-500 text-white font-black shadow-emerald-500/20"
                        : "border-[var(--line)] bg-black/5 dark:bg-white/5 text-transparent group-hover:border-[var(--gold)]/60"
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
      <div className="mt-8 overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--canvas-2)] p-6 sm:p-8 glass-sanctuary">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="rounded-full bg-[var(--gold)]/20 px-3 py-1 text-xs font-semibold text-[var(--gold)] uppercase tracking-wider">
              Featured Illuminated Story
            </span>
            <h3 className="mt-3 font-display text-2xl sm:text-3xl font-bold text-[var(--ink)]">
              Genesis 1: The First Light
            </h3>
            <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">
              Before stars burned or seas crashed, the Spirit of God moved upon the deep. Experience the creation narrative in the full-bleed Vibrant Frame story reader with swipe physics.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                href="/read/genesis/1"
                className="btn btn-primary btn-gold-glow tactile-tap"
                onClick={() => markCompleted("passage")}
              >
                ✨ Read Visual Story (2 min)
              </Link>
              <Link href="/read" className="btn btn-ghost tactile-tap">
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl border border-[var(--gold)]/40 bg-[var(--canvas-2)] p-6 sm:p-8 shadow-2xl glass-specular"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-[var(--gold)] font-bold">
                Verse of the Day · John 1:5
              </span>
              <button
                type="button"
                onClick={() => setActiveModal("shareCard")}
                className="inline-flex items-center gap-1 rounded-full border border-[var(--gold)]/30 bg-[var(--gold)]/10 px-2.5 py-1 text-[11px] font-semibold text-[var(--gold)] hover:bg-[var(--gold)]/20 transition-all tactile-tap"
              >
                <span>📱</span>
                <span>Share Card</span>
              </button>
            </div>
            <blockquote className="mt-4 font-display text-2xl sm:text-3xl leading-snug text-[var(--ink)]">
              “The light shines in the darkness, and the darkness has not overcome it.”
            </blockquote>
            <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">
              No matter how dense or intimidating the shadows feel, darkness has no active power to extinguish light. A single candle pierces a cavern of shadows.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyQuote}
                  className="flex items-center gap-2 rounded-full border border-[var(--line)] bg-black/5 dark:bg-white/5 px-3.5 py-2 text-xs font-semibold text-[var(--ink)] hover:bg-black/10 dark:hover:bg-white/10 transition-all tactile-tap"
                >
                  <span>📋</span>
                  <span>{copiedQuote ? "Copied!" : "Copy Verse"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className="flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3.5 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/25 transition-all tactile-tap"
                >
                  <span>💬</span>
                  <span>WhatsApp</span>
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  markCompleted("quote");
                  setActiveModal(null);
                }}
                className="btn btn-primary text-xs py-2 px-5 tactile-tap"
              >
                Mark Complete ✓
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* MODAL: 9:16 WhatsApp / Instagram Story Card Preview */}
      {activeModal === "shareCard" ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative flex flex-col items-center max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Visual 9:16 Card Container */}
            <div className="w-full aspect-[9/16] rounded-3xl border border-[var(--gold)]/40 bg-gradient-to-b from-[#141814] via-[#1c241e] to-[#0a0d0a] p-6 sm:p-7 flex flex-col justify-between shadow-2xl relative overflow-hidden glass-specular">
              {/* Subtle radiant orb */}
              <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[var(--gold)]/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-emerald-600/10 blur-3xl" />

              {/* Card Top Brand */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--gold)]/20 text-xs text-[var(--gold)] font-bold">
                    🕯️
                  </span>
                  <span className="font-display text-xs font-bold uppercase tracking-widest text-[var(--gold)]">
                    Lampstand
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-parchment/60 font-medium">
                  Verse of the Day
                </span>
              </div>

              {/* Card Center Scripture */}
              <div className="my-auto py-6">
                <blockquote className="font-serif text-2xl sm:text-3xl text-white leading-relaxed font-normal tracking-wide">
                  “The light shines in the darkness, and the darkness has not overcome it.”
                </blockquote>
                <div className="mt-4 flex items-center gap-2">
                  <span className="h-0.5 w-6 bg-[var(--gold)]" />
                  <span className="font-display text-sm font-semibold tracking-wider text-[var(--gold)]">
                    John 1:5
                  </span>
                </div>
              </div>

              {/* Card Bottom Watermark */}
              <div className="border-t border-white/10 pt-3 flex items-center justify-between text-[11px] text-parchment/60">
                <span>lampstandbible.com</span>
                <span className="text-[var(--gold)]">Read & Reflect</span>
              </div>
            </div>

            {/* Action Bar Under Card */}
            <div className="mt-4 flex items-center gap-3 w-full justify-center">
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="flex-1 flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-emerald-500 transition-all tactile-tap"
              >
                <span>💬</span>
                <span>Share to WhatsApp Status</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  handleCopyQuote();
                  setActiveModal(null);
                }}
                className="rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/20 transition-all tactile-tap"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* MODAL 2: WordSpark */}
      {activeModal === "wordspark" ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl border border-[var(--gold)]/40 bg-[var(--canvas-2)] p-6 sm:p-8 shadow-2xl glass-specular"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-xs uppercase tracking-widest text-[var(--gold)] font-bold">
              Hebrew WordSpark · Genesis 1:1
            </span>
            <div className="mt-3 flex items-baseline gap-3">
              <h3 className="text-3xl font-bold text-[var(--ink)]">Bārā&apos;</h3>
              <span className="font-serif text-2xl text-[var(--gold)]" dir="rtl">
                בָּרָא
              </span>
            </div>
            <p className="mt-2 text-sm font-semibold text-amber-600 dark:text-amber-300">
              Literal Meaning: To create out of nothing (ex nihilo)
            </p>
            <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">
              In Hebrew scripture, the verb <em>bara</em> has only one subject: God. Human beings make, form, or craft from existing elements. Only God brings cosmos out of utter nothingness.
            </p>

            <div className="mt-6 flex justify-end gap-3 border-t border-[var(--line)] pt-4">
              <button
                type="button"
                onClick={() => {
                  markCompleted("wordspark");
                  setActiveModal(null);
                }}
                className="btn btn-primary text-xs py-2 px-5 tactile-tap"
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl border border-[var(--gold)]/40 bg-[var(--canvas-2)] p-6 sm:p-8 shadow-2xl glass-specular"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-xs uppercase tracking-widest text-[var(--gold)] font-bold">
              Daily Recall Question · +25 Coins
            </span>
            <h3 className="mt-3 font-display text-xl font-bold text-[var(--ink)] leading-snug">
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
                  className={`w-full rounded-2xl border p-3.5 text-left text-sm transition-all tactile-tap ${
                    triviaAnswer === i
                      ? i === 1
                        ? "border-emerald-500 bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 font-semibold"
                        : "border-rose-500 bg-rose-500/15 text-rose-800 dark:text-rose-200"
                      : "border-[var(--line)] bg-[var(--canvas-1)] text-[var(--ink)] hover:border-[var(--gold)]/40"
                  }`}
                >
                  <span className="mr-2 font-bold">{String.fromCharCode(65 + i)}.</span>
                  {choice}
                </button>
              ))}
            </div>

            {triviaFeedback ? (
              <p
                className={`mt-3 text-xs leading-relaxed font-medium ${
                  triviaAnswer === 1 ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300"
                }`}
              >
                {triviaFeedback}
              </p>
            ) : null}

            <div className="mt-6 flex justify-end gap-3 border-t border-[var(--line)] pt-4">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="btn btn-ghost text-xs tactile-tap"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* MODAL 4: Guided Daily Prayer (Circadian Adaptive) */}
      {activeModal === "prayer" ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl border border-[var(--gold)]/40 bg-[var(--canvas-2)] p-6 sm:p-8 shadow-2xl text-center glass-specular"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-xs uppercase tracking-widest text-[var(--gold)] font-bold">
              {circadian.badge} · Sanctuary Daily Prayer
            </span>
            <h3 className="mt-2 font-display text-2xl font-bold text-[var(--ink)]">
              {circadian.prayerTitle}
            </h3>
            <blockquote className="mt-4 font-display text-lg text-[var(--ink)] leading-relaxed italic border-y border-[var(--line)] py-4">
              {circadian.prayerText}
            </blockquote>

            <p className="mt-4 text-xs text-[var(--muted)]">
              🕯️ {prayerAmens.toLocaleString()} believers have prayed this today
            </p>

            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={handlePrayAmen}
                className={`rounded-full px-6 py-2.5 text-sm font-bold transition-all shadow-lg tactile-tap ${
                  hasPrayed
                    ? "bg-emerald-600 text-white"
                    : "bg-[var(--gold)] text-black hover:brightness-110 btn-gold-glow"
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
