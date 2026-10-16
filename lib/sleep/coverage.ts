import type { HeardWord } from "./align";

const ONES = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split(" ");
const TENS = "_ _ twenty thirty forty fifty sixty seventy eighty ninety".split(" ");

/** 930 → "nine hundred thirty", for comparing the BSB's numerals with what was heard. */
export function numberWords(n: number): string {
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? ` ${ONES[n % 10]}` : "");
  if (n < 1000) return `${ONES[Math.floor(n / 100)]} hundred${n % 100 ? ` ${numberWords(n % 100)}` : ""}`;
  if (n < 1_000_000) return `${numberWords(Math.floor(n / 1000))} thousand${n % 1000 ? ` ${numberWords(n % 1000)}` : ""}`;
  return String(n);
}

/** Words to compare: lower case, numerals spelled out, punctuation and "and" inside numbers dropped. */
export function spokenWords(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/(\d),(\d)/g, "$1$2")
    .replace(/\d+/g, (d) => ` ${numberWords(Number(d))} `)
    .replace(/[’']/g, "")
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export type CoverageIssue = {
  kind: "skipped" | "unheard" | "extra";
  /** Verse the words belong to (for "extra", the verse being read when they were heard). */
  verse: number;
  words: string;
  /** Seconds into the recording, where known. */
  at: number;
};

/**
 * Did the recording say every word? Lines the verse text up against the transcript
 * (longest common subsequence) and reports runs of `minRun` or more words that were
 * not heard, or heard but not in the text.
 *
 * Whisper sometimes drops words the narrator did say. So a run of missing words is
 * "skipped" only when the audio has no room for them; when the transcript has a gap
 * long enough to hold them, they are "unheard" (probably spoken, not transcribed).
 */
export function checkCoverage(
  verses: { n: number; text: string }[],
  transcript: HeardWord[],
  duration: number,
  minRun = 3,
): CoverageIssue[] {
  const expected = verses.flatMap((v) => spokenWords(v.text).map((word) => ({ word, verse: v.n })));
  const heard = transcript.flatMap((w) => spokenWords(w.word).map((word) => ({ word, start: w.start })));
  const n = expected.length;
  const m = heard.length;
  if (!n) return [];
  if (!m) return [{ kind: "skipped", verse: verses[0].n, words: expected.map((e) => e.word).join(" "), at: 0 }];

  // LCS table, filled from the end so the walk below can go forwards.
  const w = m + 1;
  const dp = new Uint16Array((n + 1) * w);
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i * w + j] = expected[i].word === heard[j].word ? dp[(i + 1) * w + j + 1] + 1 : Math.max(dp[(i + 1) * w + j], dp[i * w + j + 1]);
    }
  }

  // Walk the table: matched, missing (in the text, not heard) or extra (heard, not in the text).
  // The narrator's own pace, from the transcript: seconds per word while speaking.
  const secondsPerWord = m > 1 ? (heard[m - 1].start - heard[0].start) / (m - 1) : duration / n;
  const issues: CoverageIssue[] = [];
  let missing: number[] = [];
  let extra: number[] = [];
  let i = 0;
  let j = 0;
  const flush = () => {
    // The same spot heard with a different spelling ("Beer-lahai-roi" as "Bir Lahairoi"): misheard, not missing.
    if (missing.length && extra.length) {
      const said = missing.map((k) => expected[k].word).join("");
      const got = extra.map((k) => heard[k].word).join("");
      if (similarity(said, got) >= 0.6) {
        missing = [];
        extra = [];
        return;
      }
    }
    if (missing.length >= minRun) {
      // Spare time in the transcript around the missing words (a few words either side,
      // since Whisper may hang a stray word on the edge of a gap it dropped).
      const from = Math.max(0, j - 4);
      const to = Math.min(m - 1, j + 1);
      const span = (to > from ? heard[to].start - heard[from].start : 0) || duration;
      const spare = span - (to - from) * secondsPerWord;
      const before = heard[j - 1]?.start ?? 0;
      issues.push({
        kind: spare >= missing.length * secondsPerWord * 0.6 ? "unheard" : "skipped",
        verse: expected[missing[0]].verse,
        words: missing.map((k) => expected[k].word).join(" "),
        at: Math.round(before * 10) / 10,
      });
    }
    if (extra.length >= minRun) {
      issues.push({
        kind: "extra",
        verse: expected[Math.min(i, n - 1)].verse,
        words: extra.map((k) => heard[k].word).join(" "),
        at: Math.round(heard[extra[0]].start * 10) / 10,
      });
    }
    missing = [];
    extra = [];
  };
  while (i < n || j < m) {
    if (i < n && j < m && expected[i].word === heard[j].word) {
      flush();
      i++;
      j++;
    } else if (j >= m || (i < n && dp[(i + 1) * w + j] >= dp[i * w + j + 1])) {
      missing.push(i++);
    } else {
      extra.push(j++);
    }
  }
  flush();
  return issues;
}

/** 1 for identical strings, 0 for nothing in common (by edit distance). */
function similarity(a: string, b: string): number {
  if (!a.length || !b.length) return 0;
  let prev = Array.from({ length: b.length + 1 }, (_, k) => k);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    for (let k = 1; k <= b.length; k++) row[k] = Math.min(prev[k] + 1, row[k - 1] + 1, prev[k - 1] + (a[i - 1] === b[k - 1] ? 0 : 1));
    prev = row;
  }
  return 1 - prev[b.length] / Math.max(a.length, b.length);
}
