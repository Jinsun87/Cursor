// Scene list for the piping-bag short (public/piping-bag.mp4, 720x1280 @ 30fps, 49.2s).
// Cut points come from ffmpeg scene detection (select='gt(scene,0.2)'), with
// micro-cuts merged into the step they belong to.
//
// This file is the edit decision list: reorder, drop, trim (from/to in
// seconds), change speed, or rewrite captions here and the ReEdit
// composition follows.
//
// Caption keywords wrapped in *asterisks* are highlighted. `pops` are
// reference-style overlays timed in seconds from the start of the scene
// (after speed change): `word` is a big outlined keyword punch-in, `image`
// is a glowing card with a file from public/pops.

export const SOURCE = "piping-bag.mp4";
export const FPS = 30;
export const WIDTH = 720;
export const HEIGHT = 1280;

export type Pop =
  | { kind: "word"; at: number; text: string; duration?: number }
  | { kind: "image"; at: number; src: string; label?: string; duration?: number };

export type Scene = {
  id: string;
  /** Start/end in the source video, seconds. */
  from: number;
  to: number;
  /** Playback speed in the re-edit (1 = original). */
  speed: number;
  caption: string;
  pops?: Pop[];
  /** Warm light-leak flash on the cut into this scene. */
  flash?: boolean;
};

export const SCENES: Scene[] = [
  {
    id: "01-fold-edge", from: 0, to: 6.43, speed: 1.5, caption: "Fold the *edge* under", flash: true,
    pops: [
      { kind: "word", at: 0.2, text: "No cord!" },
      { kind: "image", at: 1.8, src: "ribbon.svg", label: "Fabric piping" },
    ],
  },
  {
    id: "02-stitch-trim", from: 6.43, to: 9.47, speed: 1.25, caption: "*Stitch* it down, *trim* the thread",
    pops: [
      { kind: "image", at: 0.1, src: "sewing-needle.svg" },
      { kind: "image", at: 1.4, src: "scissors.svg" },
    ],
  },
  {
    id: "03-open-fold", from: 9.47, to: 14.8, speed: 1.5, caption: "*Open* it out and *fold* again",
    pops: [{ kind: "image", at: 0.6, src: "counterclockwise-arrows-button.svg", label: "Flip & fold" }],
  },
  {
    id: "04-second-line", from: 14.8, to: 17.5, speed: 1.25, caption: "Sew the *second line*",
    pops: [{ kind: "word", at: 0.2, text: "2nd line" }],
  },
  {
    id: "05-measure", from: 17.5, to: 24.07, speed: 1.25, caption: "Measure *1 inch* from the seam", flash: true,
    pops: [
      { kind: "word", at: 0.3, text: "1 inch" },
      { kind: "image", at: 2.0, src: "straight-ruler.svg" },
    ],
  },
  {
    id: "06-pinch-pleat", from: 24.07, to: 32.7, speed: 1.5, caption: "*Pinch* a *pleat* at the mark",
    pops: [
      { kind: "image", at: 0.4, src: "pinching-hand.svg", label: "Pinch" },
      { kind: "word", at: 3.0, text: "Pleat" },
    ],
  },
  {
    id: "07-stitch-pleat", from: 32.7, to: 37.23, speed: 1.25, caption: "*Stitch* the pleat and *trim*",
    pops: [{ kind: "image", at: 1.8, src: "scissors.svg" }],
  },
  {
    id: "08-turn-out", from: 37.23, to: 46.77, speed: 1.5, caption: "Turn it *right side out*",
    pops: [
      { kind: "image", at: 0.5, src: "magic-wand.svg" },
      { kind: "word", at: 3.4, text: "Flip it!" },
    ],
  },
  {
    id: "09-reveal", from: 46.77, to: 49.2, speed: 1, caption: "Crisp *piping*, no *cord* needed", flash: true,
    pops: [
      { kind: "word", at: 0.1, text: "Perfect!" },
      { kind: "image", at: 1.1, src: "hundred-points.svg", duration: 1.3 },
    ],
  },
];

export const sceneFrames = (s: Scene) => Math.round(((s.to - s.from) * FPS) / s.speed);
