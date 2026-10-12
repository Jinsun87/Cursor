import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { pickNext, readProgress, saveProgress } from "./progress";

const chapters = [{ slug: "genesis-1" }, { slug: "genesis-2" }, { slug: "genesis-3" }];

// The tests run in Node: give saveProgress a small in-memory localStorage and window.
beforeEach(() => {
  const store = new Map<string, string>();
  Object.assign(globalThis, {
    localStorage: {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k),
    },
    window: { dispatchEvent: () => true },
  });
});

afterEach(() => vi.useRealTimers());

describe("pickNext", () => {
  it("starts at the first chapter with no history", () => {
    expect(pickNext(chapters, {})).toEqual({ chapter: chapters[0], verse: 1 });
  });

  it("continues a chapter left part-way, from that verse", () => {
    saveProgress("genesis-2", 14);
    expect(pickNext(chapters, readProgress())).toEqual({ chapter: chapters[1], verse: 14 });
  });

  it("moves on to the next chapter once one is finished", () => {
    saveProgress("genesis-1", 1, true);
    expect(pickNext(chapters, readProgress())).toEqual({ chapter: chapters[1], verse: 1 });
  });

  it("stays on a finished chapter that is being heard again, even paused at verse 1", () => {
    saveProgress("genesis-1", 1, true);
    saveProgress("genesis-1", 1); // replay started, then paused straight away
    expect(pickNext(chapters, readProgress())).toEqual({ chapter: chapters[0], verse: 1 });
  });

  it("follows the most recently read chapter", () => {
    vi.useFakeTimers();
    vi.setSystemTime(1000);
    saveProgress("genesis-3", 5);
    vi.setSystemTime(2000);
    saveProgress("genesis-1", 9);
    expect(pickNext(chapters, readProgress()).chapter).toBe(chapters[0]);
  });
});
