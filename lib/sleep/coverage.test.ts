import { describe, expect, it } from "vitest";
import { checkCoverage, numberWords, spokenWords } from "./coverage";

const verses = [
  { n: 1, text: "So Adam lived a total of 930 years, and then he died." },
  { n: 2, text: "When Seth was 105 years old, he became the father of Enosh." },
  { n: 3, text: "And after he had become the father of Enosh, Seth lived 807 years and had other sons and daughters." },
];

/** A transcript of `text`, one word every `step` seconds, with optional pauses before given word positions. */
function heard(text: string, step = 0.4, pauses: Record<number, number> = {}) {
  let t = 0;
  return text.split(/\s+/).map((word, k) => {
    t += pauses[k] ?? 0;
    const w = { word, start: t };
    t += step;
    return w;
  });
}

const full = verses.map((v) => v.text).join(" ");

describe("spokenWords", () => {
  it("spells numerals out so they compare with what was heard", () => {
    expect(numberWords(930)).toBe("nine hundred thirty");
    expect(numberWords(105)).toBe("one hundred five");
    expect(numberWords(12000)).toBe("twelve thousand");
    expect(spokenWords("Adam lived 930 years.")).toEqual(["adam", "lived", "nine", "hundred", "thirty", "years"]);
    expect(spokenWords("Abraham’s servant")).toEqual(["abrahams", "servant"]);
  });
});

describe("checkCoverage", () => {
  it("passes a reading that says every word, numerals heard as digits or words", () => {
    expect(checkCoverage(verses, heard(full), 60)).toEqual([]);
    const spelled = full.replace("930", "nine hundred and thirty").replace("105", "a hundred and five");
    expect(checkCoverage(verses, heard(spelled), 60)).toEqual([]);
  });

  it("reports a phrase the narrator skipped", () => {
    const text = full.replace("he became the father of Enosh", "");
    const issues = checkCoverage(verses, heard(text), 60);
    expect(issues).toHaveLength(1);
    expect(issues[0]).toMatchObject({ kind: "skipped", verse: 2, words: "he became the father of enosh" });
  });

  it("calls missing words unheard when the audio had room for them", () => {
    // The same words missing from the transcript, but with a gap where they were spoken.
    const text = full.replace("he became the father of Enosh", "");
    const gapAt = text.split(/\s+/).indexOf("And");
    const issues = checkCoverage(verses, heard(text, 0.4, { [gapAt]: 2.6 }), 60);
    expect(issues).toHaveLength(1);
    expect(issues[0]).toMatchObject({ kind: "unheard", verse: 2 });
  });

  it("reports words read twice", () => {
    const text = full.replace("Seth lived 807 years", "Seth lived 807 years Seth lived 807 years");
    const issues = checkCoverage(verses, heard(text), 60);
    expect(issues.map((x) => x.kind)).toEqual(["extra"]);
    expect(issues[0].verse).toBe(3);
  });

  it("treats a name heard with another spelling as said", () => {
    const named = [{ n: 1, text: "Now Isaac had just returned from Beer-lahai-roi, for he was living in the Negev." }];
    expect(checkCoverage(named, heard("Now Isaac had just returned from Bir Lahairoi for he was living in the Negev"), 10)).toEqual([]);
  });

  it("ignores a single misheard word", () => {
    expect(checkCoverage(verses, heard(full.replace("Enosh,", "Enoch,")), 60)).toEqual([]);
  });
});
