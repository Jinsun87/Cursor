/**
 * Paints the new story paintings listed in content/stories/paintings.ts ("new:<id>" entries)
 * into public/images/story/<slug>/<id>.jpg, skipping any already painted, then the
 * episodes pick them up on the next scripts/story-build.ts. Same model, size and rules as
 * the chapter paintings: NIGHT_STYLE for Old Testament stories, GOSPEL_STYLE (with Jesus
 * from the character sheet) for the Gospels. Needs gcloud auth application-default login.
 *
 *   npx tsx scripts/story-paint.ts [slug] [--redo]
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { NIGHT_STYLE } from "../content/sleep/genesis";
import { GOSPEL_STYLE } from "../content/sleep/john";
import { STORY_ART } from "../content/stories/paintings";
import { generateVertexImage } from "../lib/ai/vertex-imagen";
import { withRetry } from "./lib/with-retry";

const only = process.argv.slice(2).find((a) => !a.startsWith("--"));
const redo = process.argv.includes("--redo");

async function main() {
  const jobs = Object.entries(STORY_ART)
    .filter(([slug]) => !only || slug === only)
    .flatMap(([slug, art]) => Object.entries(art.paint ?? {}).map(([id, p]) => ({ slug, id, ...p, style: art.style })));
  let painted = 0;
  for (const [k, job] of jobs.entries()) {
    const dir = join("public", "images", "story", job.slug);
    const file = join(dir, `${job.id}.jpg`);
    if (existsSync(file) && !redo) continue;
    mkdirSync(dir, { recursive: true });
    process.stdout.write(`\r  ${k + 1}/${jobs.length} ${job.slug}/${job.id}          `);
    const cast = job.cast ?? [];
    const references = cast.map((name) => ({ mimeType: "image/jpeg", data: readFileSync(join("content", "sleep", "characters", `${name}.jpg`)) }));
    const castNote = cast.length
      ? " The attached character sheet shows the man in this scene: paint him with exactly that face, hair, beard, build and clothing, but do not copy the sheet's layout, poses or plain background."
      : "";
    const style = job.style === "gospel" ? GOSPEL_STYLE : NIGHT_STYLE;
    const [img] = await withRetry(() =>
      generateVertexImage({ prompt: `${job.prompt}${castNote} ${style}`, aspectRatio: "9:16", stylePreset: "none", references }),
    );
    const raw = `${file}.raw`;
    writeFileSync(raw, img.buffer);
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", raw, "-vf", "scale=768:-2", "-q:v", "4", file]);
    rmSync(raw);
    painted++;
  }
  console.log(`\n${painted} painted. Review every one by eye, then run: npx tsx scripts/story-build.ts`);
}

main().catch((e) => {
  console.error(`\n${String(e).slice(0, 400)}`);
  process.exit(1);
});
