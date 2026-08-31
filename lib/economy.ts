import type { Attempt, Series } from "./types";

export const SIGNUP_COINS = 100;
export const PREMIUM_COIN_GRANT = 5000;
export const COINS_PER_CORRECT = 10;
export const DEFAULT_COMPLETE_COINS = 50;
export const DONATION_COINS_PER_CENT = 0.1;
/** Free users on longform quizzes see a mid-roll ad every N completed items (Grizly-style pagination). */
export const LONGFORM_AD_EVERY = 5;

export function shouldShowLongformAdBreak(input: {
  isLongform?: boolean;
  premium?: boolean;
  questionsCompleted: number;
  total: number;
}) {
  if (!input.isLongform || input.premium) return false;
  if (input.questionsCompleted <= 0 || input.questionsCompleted >= input.total) return false;
  return input.questionsCompleted % LONGFORM_AD_EVERY === 0;
}

export function percentScore(score: number, total: number) {
  return total ? Math.round((score / total) * 100) : 0;
}

export function coinsForAttempt(baseComplete: number, correctAnswers: number) {
  return baseComplete + correctAnswers * COINS_PER_CORRECT;
}

export function coinsForDonation(cents: number) {
  return Math.floor(cents * DONATION_COINS_PER_CENT);
}

export function bestAttempt(attempts: Attempt[], quizSlug: string) {
  return attempts
    .filter((a) => a.quizSlug === quizSlug)
    .sort((a, b) => b.score / b.total - a.score / a.total)[0];
}

export function packQuizzesComplete(series: Series, attempts: Attempt[]) {
  return series.quizSlugs.filter((slug) => attempts.some((a) => a.quizSlug === slug)).length;
}

export function canTakeReview(series: Series, attempts: Attempt[]) {
  return packQuizzesComplete(series, attempts) === series.quizSlugs.length;
}

export function masteryFromReview(input: {
  series: Series;
  isReviewQuiz: boolean;
  attemptsIncludingThis: Attempt[];
  alreadyMastered: string[];
  score: number;
  total: number;
}): { masteredTitle?: string } {
  if (!input.isReviewQuiz) return {};
  if (input.alreadyMastered.includes(input.series.slug)) return {};
  if (!canTakeReview(input.series, input.attemptsIncludingThis)) return {};
  if (percentScore(input.score, input.total) < input.series.masteryThreshold) return {};
  return { masteredTitle: input.series.title };
}
