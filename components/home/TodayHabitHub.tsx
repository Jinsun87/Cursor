"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { useReadingTracker, getTodayDateString } from "@/lib/bible/reading-store";
import { CHAPTERS } from "@/lib/bible/catalog";
import {
  getChapterQuote,
  getChapterDevotional,
  getChapterPrayer,
} from "@/lib/bible/devotionals";

const DAYS_OF_WEEK = ["M", "T", "W", "T", "F", "S", "S"];

type CircadianPhase = "morning" | "afternoon" | "evening";

interface CircadianData {
  phase: CircadianPhase;
  badge: string;
  salutation: string;
  subtitle: string;
}

const CIRCADIAN_CONFIG: Record<CircadianPhase, CircadianData> = {
  morning: {
    phase: "morning",
    badge: "🌅 Morning Awakening",
    salutation: "Good Morning",
    subtitle: "Begin your day in clarity and unshakeable light.",
  },
  afternoon: {
    phase: "afternoon",
    badge: "☀️ Midday Restoration",
    salutation: "Good Afternoon",
    subtitle: "Pause the rush. Step into the sanctuary of His presence.",
  },
  evening: {
    phase: "evening",
    badge: "🌙 Evening Surrender",
    salutation: "Good Evening",
    subtitle: "Release the burdens of today into capable hands.",
  },
};

interface Props {
  showNavigationToRead?: boolean;
}

