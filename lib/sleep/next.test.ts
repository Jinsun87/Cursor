import { describe, expect, it } from "vitest";
import { nextChapter } from "./next";
import type { SleepChapter } from "./types";

const ch = (slug: string) => ({ slug }) as SleepChapter;
const chapters = [ch("genesis-49"), ch("genesis-50"), ch("exodus-1"), ch("exodus-2")];

describe("nextChapter", () => {
  it("plays on to the next chapter, across into the next book", () => {
    expect(nextChapter("genesis-49", "sleep", chapters, {})?.slug).toBe("genesis-50");
    expect(nextChapter("genesis-50", "sleep", chapters, {})?.slug).toBe("exodus-1");
  });

  it("skips chapters with no Walk recording when in Walk", () => {
    expect(nextChapter("genesis-50", "walk", chapters, { "exodus-2": 300 })?.slug).toBe("exodus-2");
  });

  it("stops after the last recorded chapter", () => {
    expect(nextChapter("exodus-2", "sleep", chapters, {})).toBeNull();
    expect(nextChapter("unknown", "sleep", chapters, {})).toBeNull();
  });

  it("uses the real catalogue in Bible order", () => {
    expect(nextChapter("genesis-1", "sleep")?.slug).toBe("genesis-2");
    expect(nextChapter("genesis-50", "walk")?.slug).toBe("exodus-1");
  });
});
