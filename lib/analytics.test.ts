import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  trackEvent,
  trackQuizStart,
  trackQuestionAnswer,
  trackChapterComplete,
  trackQuizComplete,
  trackLifelineUse,
  trackAdBreak,
} from "./analytics";

describe("lib/analytics", () => {
  beforeEach(() => {
    // Setup window mock for node vitest environment
    const win: any = {
      dataLayer: [],
      __lampstand_analytics: [],
    };
    (globalThis as any).window = win;
  });

  afterEach(() => {
    delete (globalThis as any).window;
  });

  it("pushes events to dataLayer and local inspection buffer", () => {
    trackEvent("custom_test_event", { foo: "bar" });
    expect(window.dataLayer?.length).toBe(1);
    expect(window.dataLayer?.[0]).toMatchObject({
      event: "custom_test_event",
      foo: "bar",
    });

    expect(window.__lampstand_analytics?.length).toBe(1);
    expect(window.__lampstand_analytics?.[0].event).toBe("custom_test_event");
  });

  it("calls window.gtag when available", () => {
    const mockGtag = vi.fn();
    window.gtag = mockGtag;

    trackQuizStart({
      quizSlug: "open-the-book",
      title: "Open the Book",
      questionCount: 54,
      isLongform: true,
    });

    expect(mockGtag).toHaveBeenCalledWith(
      "event",
      "quiz_start",
      expect.objectContaining({
        quiz_slug: "open-the-book",
        question_count: 54,
        is_longform: true,
      }),
    );
  });

  it("tracks question answers accurately", () => {
    trackQuestionAnswer({
      quizSlug: "us-capitals",
      questionIndex: 0,
      isCorrect: true,
      timeSpentMs: 1450,
      streak: 3,
    });

    const last = window.__lampstand_analytics?.[0];
    expect(last?.event).toBe("question_answer");
    expect(last?.properties).toMatchObject({
      quiz_slug: "us-capitals",
      question_index: 0,
      is_correct: true,
      time_spent_ms: 1450,
      streak: 3,
    });
  });

  it("tracks chapter completion and quiz completion", () => {
    trackChapterComplete({
      quizSlug: "open-the-book",
      chapterIndex: 1,
      title: "Act I",
    });

    expect(window.__lampstand_analytics?.[0].event).toBe("chapter_complete");

    trackQuizComplete({
      quizSlug: "open-the-book",
      score: 50,
      total: 54,
      accuracyPct: 93,
      totalTimeSeconds: 420,
      grade: "A",
    });

    expect(window.__lampstand_analytics?.[1].event).toBe("quiz_complete");
    expect(window.__lampstand_analytics?.[1].properties).toMatchObject({
      accuracy_pct: 93,
      grade: "A",
    });
  });

  it("tracks lifelines and ad breaks", () => {
    trackLifelineUse({
      lifeline: "5050",
      quizSlug: "us-capitals",
      questionIndex: 2,
    });

    expect(window.__lampstand_analytics?.[0].event).toBe("lifeline_use");
    expect(window.__lampstand_analytics?.[0].properties).toMatchObject({
      lifeline_type: "5050",
    });

    trackAdBreak({
      quizSlug: "open-the-book",
      courseIndex: 2,
      skipped: true,
      skipReason: "streak",
    });

    expect(window.__lampstand_analytics?.[1].event).toBe("ad_break");
    expect(window.__lampstand_analytics?.[1].properties).toMatchObject({
      skipped: true,
      skip_reason: "streak",
    });
  });
});
