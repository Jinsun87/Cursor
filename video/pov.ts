/**
 * Renders the POV demo Reels for Meta ads (1080×1920): the app in use, like a screen recording a
 * listener might share. Someone opens Lampstand at night, picks Psalm 23, presses play, sets the
 * sleep timer and the rain, and puts the phone down. The short cuts open on the Psalm already playing;
 * the long one walks through from the home screen. Only the hook differs within a cut.
 *
 *   node video/pov-shoot.mjs        # record the screens first (again whenever the app changes)
 *   npx tsx video/pov.ts            # all versions
 *   npx tsx video/pov.ts pov-swap  # some of them
 *
 * Uses the screens from pov-shoot.mjs, the Psalm 23 Sleep narration and rain made like the app's
 * own (brown noise through a 1.1 kHz low-pass). No paid APIs. Writes video/out/ads/<id>.mp4 and .txt.
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { END_CARD, type PovProps } from "./src/types";

const ROOT = resolve(__dirname, "..");
const SHOTS = join(ROOT, "video", ".work", "pov", "shots");
const WORK = join(ROOT, "video", ".work", "pov", "public");
const OUT = join(ROOT, "video", "out", "ads");

type Pov = { id: string; cut: "short" | "long"; hook: string; headline: string };

// Sleep and scrolling, without describing the viewer (Meta's personal-attributes rule).
const PRIMARY =
  "Most of us end the day the same way: in bed, phone in hand, scrolling until our eyes give up. Lampstand turns that last half hour into Scripture. Press play on a Psalm, set the sleep timer, add soft rain, and put the phone down. You're going to fall asleep to something tonight. Let it be the Word.";

const POVS: Pov[] = [
  { id: "pov-1148", cut: "short", hook: "POV: it's 11:48 pm and you're still scrolling", headline: "Fall asleep to the Psalms" },
  { id: "pov-swap", cut: "short", hook: "POV: you swapped bedtime doomscrolling for the Psalms", headline: "Scripture, read softly for sleep" },
  { id: "pov-thumb", cut: "short", hook: "Your thumb's going to scroll anyway. Point it at Psalm 23.", headline: "Fall asleep to the Psalms" },
  { id: "pov-3taps", cut: "short", hook: "Phone down in 3 taps. Psalm 23 does the rest.", headline: "The Bible, read softly for sleep" },
  // The full walkthrough, for retargeting people who have already watched a short one.
  { id: "pov-app", cut: "long", hook: "The Bible app that reads you to sleep", headline: "The Bible, read softly for sleep" },
];

const PSALM_23 = [1.64, 11.1, 18.9]; // verse starts in the recording

function shots() {
  const taps = JSON.parse(readFileSync(join(SHOTS, "taps.json"), "utf8")) as Record<string, { x: number; y: number }>;
  const files = readdirSync(SHOTS).sort();
  return { taps, scroll: files.filter((f) => f.startsWith("scroll-")), rainSteps: files.filter((f) => f.startsWith("rain-")) };
}

const OFFER = { cta: "Try it free for 7 days", ctaSub: "Psalms read softly, with a sleep timer and rain" };
const rainLevels = (drag: { from: number; to: number }) => [{ at: 0, level: 0.18 }, { at: drag.from, level: 0.18 }, { at: drag.to, level: 0.45 }];

/**
 * About 17 s: opens on Psalm 23 already playing (the voice from the first frame, under the hook),
 * then shows how in quick taps, then a verse and the dim. The narration runs on throughout.
 */
function shortProps(pov: Pov): PovProps {
  const { taps, rainSteps } = shots();
  const FROM = 1.9; // the voice comes in at 2.0 s in the narration file
  const DRAG = { from: 5.9, to: 6.5 };
  const DARK = 13.6;
  return {
    screens: [
      { src: "verse-1.png", at: 0 },
      { src: "c-psalms.png", at: 2.2 },
      { src: "d-card.png", at: 3.15 },
      { src: "e-controls.png", at: 4.1 },
      { src: "f-options.png", at: 4.85 },
      { src: "g-timer.png", at: 5.5 },
      ...rainSteps.map((src, i) => ({ src, at: DRAG.from + ((i + 1) * (DRAG.to - DRAG.from)) / rainSteps.length })),
      { src: "i-closed.png", at: 7.3 },
      { src: "verse-1.png", at: 8.4 },
      { src: "verse-2.png", at: PSALM_23[1] - FROM },
    ],
    taps: [
      { at: 2.9, ...taps.p23 },
      { at: 3.85, ...taps.play },
      { at: 4.65, ...taps.options },
      { at: 5.3, ...taps.timer },
      { at: 7.1, ...taps.close },
    ],
    drags: [{ ...DRAG, x0: taps.rainFrom.x, x1: taps.rainTo.x, y: taps.rainFrom.y }],
    camera: [
      { at: 0, y: 540 }, // a verse screen: lifted so the text clears Instagram's caption
      { at: 2.15, y: 540 },
      { at: 2.2, y: 425 },
      { at: 4.2, y: 425 },
      { at: 4.55, y: 274 },
      { at: 5.15, y: 330 },
      { at: 5.8, y: 400 },
      { at: 6.95, y: 300 },
      { at: 7.7, y: 425 },
      { at: 8.4, y: 540 },
    ],
    captions: [
      { from: 0, to: 2.15, text: pov.hook },
      { from: 2.2, to: 3.4, text: "Pick a Psalm" },
      { from: 3.4, to: 4.4, text: "Press play" },
      { from: 4.45, to: 7.0, text: "Sleep timer + soft rain" },
      { from: 7.3, to: 10.6, text: "Then put your phone down" },
      { from: 11.2, to: DARK - 0.2, text: "The voice fades out as you drift off" },
    ],
    narration: { src: "psalm-23.mp3", at: 0, from: FROM },
    rain: { src: "rain.wav", levels: rainLevels(DRAG) },
    dim: 11.4,
    dark: DARK,
    ...OFFER,
  };
}

