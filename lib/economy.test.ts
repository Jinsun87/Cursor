import { describe, expect, it } from "vitest";
import {
  canTakeReview,
  coinsForAttempt,
  coinsForDonation,
  masteryFromReview,
  percentScore,
  PREMIUM_COIN_GRANT,
  shouldShowLongformAdBreak,
  SIGNUP_COINS,
} from "./economy";
import type { Attempt, Series } from "./types";

const series: Series = {
  slug: "geography-1",
  title: "Geography 1",
  description: "test",
  category: "geography",
  quizSlugs: ["a", "b", "c", "d", "e"],
  reviewSlug: "review",
  masteryThreshold: 70,
};

function attempt(quizSlug: string, score = 6, total = 6): Attempt {
  return { quizSlug, score, total, completedAt: "2026-01-01T00:00:00.000Z" };
}

describe("economy", () => {
  it("pays signup and premium grants used by the product", () => {
    expect(SIGNUP_COINS).toBe(100);
    expect(PREMIUM_COIN_GRANT).toBe(5000);
  });

  it("pays base coins plus 10 per correct answer", () => {
    expect(coinsForAttempt(80, 6)).toBe(140);
    expect(coinsForAttempt(120, 0)).toBe(120);
  });

  it("rounds percent the same way certificates do", () => {
    expect(percentScore(7, 10)).toBe(70);
    expect(percentScore(5, 8)).toBe(63);
    expect(percentScore(0, 0)).toBe(0);
  });

  it("gives donation coins at 1 per 10 cents", () => {
    expect(coinsForDonation(2500)).toBe(250);
  });

  it("locks the review until every pack quiz is logged", () => {
    const partial = ["a", "b", "c", "d"].map((slug) => attempt(slug));
    expect(canTakeReview(series, partial)).toBe(false);
    expect(canTakeReview(series, [...partial, attempt("e")])).toBe(true);
  });

  it("awards mastery at 70% on the review after the pack is done", () => {
    const pack = series.quizSlugs.map((slug) => attempt(slug));
    const withReview = [...pack, attempt("review", 6, 8)];
    expect(
      masteryFromReview({
        series,
        isReviewQuiz: true,
        attemptsIncludingThis: withReview,
        alreadyMastered: [],
        score: 6,
        total: 8,
      }).masteredTitle,
    ).toBe("Geography 1");
  });

  it("does not award mastery below 70% or on a non-review quiz", () => {
    const pack = series.quizSlugs.map((slug) => attempt(slug));
    expect(
      masteryFromReview({
        series,
        isReviewQuiz: true,
        attemptsIncludingThis: [...pack, attempt("review", 5, 8)],
        alreadyMastered: [],
        score: 5,
        total: 8,
      }).masteredTitle,
    ).toBeUndefined();
    expect(
      masteryFromReview({
        series,
        isReviewQuiz: false,
        attemptsIncludingThis: pack,
        alreadyMastered: [],
        score: 8,
        total: 8,
      }).masteredTitle,
    ).toBeUndefined();
  });

  it("inserts longform ad breaks every five completed questions for free users", () => {
    expect(
      shouldShowLongformAdBreak({
        isLongform: true,
        premium: false,
        questionsCompleted: 5,
        total: 54,
      }),
    ).toBe(true);
    expect(
      shouldShowLongformAdBreak({
        isLongform: true,
        premium: true,
        questionsCompleted: 5,
        total: 54,
      }),
    ).toBe(false);
    expect(
      shouldShowLongformAdBreak({
        isLongform: true,
        premium: false,
        questionsCompleted: 54,
        total: 54,
      }),
    ).toBe(false);
  });
});
