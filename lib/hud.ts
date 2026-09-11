import { COINS_PER_CORRECT, percentScore } from "./economy";

export function hudAccuracy(correct: number, answered: number) {
  return percentScore(correct, answered);
}

export function hudCoins(correct: number) {
  return correct * COINS_PER_CORRECT;
}

export function nextStreak(current: number, wasCorrect: boolean) {
  return wasCorrect ? current + 1 : 0;
}

export function accuracyTone(pct: number): "low" | "mid" | "high" {
  if (pct < 50) return "low";
  if (pct >= 70) return "high";
  return "mid";
}
