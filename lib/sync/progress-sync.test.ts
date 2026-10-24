import { describe, expect, it } from "vitest";
import { otherDevices } from "./progress-sync";
import { combineLogs, computeStreak, DAILY_GOAL_SECONDS } from "@/lib/listening";
import { mergeProgress } from "@/lib/sleep/progress";

describe("listening across devices", () => {
  it("takes this device's own minutes out of the account total", () => {
    // The account says 700 s today (300 here, 400 on the phone) and 500 yesterday, all from here.
    const others = otherDevices({ "2026-10-24": 700, "2026-10-23": 500 }, { "2026-10-24": 300, "2026-10-23": 500 });
    expect(others).toEqual({ "2026-10-24": 400 });
  });

  it("never counts the same minutes twice when this device listens more after a sync", () => {
    const sent = { "2026-10-24": 300 };
    const others = otherDevices({ "2026-10-24": 700 }, sent);
    // Ten more minutes here after the sync: 300 + 600 own, 400 from the phone.
    const total = combineLogs({ "2026-10-24": 900 }, others);
    expect(total["2026-10-24"]).toBe(1300);
  });

  it("lights the lamp from minutes split across two devices", () => {
    const own = { "2026-10-24": DAILY_GOAL_SECONDS / 2 };
    const others = { "2026-10-24": DAILY_GOAL_SECONDS / 2, "2026-10-23": DAILY_GOAL_SECONDS };
    expect(computeStreak(combineLogs(own, others), "2026-10-24")).toBe(2);
    expect(computeStreak(own, "2026-10-24")).toBe(0);
  });
});

describe("reading position across devices", () => {
  it("keeps the more recent place in each chapter", () => {
    const local = { "genesis-3": { verse: 14, done: false, at: 2000 }, "genesis-4": { verse: 1, done: true, at: 1000 } };
    const remote = { "genesis-3": { verse: 2, done: false, at: 1500 }, "genesis-4": { verse: 9, done: false, at: 3000 }, "exodus-1": { verse: 5, done: false, at: 2500 } };
    expect(mergeProgress(local, remote)).toEqual({
      "genesis-3": { verse: 14, done: false, at: 2000 },
      "genesis-4": { verse: 9, done: false, at: 3000 },
      "exodus-1": { verse: 5, done: false, at: 2500 },
    });
  });
});