export function TodayHabitHub({ showNavigationToRead = true }: Props) {
  const { user } = useApp();
  const { progress, recordRitualStep } = useReadingTracker();

  const [circadian, setCircadian] = useState<CircadianData>(CIRCADIAN_CONFIG.morning);
  const [activeModal, setActiveModal] = useState<"quote" | "wordspark" | "devotional" | "prayer" | "shareCard" | null>(null);

  // Prayer audio narration state in modal
  const [isPlayingPrayerAudio, setIsPlayingPrayerAudio] = useState(false);
  const [prayerAmens, setPrayerAmens] = useState(3842);
  const [hasPrayed, setHasPrayed] = useState(false);

  // Quote & share state
  const [copiedQuote, setCopiedQuote] = useState(false);

  // Today's chapter & dynamic content
  const currentDay = progress.currentCourseDay || 1;
  const featuredChapter = CHAPTERS.find((c) => c.dayNumber === currentDay) || CHAPTERS[0];

  const quoteData = getChapterQuote(featuredChapter);
  const devotionalData = getChapterDevotional(featuredChapter);
  const prayerData = getChapterPrayer(featuredChapter);
  const firstSparkKey = Object.keys(featuredChapter.sparks || {})[0];
  const firstSpark = firstSparkKey
    ? featuredChapter.sparks[firstSparkKey]
    : {
        term: "Created",
        originalScript: "בָּרָא",
        transliteration: "Bārā'",
        language: "Hebrew",
        rootMeaning: "to shape or create out of nothing (ex nihilo)",
        culturalInsight: "Exclusively used in Scripture with God as the subject.",
      };

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

  const todayStr = getTodayDateString();
  const ritual =
    progress.todayRitual && progress.todayRitual.date === todayStr
      ? progress.todayRitual
      : {
          quoteCompleted: false,
          passageCompleted: false,
          wordsparkCompleted: false,
          devotionalCompleted: false,
          prayerCompleted: false,
        };

  // Check if all primary ritual steps are completed
  const isQuoteDone = Boolean(ritual.quoteCompleted);
  const isPassageDone = Boolean(ritual.passageCompleted);
  const isDevotionalDone = Boolean(ritual.devotionalCompleted);
  const isPrayerDone = Boolean(ritual.prayerCompleted);
  const isSparkDone = Boolean(ritual.wordsparkCompleted);

  const completedCount = [isQuoteDone, isPassageDone, isDevotionalDone, isPrayerDone].filter(Boolean).length;
  const isAllComplete = completedCount === 4;

  // Day of week index (0 = Mon, 6 = Sun)
  const currentDayIndex = (new Date().getDay() + 6) % 7;
  const streakCount = Math.max(progress.streakDays || 1, 1);

  // Activities list merged with Glorify pillars & Lampstand WordSpark
  const activities = [
    {
      id: "quote",
      title: "Daily Verse & Anchor Quote",
      subtitle: `“${quoteData.quote}”`,
      tag: quoteData.author,
      timeEstimate: "1 min",
      icon: "🕊️",
      isDone: isQuoteDone,
    },
    {
      id: "passage",
      title: `Today's Scripture: ${featuredChapter.title}`,
      subtitle: featuredChapter.subtitle,
      tag: `${featuredChapter.bookTitle} ${featuredChapter.chapterNumber}`,
      timeEstimate: "3 min",
      icon: "⚡",
      isDone: isPassageDone,
    },
    {
      id: "devotional",
      title: `Devotional: ${devotionalData.title}`,
      subtitle: `“${devotionalData.takeaway}”`,
      tag: `${devotionalData.readingMinutes} Min Read`,
      timeEstimate: "4 min",
      icon: "💬",
      isDone: isDevotionalDone,
    },
    {
      id: "prayer",
      title: `Sanctuary Prayer: ${prayerData.title}`,
      subtitle: prayerData.scriptureInspiration || "Guided contemplative prayer for peace and courage",
      tag: "Spoken Audio",
      timeEstimate: "1 min",
      icon: "🙏",
      isDone: isPrayerDone,
    },
    {
      id: "wordspark",
      title: `WordSpark: ${firstSpark.transliteration} (${firstSpark.originalScript})`,
      subtitle: `${firstSpark.language}: ${firstSpark.rootMeaning}`,
      tag: "Ancient Root",
      timeEstimate: "1 min",
      icon: "✨",
      isDone: isSparkDone,
    },
  ];

  function toggleStep(id: "quote" | "passage" | "wordspark" | "devotional" | "prayer") {
    recordRitualStep(id, featuredChapter.dayNumber);
  }

  function handlePrayAmen() {
    if (!hasPrayed) {
      setHasPrayed(true);
      setPrayerAmens((c) => c + 1);
      recordRitualStep("prayer", featuredChapter.dayNumber);
    }
  }

  function togglePrayerAudio() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (isPlayingPrayerAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingPrayerAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${prayerData.title}. ${prayerData.prayerText.replace(/\n\n/g, ". ")}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.88;
      utterance.pitch = 0.95;

      utterance.onstart = () => setIsPlayingPrayerAudio(true);
      utterance.onend = () => setIsPlayingPrayerAudio(false);
      utterance.onerror = () => setIsPlayingPrayerAudio(false);

      window.speechSynthesis.speak(utterance);
    }
  }

  // Cleanup speech on modal close
  useEffect(() => {
    if (activeModal !== "prayer" && typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlayingPrayerAudio(false);
    }
  }, [activeModal]);

  function handleCopyQuote() {
    const text = `“${quoteData.quote}” — ${quoteData.author} (${featuredChapter.bookTitle} ${featuredChapter.chapterNumber})\n\nDaily scripture via Lampstand`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedQuote(true);
      setTimeout(() => setCopiedQuote(false), 2000);
      recordRitualStep("quote", featuredChapter.dayNumber);
    }
  }

  return (
    <div className="w-full space-y-6">
      {/* 1. Senior-Readable Top Header: Streak, Day Tracker & Circadian Mood */}
      <div className="rounded-3xl border border-[var(--line)] bg-[var(--canvas-2)] p-6 sm:p-8 shadow-xl glass-specular transition-colors">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--gold)]/40 bg-[var(--gold)]/10 text-2xl font-bold text-[var(--gold)] shadow-inner">
              {user?.username ? user.username.charAt(0).toUpperCase() : "L"}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
                  <span>🔥</span> {streakCount} Day Reading Streak
                </span>
                <span className="text-[var(--muted)] text-xs">·</span>
                <span className="rounded-full bg-[var(--gold)]/15 border border-[var(--gold)]/30 px-2.5 py-0.5 text-xs font-semibold text-[var(--gold)]">
                  {circadian.badge}
                </span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--ink)] tracking-tight mt-1">
                {user?.username ? `${circadian.salutation}, ${user.username}` : `${circadian.salutation} · Sacred Rhythm`}
              </h1>
              <p className="text-sm text-[var(--muted)] mt-0.5">
                {circadian.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-500 dark:text-emerald-400">
              Day {featuredChapter.dayNumber} of 30
            </span>
            <Link
              href="/pricing"
              className="flex items-center gap-1.5 rounded-full border border-[var(--gold)]/30 bg-[var(--gold)]/10 px-3.5 py-1.5 text-xs font-semibold text-[var(--gold)] hover:bg-[var(--gold)]/20 transition-all"
            >
              <span>👑</span>
              <span>Plus</span>
            </Link>
          </div>
        </div>

        {/* Weekly Day Circles (M T W T F S S) with High Legibility */}
        <div className="mt-6 flex items-center justify-between gap-1.5 border-t border-[var(--line)] pt-5">
          {DAYS_OF_WEEK.map((day, idx) => {
            const isToday = idx === currentDayIndex;
            const isPast = idx < currentDayIndex;
            const isDone = isPast || (isToday && isAllComplete);

            return (
              <div key={idx} className="flex flex-1 flex-col items-center gap-1.5">
                <span
                  className={`text-xs font-bold uppercase ${
                    isToday ? "text-[var(--gold)]" : "text-[var(--muted)]"
                  }`}
                >
                  {day}
                </span>
                <div
                  className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full text-xs sm:text-sm font-bold transition-all ${
                    isToday
                      ? "border-2 border-[var(--gold)] bg-[var(--gold)]/20 text-[var(--gold)] shadow-[0_0_12px_var(--gold)]"
                      : isDone
                      ? "bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30"
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
        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
              style={{ width: `${(completedCount / 4) * 100}%` }}
            />
          </div>
          <span className="text-xs sm:text-sm font-bold text-[var(--gold)] whitespace-nowrap">
            {completedCount} of 4 Daily Rituals Done
          </span>
        </div>

        {/* Anti-Binge Completion Banner (Rest in today's reading) */}
        {isAllComplete ? (
          <div className="mt-5 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-emerald-800 dark:text-emerald-300 animate-fadeIn">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">✨</span>
                <div>
                  <h4 className="font-bold text-sm sm:text-base">
                    Today&apos;s Sacred Rhythm is Complete (+50 Coins Earned)
                  </h4>
                  <p className="text-xs opacity-90 mt-0.5">
                    Rest in today&apos;s truth. Day {Math.min(30, (featuredChapter.dayNumber || 1) + 1)} unlocks tomorrow to sustain your daily walking habit.
                  </p>
                </div>
              </div>
              <Link
                href="/read#bible-canon"
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm"
              >
                Explore Bible Canon →
              </Link>
            </div>
          </div>
        ) : null}
      </div>

      {/* 2. Unified Senior-Readable Checklist Cards */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
            Today&apos;s Devotional Rituals · Day {featuredChapter.dayNumber}
          </h2>
          <span className="text-xs text-[var(--muted)]">
            {featuredChapter.bookTitle} {featuredChapter.chapterNumber}
          </span>
        </div>

        {activities.map((activity) => (
          <div
            key={activity.id}
            onClick={() => {
              if (activity.id === "passage") {
                // Open chapter reader in daily mode
              } else {
                setActiveModal(activity.id as any);
              }
            }}
            className={`group flex items-center justify-between gap-4 rounded-3xl border p-5 sm:p-6 min-h-[82px] transition-all cursor-pointer ${
              activity.isDone
                ? "border-emerald-500/50 bg-emerald-500/10 hover:border-emerald-500/70"
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
                  href={`/read/${featuredChapter.bookSlug}/${featuredChapter.chapterNumber}?mode=daily`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStep("passage");
                  }}
                  className="min-h-[46px] rounded-xl bg-[var(--gold)] px-4 py-2.5 text-sm font-bold text-black hover:brightness-110 shadow-md transition-all flex items-center gap-1.5"
                >
                  <span>{activity.isDone ? "Revisit Walk" : "Start Walk"}</span>
                  <span>⚡</span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStep(activity.id as any);
                  }}
                  aria-label={`Mark ${activity.title} complete`}
                  className={`flex h-11 w-11 items-center justify-center rounded-full border-2 text-base transition-all shadow-sm ${
                    activity.isDone
                      ? "border-emerald-500 bg-emerald-500 text-white font-black shadow-emerald-500/20"
                      : "border-[var(--line)] bg-black/5 dark:bg-white/5 text-transparent hover:border-[var(--gold)]/60"
                  }`}
                >
                  ✓
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Featured Story Card with Clear Readability */}
      <div className="overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--canvas-2)] p-6 sm:p-8 glass-sanctuary">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="rounded-full bg-[var(--gold)]/20 px-3 py-1 text-xs font-semibold text-[var(--gold)] uppercase tracking-wider">
              Today&apos;s Illuminated Scripture · Day {featuredChapter.dayNumber}
            </span>
            <h3 className="mt-3 font-display text-2xl sm:text-3xl font-bold text-[var(--ink)]">
              {featuredChapter.bookTitle} {featuredChapter.chapterNumber}: {featuredChapter.title}
            </h3>
            <p className="mt-2 text-sm sm:text-base text-[var(--muted)] leading-relaxed">
              {featuredChapter.subtitle} Experience the ancient text through museum-grade classical paintings, original Hebrew & Greek WordSparks, and pastoral reflection.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                href={`/read/${featuredChapter.bookSlug}/${featuredChapter.chapterNumber}?mode=daily`}
                className="btn btn-primary btn-gold-glow tactile-tap"
                onClick={() => toggleStep("passage")}
              >
                🕊️ Open Daily Walk (3 min)
              </Link>
              <Link
                href={`/read/${featuredChapter.bookSlug}/${featuredChapter.chapterNumber}?mode=scroll`}
                className="btn btn-ghost tactile-tap"
              >
                📜 Full Text Study
              </Link>
            </div>
          </div>

          <div className="relative h-44 w-32 sm:h-56 sm:w-40 shrink-0 overflow-hidden rounded-2xl border border-[var(--gold)]/30 shadow-2xl">
            <Image
              src={featuredChapter.artworkUrl}
              alt={featuredChapter.title}
              fill
              className="object-cover"
            />
            <div className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-semibold text-[var(--gold)]">
              Day {featuredChapter.dayNumber}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: Verse & Quote of the Day                        */}
      {/* ========================================================= */}
      {activeModal === "quote" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fadeIn"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl border border-[var(--gold)]/40 bg-[var(--canvas-2)] p-6 sm:p-8 shadow-2xl text-[var(--ink)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-[var(--gold)] font-bold">
                Daily Anchor Quote · {featuredChapter.bookTitle} {featuredChapter.chapterNumber}
              </span>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-xs text-[var(--muted)] hover:text-[var(--ink)]"
              >
                ✕
              </button>
            </div>
            <blockquote className="mt-4 font-serif text-2xl sm:text-3xl leading-snug text-[var(--ink)]">
              “{quoteData.quote}”
            </blockquote>
            <p className="mt-3 text-sm font-semibold text-[var(--gold)]">
              — {quoteData.author}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-4">
              <button
                type="button"
                onClick={handleCopyQuote}
                className="rounded-xl border border-[var(--line)] bg-[var(--canvas)] px-4 py-2 text-xs font-semibold text-[var(--ink)] hover:border-[var(--gold)]/50"
              >
                {copiedQuote ? "✓ Copied!" : "📋 Copy Quote"}
              </button>
              <button
                type="button"
                onClick={() => {
                  toggleStep("quote");
                  setActiveModal(null);
                }}
                className="rounded-xl bg-[var(--gold)] px-5 py-2 text-xs font-bold text-black hover:brightness-110"
              >
                Mark Complete ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: Devotional Reflection                           */}
      {/* ========================================================= */}
      {activeModal === "devotional" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fadeIn"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-3xl border border-[var(--gold)]/40 bg-[var(--canvas-2)] p-6 sm:p-8 shadow-2xl text-[var(--ink)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <span className="text-xs uppercase tracking-widest text-[var(--gold)] font-bold">
                Daily Devotional · {devotionalData.readingMinutes} Min Read
              </span>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-xs text-[var(--muted)] hover:text-[var(--ink)]"
              >
                ✕
              </button>
            </div>

            <h3 className="mt-4 font-display text-2xl font-bold text-[var(--ink)]">
              {devotionalData.title}
            </h3>

            <div className="mt-4 space-y-3 text-sm sm:text-base leading-relaxed text-[var(--muted)]">
              {devotionalData.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-[var(--gold)]/30 bg-[var(--gold)]/10 p-4">
              <span className="text-xs uppercase font-bold text-[var(--gold)]">📌 Key Anchor</span>
              <p className="mt-1 font-serif text-sm sm:text-base text-[var(--ink)] italic">
                “{devotionalData.takeaway}”
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-[var(--line)] pt-4">
              <button
                type="button"
                onClick={() => {
                  toggleStep("devotional");
                  setActiveModal(null);
                }}
                className="rounded-xl bg-[var(--gold)] px-5 py-2.5 text-xs sm:text-sm font-bold text-black hover:brightness-110"
              >
                Mark Devotional Read ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: Atmospheric Prayer                             */}
      {/* ========================================================= */}
      {activeModal === "prayer" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fadeIn"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl border border-[var(--gold)]/40 bg-[var(--canvas-2)] p-6 sm:p-8 shadow-2xl text-[var(--ink)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-sky-400 font-bold">
                Atmospheric Prayer · {prayerData.durationMinutes} Min
              </span>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-xs text-[var(--muted)] hover:text-[var(--ink)]"
              >
                ✕
              </button>
            </div>

            <h3 className="mt-3 font-display text-2xl font-bold text-[var(--ink)]">
              {prayerData.title}
            </h3>

            {/* Audio Narrator Bar */}
            <div className="mt-4 flex items-center justify-between rounded-2xl border border-[var(--line)] bg-[var(--canvas)] p-3.5">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={togglePrayerAudio}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--gold)] text-black font-bold shadow hover:scale-105 transition-transform"
                >
                  {isPlayingPrayerAudio ? "⏸" : "▶"}
                </button>
                <div>
                  <p className="text-xs font-bold text-[var(--ink)]">
                    {isPlayingPrayerAudio ? "Reading prayer aloud..." : "Hear this prayer read"}
                  </p>
                  <p className="text-[10px] text-[var(--muted)]">Spoken contemplative narration</p>
                </div>
              </div>
            </div>

            <div className="mt-4 max-h-[220px] overflow-y-auto pr-2">
              <p className="font-serif text-base sm:text-lg leading-relaxed text-[var(--ink)] whitespace-pre-line">
                {prayerData.prayerText}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3 border-t border-[var(--line)] pt-4">
              <span className="text-xs text-[var(--muted)]">
                🙏 {prayerAmens.toLocaleString()} prayed today
              </span>
              <button
                type="button"
                onClick={() => {
                  handlePrayAmen();
                  setActiveModal(null);
                }}
                className="rounded-xl bg-[var(--gold)] px-6 py-2.5 text-xs sm:text-sm font-bold text-black hover:brightness-110 shadow-md"
              >
                {hasPrayed ? "Amen ✓" : "Amen 🙏"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: WordSpark                                      */}
      {/* ========================================================= */}
      {activeModal === "wordspark" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fadeIn"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl border border-[var(--gold)]/40 bg-[var(--canvas-2)] p-6 sm:p-8 shadow-2xl text-[var(--ink)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-[var(--gold)] font-bold">
                WordSpark Root · {firstSpark.language}
              </span>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-xs text-[var(--muted)] hover:text-[var(--ink)]"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 text-center">
              <div className="font-serif text-4xl text-[var(--gold)] font-bold">
                {firstSpark.originalScript}
              </div>
              <p className="text-sm font-bold text-[var(--ink)] mt-1">
                {firstSpark.transliteration} · “{firstSpark.term}”
              </p>
            </div>

            <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--canvas)] p-4 text-sm leading-relaxed text-[var(--muted)]">
              <p className="font-semibold text-[var(--ink)]">Root Meaning:</p>
              <p className="mt-0.5">{firstSpark.rootMeaning}</p>
              <p className="font-semibold text-[var(--ink)] mt-2">Cultural Insight:</p>
              <p className="mt-0.5">{firstSpark.culturalInsight}</p>
            </div>

            <div className="mt-6 flex justify-end border-t border-[var(--line)] pt-4">
              <button
                type="button"
                onClick={() => {
                  toggleStep("wordspark");
                  setActiveModal(null);
                }}
                className="rounded-xl bg-[var(--gold)] px-5 py-2 text-xs font-bold text-black hover:brightness-110"
              >
                Mark Discovered ✓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
