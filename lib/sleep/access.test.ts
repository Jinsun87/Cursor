import { describe, expect, it } from "vitest";
import { canListen, isPremiumBook } from "./access";

describe("access", () => {
  it("keeps Genesis free and Exodus for Premium, as the shelf says", () => {
    expect(isPremiumBook("Genesis")).toBe(false);
    expect(isPremiumBook("Exodus")).toBe(true);
  });

  it("keeps both story series for Premium members", () => {
    expect(isPremiumBook("Women of the Bible")).toBe(true);
    expect(isPremiumBook("Bedtime Bible Stories")).toBe(true);
    expect(canListen({ book: "Bedtime Bible Stories" }, false)).toBe(false);
    expect(canListen({ book: "Bedtime Bible Stories" }, true)).toBe(true);
  });

  it("treats books not on the shelf as Premium", () => {
    expect(isPremiumBook("Psalm")).toBe(true);
  });

  it("lets Premium members hear everything and everyone hear Genesis", () => {
    expect(canListen({ book: "Exodus" }, true)).toBe(true);
    expect(canListen({ book: "Exodus" }, false)).toBe(false);
    expect(canListen({ book: "Genesis" }, false)).toBe(true);
  });
});

describe("books named differently in the data", () => {
  it("finds Psalms by its data name, Psalm, and keeps it Premium", () => {
    expect(isPremiumBook("Psalm")).toBe(true);
    expect(canListen({ book: "Psalm" }, false)).toBe(false);
    expect(canListen({ book: "Psalm" }, true)).toBe(true);
  });
});
