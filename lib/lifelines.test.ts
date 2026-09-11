import { describe, expect, it } from "vitest";
import { fiftyFiftyHidden } from "./lifelines";

describe("50/50 lifeline", () => {
  it("hides two wrong indexes and keeps the answer", () => {
    const hidden = fiftyFiftyHidden(2, 4, () => 0);
    expect(hidden).toHaveLength(2);
    expect(hidden.includes(2)).toBe(false);
    expect(new Set(hidden).size).toBe(2);
  });
});
