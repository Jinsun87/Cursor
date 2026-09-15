"use client";

declare global {
  interface Window {
    gtag?: (
      command: "config" | "event" | "js",
      targetId: string | Date,
      config?: Record<string, unknown>,
    ) => void;
    dataLayer?: unknown[];
    va?: (event: string, properties?: Record<string, unknown>) => void;
    __lampstand_analytics?: Array<{
      event: string;
      properties?: Record<string, unknown>;
      timestamp: string;
    }>;
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function isAnalyticsSupported(): boolean {
  return typeof window !== "undefined";
}

export function trackEvent(eventName: string, properties?: Record<string, unknown>) {
  if (!isAnalyticsSupported()) return;

  const timestamp = new Date().toISOString();
  const payload = { ...properties, timestamp };

  // 1. GA4 / Google Tag Manager via gtag or dataLayer
  if (typeof window.gtag === "function") {
    try {
      window.gtag("event", eventName, payload);
    } catch {
      /* ignore script errors */
    }
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...payload });

  // 2. Vercel Analytics via window.va
  if (typeof window.va === "function") {
    try {
      window.va(eventName, payload);
    } catch {
      /* ignore */
    }
  }

  // 3. Local Developer / Inspection Buffer
  window.__lampstand_analytics = window.__lampstand_analytics || [];
  window.__lampstand_analytics.push({
    event: eventName,
    properties,
    timestamp,
  });
  if (window.__lampstand_analytics.length > 200) {
    window.__lampstand_analytics.shift();
  }
}

/* Specific Event Trackers */

export function trackPageview(path: string, title?: string) {
  trackEvent("page_view", {
    page_path: path,
    page_title: title || (typeof document !== "undefined" ? document.title : ""),
  });
}

export function trackActiveDwellTime(path: string, activeSeconds: number) {
  trackEvent("time_spent_ping", {
    page_path: path,
    active_seconds: Math.round(activeSeconds),
  });
}

export function trackQuizStart(params: {
  quizSlug: string;
  title: string;
  questionCount: number;
  isLongform?: boolean;
  isSecret?: boolean;
}) {
  trackEvent("quiz_start", {
    quiz_slug: params.quizSlug,
    quiz_title: params.title,
    question_count: params.questionCount,
    is_longform: Boolean(params.isLongform),
    is_secret: Boolean(params.isSecret),
  });
}

export function trackQuestionAnswer(params: {
  quizSlug: string;
  questionIndex: number;
  isCorrect: boolean;
  timeSpentMs: number;
  streak: number;
}) {
  trackEvent("question_answer", {
    quiz_slug: params.quizSlug,
    question_index: params.questionIndex,
    is_correct: params.isCorrect,
    time_spent_ms: Math.round(params.timeSpentMs),
    streak: params.streak,
  });
}

export function trackChapterComplete(params: {
  quizSlug: string;
  chapterIndex: number;
  title: string;
}) {
  trackEvent("chapter_complete", {
    quiz_slug: params.quizSlug,
    chapter_index: params.chapterIndex,
    chapter_title: params.title,
  });
}

export function trackQuizComplete(params: {
  quizSlug: string;
  score: number;
  total: number;
  accuracyPct: number;
  totalTimeSeconds: number;
  grade: string;
}) {
  trackEvent("quiz_complete", {
    quiz_slug: params.quizSlug,
    score: params.score,
    total: params.total,
    accuracy_pct: params.accuracyPct,
    total_time_seconds: Math.round(params.totalTimeSeconds),
    grade: params.grade,
  });
}

export function trackLifelineUse(params: {
  lifeline: "5050" | "skip_ad";
  quizSlug: string;
  questionIndex: number;
}) {
  trackEvent("lifeline_use", {
    lifeline_type: params.lifeline,
    quiz_slug: params.quizSlug,
    question_index: params.questionIndex,
  });
}

export function trackAdBreak(params: {
  quizSlug: string;
  courseIndex: number;
  skipped: boolean;
  skipReason?: "streak" | "coins";
}) {
  trackEvent("ad_break", {
    quiz_slug: params.quizSlug,
    course_index: params.courseIndex,
    skipped: params.skipped,
    skip_reason: params.skipReason,
  });
}
