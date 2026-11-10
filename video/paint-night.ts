/**
 * Paintings for the Night Stories reels (Bible For Sleep page), in the same style as the Sleep chapters.
 *   npx tsx video/paint-night.ts            # paint any that are missing
 *   npx tsx video/paint-night.ts --redo samuel/lamp
 * Writes public/images/story/<story>/<name>.jpg (768 wide).
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { generateVertexImage } from "../lib/ai/vertex-imagen";
import { NIGHT_STYLE } from "../content/sleep/genesis";
import { GOSPEL_STYLE } from "../content/sleep/john";

const ROOT = resolve(__dirname, "..");

type Painting = { path: string; prompt: string; jesus?: boolean };

const PAINTINGS: Painting[] = [
  {
    path: "samuel/sleeping",
    prompt: "A boy lying on a simple woven mat on the floor of an ancient tent sanctuary at night, a tall lampstand burning low beside a heavy curtain, seen from far across the room.",
  },
  {
    path: "samuel/lamp",
    prompt: "A single golden lampstand burning low in a dark ancient sanctuary, warm light on a woven curtain and the stone floor; no people.",
  },
  {
    path: "elijah/broom-tree",
    prompt: "A weary prophet in a rough camel-hair cloak asleep under a broom tree in the desert wilderness at dusk, seen from a distance.",
  },
  {
    path: "elijah/bread",
    prompt: "A round loaf baking on hot stones and a clay jar of water on the sand beneath a broom tree at night, a sleeping figure in a cloak beyond them, soft light falling from above.",
  },
  {
    path: "paul-and-silas/midnight",
    prompt: "Two men in a dark stone prison cell at midnight, their feet held in wooden stocks, faces lifted as they sing, a thin shaft of moonlight from a high barred window, seen from a distance.",
  },
  {
    path: "paul-and-silas/doors",
    prompt: "The heavy wooden doors of an ancient prison standing open at night, loose chains on the stone floor, dust hanging in the moonlight; no people.",
  },
  {
    path: "peter-in-prison/sleeping",
    prompt: "A bearded fisherman asleep on the floor of a dark stone cell, chained between two Roman soldiers who sit against the wall, a torch burning at the doorway, seen from a distance.",
  },
  {
    path: "peter-in-prison/light",
    prompt: "A shaft of soft white light filling a dark stone prison cell, open iron chains lying on the floor; no people.",
  },
  {
    path: "night-of-prayer/mountain",
    prompt: "Jesus kneeling alone on a mountaintop at night under a vast starry sky, the Sea of Galilee far below, seen from far behind.",
    jesus: true,
  },
  {
    path: "night-of-prayer/dawn",
    prompt: "The first light of dawn breaking over the Galilean hills after a long night, Jesus standing alone on the summit, seen from very far away.",
    jesus: true,
  },
];

const CAST_NOTE =
  " The attached character sheet shows the man in this scene: paint him with exactly that face, hair, beard, build and clothing, but do not copy the sheet's layout, poses or plain background.";

async function main() {
  const redo = process.argv.includes("--redo");
  const only = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  for (const p of PAINTINGS) {
    if (only.length && !only.includes(p.path)) continue;
    const file = join(ROOT, "public", "images", "story", `${p.path}.jpg`);
    if (existsSync(file) && !redo) continue;
    mkdirSync(join(file, ".."), { recursive: true });
    console.log(`  painting ${p.path}`);
    const references = p.jesus
      ? [{ mimeType: "image/jpeg", data: readFileSync(join(ROOT, "content", "sleep", "characters", "jesus.jpg")) }]
      : [];
    const prompt = `${p.prompt}${p.jesus ? CAST_NOTE : ""} ${p.jesus ? GOSPEL_STYLE : NIGHT_STYLE}`;
    let img;
    for (let attempt = 1; ; attempt++) {
      try {
        [img] = await generateVertexImage({ prompt, aspectRatio: "9:16", stylePreset: "none", references });
        break;
      } catch (e) {
        if (attempt >= 3) throw e;
        console.log(`    retrying (${e instanceof Error ? e.message.slice(0, 80) : e})`);
        await new Promise((r) => setTimeout(r, 15000 * attempt));
      }
    }
    const raw = `${file}.raw`;
    writeFileSync(raw, img.buffer);
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", raw, "-vf", "scale=768:-2", "-q:v", "4", file]);
    rmSync(raw);
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
