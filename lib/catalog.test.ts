import { describe, expect, it } from "vitest";
import { CATEGORIES, QUIZZES, SERIES, getQuiz, getSeries } from "./catalog";

describe("catalog integrity", () => {
  it("has unique category, series, and quiz slugs", () => {
    const cats = CATEGORIES.map((c) => c.slug);
    const series = SERIES.map((s) => s.slug);
    const quizzes = QUIZZES.map((q) => q.slug);
    expect(new Set(cats).size).toBe(cats.length);
    expect(new Set(series).size).toBe(series.length);
    expect(new Set(quizzes).size).toBe(quizzes.length);
  });

  it("points every series quiz and review at a real item", () => {
    for (const series of SERIES) {
      expect(series.masteryThreshold).toBe(70);
      expect(getSeries(series.slug)?.title).toBe(series.title);
      for (const slug of series.quizSlugs) {
        const quiz = getQuiz(slug);
        expect(quiz, slug).toBeTruthy();
        expect(quiz?.seriesSlug).toBe(series.slug);
        expect(quiz?.isReview).toBeFalsy();
      }
      const review = getQuiz(series.reviewSlug);
      expect(review, series.reviewSlug).toBeTruthy();
      expect(review?.isReview).toBe(true);
      expect(review?.seriesSlug).toBe(series.slug);
    }
  });

  it("keeps questions well-formed", () => {
    for (const quiz of QUIZZES) {
      expect(quiz.questions.length).toBeGreaterThanOrEqual(4);
      for (const question of quiz.questions) {
        expect(question.choices.length).toBe(4);
        expect(question.answerIndex).toBeGreaterThanOrEqual(0);
        expect(question.answerIndex).toBeLessThan(4);
        expect(new Set(question.choices).size).toBe(4);
        expect(question.explanation.length).toBeGreaterThan(3);
      }
    }
  });

  it("ships a 50+ question restaurant flagship for long sessions", () => {
    const quiz = getQuiz("get-your-fill-restaurant");
    expect(quiz?.isLongform).toBe(true);
    expect(quiz?.questions.length).toBeGreaterThanOrEqual(50);
    expect(quiz?.category).toBe("food");
  });

  it("marks secret quizzes and at least one daily generator", () => {
    expect(QUIZZES.filter((q) => q.isSecret).length).toBeGreaterThanOrEqual(2);
    const daily = getQuiz("daily-fixture");
    expect(daily?.isDaily).toBe(true);
    expect(daily?.questions.length).toBe(6);
  });
});
