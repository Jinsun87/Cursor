import { percentScore } from "./economy";

export type SittingGrade = {
  letter: "S" | "A" | "B" | "C" | "D" | "F";
  title: string;
};

export function sittingGrade(score: number, total: number): SittingGrade {
  const pct = percentScore(score, total);
  if (pct >= 95) return { letter: "S", title: "Master sitting" };
  if (pct >= 90) return { letter: "A", title: "Sharp" };
  if (pct >= 80) return { letter: "B", title: "Solid" };
  if (pct >= 70) return { letter: "C", title: "Passing" };
  if (pct >= 50) return { letter: "D", title: "Cold start" };
  return { letter: "F", title: "Back to prep" };
}

export function shareScoreText(input: {
  title: string;
  score: number;
  total: number;
  letter: string;
  url?: string;
}) {
  const pct = percentScore(input.score, input.total);
  const url = input.url ? ` ${input.url}` : "";
  return `I scored ${input.score}/${input.total} (${pct}%, ${input.letter}) on ${input.title} at QuizForge.${url}`;
}
