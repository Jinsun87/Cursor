import { describe, expect, it } from "vitest";
import { DAILY_GOAL_SECONDS, addListening, computeStreak, localDayKey } from "./listening";

const GOAL = DAILY_GOAL_SECONDS;

describe("localDayKey", () => {
  it("uses the local calendar day", () => {
    expect(localDayKey(new Date(2026, 9, 5, 23, 59))).toBe("2026-10-05");
    expect(localDayKey(new Date(2026, 0, 1, 0, 1))).toBe("2026-01-01");
  });
});

describe("computeStreak", () => {
  it("counts consecutive days that reached 10 minutes, ending today", () => {
    const log = { "2026-10-03": GOAL, "2026-10-04": GOAL + 30, "2026-10-05": GOAL };
    expect(computeStreak(log, "2026-10-05")).toBe(3);
  });

  it("keeps yesterday's streak while today is still in progress", () => {
    const log = { "2026-10-03": GOAL, "2026-10-04": GOAL, "2026-10-05": 120 };
    expect(computeStreak(log, "2026-10-05")).toBe(2);
  });

  it("resets after a whole day under 10 minutes", () => {
    const log = { "2026-10-02": GOAL, "2026-10-03": 300, "2026-10-04": GOAL };
    expect(computeStreak(log, "2026-10-05")).toBe(1);
    expect(computeStreak({ "2026-10-02": GOAL }, "2026-10-05")).toBe(0);
  });

  it("crosses month and year boundaries", () => {
    const log = { "2025-12-31": GOAL, "2026-01-01": GOAL };
    expect(computeStreak(log, "2026-01-01")).toBe(2);
  });
});

describe("addListening", () => {
  it("adds to today and ignores non-positive or invalid amounts", () => {
    let log = addListening({}, 30, "2026-10-05");
    log = addListening(log, 45.5, "2026-10-05");
    expect(log["2026-10-05"]).toBe(75.5);
    expect(addListening(log, -5, "2026-10-05")).toBe(log);
    expect(addListening(log, Number.NaN, "2026-10-05")).toBe(log);
  });
});
