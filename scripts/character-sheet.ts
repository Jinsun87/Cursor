/**
 * Paints character reference sheets: one painting showing a figure from several sides, so the
 * scenes that use it as a reference keep the same face, build and clothing.
 *
 *   npx tsx scripts/character-sheet.ts jesus [count] [outDir] [firstNumber]
 *
 * Writes <outDir>/<name>-1.jpg … (default outDir: scratchpad-style ./.work/characters) to choose
 * from; the chosen one is copied to content/sleep/characters/<name>.jpg by hand.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { generateVertexImage } from "../lib/ai/vertex-imagen";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const m = line.match(/^(GCP_PROJECT_ID|VERTEX_LOCATION|VERTEX_MODEL)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}

const SHEET_STYLE =
  "A character reference sheet painted as one classical oil study on a plain warm dark-brown background: " +
  "the same man shown four times side by side, all the same size and the same clothing, evenly spaced: " +
  "full length from the front, full length in profile facing left, full length from behind, and a head-and-shoulders study. " +
  "Rembrandt and Caravaggio inspired, chiaroscuro, warm gold light, museum quality. " +
  "No halo, no glow around the head, no crosses, no text, no labels, no captions, no watermarks, no frame, no modern elements.";

const CHARACTERS: Record<string, string> = {
  jesus:
    "Jesus of Nazareth as a first-century Galilean Jewish man of about thirty: olive-brown skin weathered by sun, " +
    "dark brown eyes, thick dark-brown hair to just below the ears, a short full dark beard, a lean working man's build, calm and kind expression. " +
    "He wears a plain knee-length tunic of undyed cream wool, a simple brown woven wool cloak over one shoulder, a plain leather belt and worn leather sandals. " +
    "Not European, not fair-haired, not a white or red robe.",
};

/** Vertex allows only a few images a minute (and the book pipeline may be painting too): wait and try again on 429. */
async function paintWithRetry(prompt: string) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await generateVertexImage({ prompt, aspectRatio: "16:9", stylePreset: "none" });
    } catch (e) {
      if (!(e instanceof Error && /429|RESOURCE_EXHAUSTED/.test(e.message)) || attempt >= 8) throw e;
      await new Promise((r) => setTimeout(r, 20_000 * attempt));
    }
  }
}

async function main() {
  const name = process.argv[2];
  const count = Number(process.argv[3] ?? 4);
  const outDir = process.argv[4] ?? join(".work", "characters");
  const who = CHARACTERS[name];
  if (!who) throw new Error(`Usage: npx tsx scripts/character-sheet.ts <${Object.keys(CHARACTERS).join("|")}> [count] [outDir]`);
  mkdirSync(outDir, { recursive: true });
  const first = Number(process.argv[5] ?? 1);
  for (let i = first; i < first + count; i++) {
    const [img] = await paintWithRetry(`${who} ${SHEET_STYLE}`);
    const file = join(outDir, `${name}-${i}.jpg`);
    writeFileSync(file, img.buffer);
    console.log(`  ${file}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
