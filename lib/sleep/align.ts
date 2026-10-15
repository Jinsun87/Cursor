/** Lower-case words with punctuation removed (apostrophes kept), as compared during alignment. */
export const words = (s: string) => s.toLowerCase().replace(/[^a-z\s']/g, " ").split(/\s+/).filter(Boolean);

export type HeardWord = { word: string; start: number };

/**
 * Verse start times from a transcript's word timestamps.
 *
 * Each verse starts where its first words are heard, near where the running word count says it
 * should be. Whisper can merge or drop words (sometimes several seconds of them), so it searches a
 * window either side, accepts 2 of the first 3 words, re-syncs on every match, and after a miss
 * looks further back by the words it skipped. Verses it can't find are placed between their
 * neighbours in proportion to their length.
 */
export function alignVerses(
  verses: { n: number; text: string }[],
  transcript: HeardWord[],
  duration: number,
): { timing: Record<string, number>; missed: number } {
  const heard = transcript.map((w) => ({ word: words(w.word).join("").replace(/'/g, ""), start: w.start }));
  const toks = verses.map((v) => words(v.text).map((t) => t.replace(/'/g, "")));
  const starts: (number | null)[] = [];
  let cursor = 0;
  let slack = 0; // words skipped since the last verse that was found
  let lastStart = -1;
  for (const vt of toks) {
    const probe = vt.slice(0, 3);
    const need = Math.min(2, probe.length);
    let at = -1;
    let best = 0;
    for (let i = Math.max(0, cursor - 15 - slack); i < Math.min(heard.length, cursor + 40); i++) {
      if (heard[i].start <= lastStart) continue;
      const score = probe.filter((t, k) => heard[i + k]?.word === t).length;
      if (score >= need && (score > best || (score === best && Math.abs(i - cursor) < Math.abs(at - cursor)))) {
        best = score;
        at = i;
      }
    }
    if (at < 0) {
      starts.push(null);
      slack += vt.length;
      cursor += vt.length;
      continue;
    }
    lastStart = heard[at].start;
    starts.push(lastStart);
    slack = 0;
    cursor = at + vt.length;
  }

  // Fill each run of missed verses between the found verses either side, by word count.
  let missed = 0;
  for (let i = 0; i < starts.length; i++) {
    if (starts[i] !== null) continue;
    let j = i;
    while (j < starts.length && starts[j] === null) j++;
    const from = i > 0 ? starts[i - 1]! : 0;
    const to = j < starts.length ? starts[j]! : duration;
    const lens = toks.slice(i - (i > 0 ? 1 : 0), j).map((t) => t.length);
    const total = lens.reduce((a, b) => a + b, 0) || 1;
    let acc = i > 0 ? lens[0] : 0;
    for (let k = i; k < j; k++) {
      starts[k] = from + ((to - from) * acc) / total;
      acc += toks[k].length;
      missed++;
    }
    i = j;
  }

  // Never step backwards; keep verses at least half a second apart.
  const timing: Record<string, number> = {};
  let prev = -1;
  verses.forEach((v, i) => {
    prev = Math.max(starts[i]!, prev + 0.5);
    timing[String(v.n)] = Math.round(prev * 100) / 100;
  });
  return { timing, missed };
}
