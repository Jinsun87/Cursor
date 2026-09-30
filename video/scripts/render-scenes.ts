// Renders every scene in src/scenes.ts to out/scenes/<id>.mp4 (original speed, uncropped).
import { execFileSync } from "node:child_process";
import { SCENES } from "../src/scenes";

for (const s of SCENES) {
  execFileSync("npx", ["remotion", "render", `Scene-${s.id}`, `out/scenes/${s.id}.mp4`, ...process.argv.slice(2)], {
    stdio: "inherit",
  });
}