/** 34.5 s: the whole walkthrough from the home screen. */
function longProps(pov: Pov): PovProps {
  const { taps, scroll, rainSteps } = shots();
  const PLAY = 6.15; // the narration starts here
  const DRAG = { from: 8.9, to: 9.7 };
  const DARK = 31;
  return {
    screens: [
      { src: "a-home.png", at: 0 },
      ...scroll.map((src, i) => ({ src, at: 2 + i / 30 })),
      { src: "c-psalms.png", at: 3.75 },
      { src: "d-card.png", at: 4.95 },
      { src: "e-controls.png", at: PLAY },
      { src: "f-options.png", at: 7.45 },
      { src: "g-timer.png", at: 8.5 },
      ...rainSteps.map((src, i) => ({ src, at: DRAG.from + ((i + 1) * (DRAG.to - DRAG.from)) / rainSteps.length })),
      { src: "i-closed.png", at: 10.85 },
      { src: "verse-1.png", at: 14 },
      { src: "verse-2.png", at: PLAY + PSALM_23[1] },
      { src: "verse-3.png", at: PLAY + PSALM_23[2] },
    ],
    taps: [
      { at: 3.5, ...taps.psalms },
      { at: 4.7, ...taps.p23 },
      { at: 5.9, ...taps.play },
      { at: 7.2, ...taps.options },
      { at: 8.3, ...taps.timer },
      { at: 10.6, ...taps.close },
    ],
    drags: [{ ...DRAG, x0: taps.rainFrom.x, x1: taps.rainTo.x, y: taps.rainFrom.y }],
    camera: [
      { at: 0, y: 274 },
      { at: 3.2, y: 274 },
      { at: 4.2, y: 380 },
      { at: 5.4, y: 425 },
      { at: 6.9, y: 274 },
      { at: 8.0, y: 330 },
      { at: 8.9, y: 400 },
      { at: 10.4, y: 300 },
      { at: 11.4, y: 425 },
      { at: 14, y: 540 },
    ],
    captions: [
      { from: 0, to: 3.4, text: pov.hook },
      { from: 3.6, to: 5.7, text: "Pick a Psalm" },
      { from: 5.9, to: 7.1, text: "Press play" },
      { from: 7.3, to: 10.5, text: "Sleep timer + soft rain" },
      { from: 11, to: 16.5, text: "Then put your phone down" },
      { from: 27, to: DARK - 0.2, text: "The voice fades out as you drift off" },
    ],
    narration: { src: "psalm-23.mp3", at: PLAY, from: 0 },
    rain: { src: "rain.wav", levels: rainLevels(DRAG) },
    dim: 27.5,
    dark: DARK,
    ...OFFER,
  };
}

const propsFor = (pov: Pov) => (pov.cut === "short" ? shortProps(pov) : longProps(pov));

async function main() {
  if (!existsSync(join(SHOTS, "taps.json"))) throw new Error("No screens yet: run `node video/pov-shoot.mjs` first");
  const only = process.argv.slice(2);
  const povs = only.length ? POVS.filter((p) => only.includes(p.id)) : POVS;
  if (!povs.length) throw new Error(`No version named ${only.join(", ")}. Versions: ${POVS.map((p) => p.id).join(", ")}`);
  mkdirSync(WORK, { recursive: true });
  mkdirSync(OUT, { recursive: true });

  for (const f of readdirSync(SHOTS).filter((f) => f.endsWith(".png"))) copyFileSync(join(SHOTS, f), join(WORK, f));
  copyFileSync(join(ROOT, "public", "icon-512.png"), join(WORK, "lampstand-icon.png"));
  const narration = join(ROOT, "public", "sleep", "psalm-23", "chapter.mp3");
  if (!existsSync(narration)) throw new Error(`${narration} is missing (download it from R2 first)`);
  copyFileSync(narration, join(WORK, "psalm-23.mp3"));
  // The app's rain: brown noise through a 1.1 kHz low-pass.
  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error", "-f", "lavfi", "-i", "anoisesrc=color=brown:amplitude=0.9:duration=40",
    "-af", "lowpass=f=1100", "-ac", "2", "-ar", "44100", join(WORK, "rain.wav"),
  ]);

  const serveUrl = await bundle({ entryPoint: join(ROOT, "video", "src", "index.ts"), publicDir: WORK });
  for (const pov of povs) {
    const props = propsFor(pov);
    const composition = await selectComposition({ serveUrl, id: "PovDemo", inputProps: props });
    await renderMedia({
      composition,
      serveUrl,
      codec: "h264",
      outputLocation: join(OUT, `${pov.id}.mp4`),
      inputProps: props,
      onProgress: ({ progress }) => process.stdout.write(`\r  ${pov.id}: ${Math.round(progress * 100)}%   `),
    });
    writeFileSync(
      join(OUT, `${pov.id}.txt`),
      [`Primary text: ${PRIMARY}`, `Headline: ${pov.headline}`, `Description: 7 days free, then $4.99 a month. Cancel anytime.`, "Call to action: Learn more", "Link: https://lampstandbible.com/pricing"].join("\n") + "\n",
    );
    console.log(`\r  ${pov.id}: video/out/ads/${pov.id}.mp4 (${(props.dark + END_CARD).toFixed(1)}s)`);
  }
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  });
}
