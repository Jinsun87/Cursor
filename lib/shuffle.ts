import type { Question } from "./types";

export function shuffleQuestionChoices(
  question: Question,
  random: () => number = Math.random,
): Question {
  const order = question.choices.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return {
    ...question,
    choices: order.map((i) => question.choices[i]),
    answerIndex: order.indexOf(question.answerIndex),
  };
}

export function shuffleQuizDeck(
  questions: Question[],
  random: () => number = Math.random,
): Question[] {
  return questions.map((question) => shuffleQuestionChoices(question, random));
}
