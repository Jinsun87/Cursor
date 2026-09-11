import { describe, expect, it } from "vitest";
import { accuracyTone, hudAccuracy, hudCoins, nextStreak } from "./hud";

describe("quiz HUD", () => {
  it("starts at zero until something is answered", () => {
    expect(hudAccuracy(0, 0)).toBe(0);
    expect(hudCoins(0)).toBe(0);
  });

  it("tracks live accuracy and session coins", () => {
    expect(hudAccuracy(1, 1)).toBe(100);
    expect(hudAccuracy(1, 2)).toBe(50);
    expect(hudCoins(3)).toBe(30);
  });

  it("builds a streak on hits and snaps it on a miss", () => {
    expect(nextStreak(0, true)).toBe(1);
    expect(nextStreak(4, true)).toBe(5);
    expect(nextStreak(5, false)).toBe(0);
  });

  it("colors accuracy so a cold start reads as a warning", () => {
    expect(accuracyTone(0)).toBe("low");
    expect(accuracyTone(49)).toBe("low");
    expect(accuracyTone(50)).toBe("mid");
    expect(accuracyTone(70)).toBe("high");
  });
});
