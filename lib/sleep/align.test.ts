import { describe, expect, it } from "vitest";
import { alignVerses, words } from "./align";

/** A transcript reading `texts` one word every half second, leaving out the words `drop` says. */
function transcript(texts: string[], drop: (verse: number, word: number) => boolean = () => false) {
  const out: { word: string; start: number }[] = [];
  let t = 0;
  texts.forEach((text, v) =>
    words(text).forEach((w, k) => {
      if (!drop(v, k)) out.push({ word: w, start: t });
      t += 0.5;
    }),
  );
  return out;
}

const texts = [
  "In the beginning God created the heavens and the earth.",
  "Now the earth was formless and void, and darkness was over the surface of the deep.",
  "And God said, “Let there be light,” and there was light.",
  "God saw that the light was good, and He separated the light from the darkness.",
  "God called the light “day,” and the darkness He called “night.”",
  "And there was evening, and there was morning—the first day.",
];
const verses = texts.map((text, i) => ({ n: i + 1, text }));
// Where each verse really starts in the transcript above.
const truth = texts.map((_, i) => texts.slice(0, i).reduce((a, t) => a + words(t).length * 0.5, 0));

describe("alignVerses", () => {
  it("finds every verse in a clean transcript", () => {
    const { timing, missed } = alignVerses(verses, transcript(texts), 40);
    expect(missed).toBe(0);
    expect(Object.values(timing)).toEqual(truth);
  });

  it("recovers after the transcript drops a stretch of words, and places the lost verse between its neighbours", () => {
    // The end of verse 2 and the start of verse 3 are missing, as Whisper sometimes does.
    const heard = transcript(texts, (v, k) => (v === 1 && k > 4) || (v === 2 && k < 4));
    const { timing, missed } = alignVerses(verses, heard, 40);
    expect(missed).toBe(1);
    for (const n of [1, 2, 4, 5, 6]) expect(timing[n]).toBe(truth[n - 1]);
    expect(timing[3]).toBeGreaterThan(timing[2]);
    expect(timing[3]).toBeLessThan(timing[4]);
  });

  it("spreads verses missing at the end up to the end of the audio", () => {
    const heard = transcript(texts, (v) => v >= 4);
    const { timing, missed } = alignVerses(verses, heard, 40);
    expect(missed).toBe(2);
    expect(timing[4]).toBe(truth[3]);
    expect(timing[5]).toBeGreaterThan(timing[4]);
    expect(timing[6]).toBeGreaterThan(timing[5]);
    expect(timing[6]).toBeLessThan(40);
  });
});
