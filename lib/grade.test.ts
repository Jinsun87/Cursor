import { describe, expect, it } from "vitest";
import { shareScoreText, sittingGrade } from "./grade";

describe("end-card grade", () => {
  it("maps percents onto letters", () => {
    expect(sittingGrade(10, 10).letter).toBe("S");
    expect(sittingGrade(9, 10).letter).toBe("A");
    expect(sittingGrade(8, 10).letter).toBe("B");
    expect(sittingGrade(7, 10).letter).toBe("C");
    expect(sittingGrade(5, 10).letter).toBe("D");
    expect(sittingGrade(2, 10).letter).toBe("F");
  });

  it("builds a share line with score and grade", () => {
    expect(shareScoreText({ title: "U.S. Capitals", score: 5, total: 6, letter: "B" })).toContain(
      "5/6",
    );
    expect(shareScoreText({ title: "U.S. Capitals", score: 5, total: 6, letter: "B" })).toContain("B");
  });
});
