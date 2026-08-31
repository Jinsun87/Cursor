import { describe, expect, it } from "vitest";
import { shuffleQuestionChoices, shuffleQuizDeck } from "./shuffle";

describe("choice shuffle", () => {
  it("keeps the same correct string after shuffling", () => {
    const question = {
      prompt: "Capital?",
      choices: ["A", "B", "C", "D"],
      answerIndex: 0,
      explanation: "A is right.",
    };
    let seq = [0.9, 0.1, 0.5, 0.2];
    const shuffled = shuffleQuestionChoices(question, () => seq.shift() ?? 0);
    expect(shuffled.choices[shuffled.answerIndex]).toBe("A");
    expect(new Set(shuffled.choices)).toEqual(new Set(question.choices));
  });

  it("can move the correct answer off slot zero", () => {
    const question = {
      prompt: "x",
      choices: ["right", "w1", "w2", "w3"],
      answerIndex: 0,
      explanation: "fact",
    };
    const shuffled = shuffleQuestionChoices(question, () => 0);
    expect(shuffled.choices[0]).not.toBe("right");
    expect(shuffled.choices[shuffled.answerIndex]).toBe("right");
  });

  it("shuffles every item in a deck", () => {
    const deck = shuffleQuizDeck(
      [
        { prompt: "1", choices: ["a", "b", "c", "d"], answerIndex: 0, explanation: "a" },
        { prompt: "2", choices: ["a", "b", "c", "d"], answerIndex: 2, explanation: "c" },
      ],
      () => 0.99,
    );
    expect(deck[0].choices[deck[0].answerIndex]).toBe("a");
    expect(deck[1].choices[deck[1].answerIndex]).toBe("c");
  });
});
