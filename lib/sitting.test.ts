import { describe, expect, it } from "vitest";
import {
  clearSitting,
  isFreshSitting,
  loadSitting,
  medalsPlated,
  saveSitting,
  sittingIsResumable,
  sittingKey,
  type Sitting,
} from "./sitting";

function mem() {
  const data = new Map<string, string>();
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => {
      data.set(k, v);
    },
    removeItem: (k: string) => {
      data.delete(k);
    },
  };
}

const sitting: Sitting = {
  slug: "us-capitals",
  index: 2,
  picked: 1,
  correctCount: 1,
  answered: 2,
  streak: 0,
  pageBreak: false,
  deck: [
    { prompt: "a", choices: ["1", "2", "3", "4"], answerIndex: 0, explanation: "x" },
    { prompt: "b", choices: ["1", "2", "3", "4"], answerIndex: 1, explanation: "x" },
    { prompt: "c", choices: ["1", "2", "3", "4"], answerIndex: 2, explanation: "x" },
  ],
  savedAt: new Date().toISOString(),
};

describe("sitting save", () => {
  it("round-trips a mid-quiz sitting", () => {
    const storage = mem();
    saveSitting(sitting, storage);
    expect(loadSitting("us-capitals", storage)?.index).toBe(2);
    expect(loadSitting("us-capitals", storage)?.picked).toBe(1);
    clearSitting("us-capitals", storage);
    expect(loadSitting("us-capitals", storage)).toBeNull();
  });

  it("rejects a sitting for another quiz or a stale clock", () => {
    expect(sittingIsResumable(sitting, "other", 3)).toBe(false);
    expect(sittingIsResumable(sitting, "us-capitals", 3)).toBe(true);
    expect(sittingIsResumable({ ...sitting, deck: sitting.deck.slice(0, 1) }, "us-capitals", 3)).toBe(
      false,
    );
    expect(isFreshSitting(new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString())).toBe(false);
    expect(sittingKey("us-capitals")).toContain("us-capitals");
  });

  it("awards a plate every five answers", () => {
    expect(medalsPlated(0, 5)).toBe(0);
    expect(medalsPlated(4, 5)).toBe(0);
    expect(medalsPlated(5, 5)).toBe(1);
    expect(medalsPlated(11, 5)).toBe(2);
    expect(medalsPlated(54, 5)).toBe(10);
    expect(medalsPlated(54, 5, 54)).toBe(11);
  });
});
