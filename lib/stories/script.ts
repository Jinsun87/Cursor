/**
 * Reads a Bible story script (content/stories/<series>/<slug>.md) into what the
 * voice reads: pieces of narration split at each [pause], each with the silence
 * that follows it and the section it belongs to. The format is described in
 * docs/stories/WRITING-PLAN.md; scripts/check-story.ts checks the same files.
 */
export const PAUSE_SECONDS = { "[pause]": 4, "[long pause]": 10 } as const;
/** Silence before the first words of every episode. */
export const LEAD_SECONDS = 1.5;
/** ElevenLabs pcm_24000: 16-bit mono, as the voice takes are cached. */
export const PCM_RATE = 24000;
/** A section heading with no pause marker before it still gets a short breath. */
export const SECTION_GAP_SECONDS = 2.4;

export type StoryPiece = { text: string; section: string; pauseAfter: number };
export type StoryScript = { meta: Record<string, string>; pieces: StoryPiece[] };

export function parseStory(raw: string): StoryScript {
  const text = raw.replace(/\r\n/g, "\n");
  const front = text.match(/^---\n([\s\S]*?)\n---\n/);
  const meta = Object.fromEntries(
    (front?.[1] ?? "").split("\n").map((l) => [l.slice(0, l.indexOf(":")).trim(), l.slice(l.indexOf(":") + 1).trim()]),
  );
  let body = text.slice(front?.[0].length ?? 0);
  const cut = body.search(/^## Fact check/m);
  if (cut >= 0) body = body.slice(0, cut);

  const pieces: StoryPiece[] = [];
  let lines: string[] = [];
  let section = "";
  const flush = (pause: number) => {
    if (lines.length) pieces.push({ text: lines.join("\n\n"), section, pauseAfter: pause });
    else if (pieces.length) pieces[pieces.length - 1].pauseAfter = Math.max(pieces[pieces.length - 1].pauseAfter, pause);
    lines = [];
  };
  for (const line of body.split("\n")) {
    const t = line.trim();
    if (!t) continue;
    if (t.startsWith("## ")) {
      flush(SECTION_GAP_SECONDS);
      section = t.slice(3).trim();
      continue;
    }
    if (t in PAUSE_SECONDS) {
      flush(PAUSE_SECONDS[t as keyof typeof PAUSE_SECONDS]);
      continue;
    }
    // Spoken text only: no quote markers, no references.
    lines.push(t.replace(/^>\s*/, "").replace(/\s*\[[^\]]+\]/g, "").trim());
  }
  flush(0);
  return { meta, pieces };
}

/** The ElevenLabs voice id in a script's "voice: Name (id)" line. */
export function voiceId(meta: Record<string, string>): string {
  const id = meta.voice?.match(/\(([A-Za-z0-9]+)\)/)?.[1];
  if (!id) throw new Error(`No voice id in "voice: ${meta.voice ?? ""}"`);
  return id;
}
