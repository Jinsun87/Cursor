// Scene list for the piping-bag short (public/piping-bag.mp4, 720x1280 @ 30fps, 49.2s).
// Cut points come from ffmpeg scene detection (select='gt(scene,0.2)'), with
// micro-cuts merged into the step they belong to.
//
// This file is the edit decision list: reorder, drop, trim (from/to in
// seconds), change speed, or rewrite captions here and the ReEdit
// composition follows.

export const SOURCE = "piping-bag.mp4";
export const FPS = 30;
export const WIDTH = 720;
export const HEIGHT = 1280;

export type Scene = {
  id: string;
  /** Start/end in the source video, seconds. */
  from: number;
  to: number;
  /** Playback speed in the re-edit (1 = original). */
  speed: number;
  caption: string;
};

export const SCENES: Scene[] = [
  { id: "01-fold-edge", from: 0, to: 6.43, speed: 1.5, caption: "Fold the edge under" },
  { id: "02-stitch-trim", from: 6.43, to: 9.47, speed: 1.25, caption: "Stitch it down, trim the thread" },
  { id: "03-open-fold", from: 9.47, to: 14.8, speed: 1.5, caption: "Open it out and fold again" },
  { id: "04-second-line", from: 14.8, to: 17.5, speed: 1.25, caption: "Sew the second line" },
  { id: "05-measure", from: 17.5, to: 24.07, speed: 1.25, caption: "Measure 1 inch from the seam" },
  { id: "06-pinch-pleat", from: 24.07, to: 32.7, speed: 1.5, caption: "Pinch a pleat at the mark" },
  { id: "07-stitch-pleat", from: 32.7, to: 37.23, speed: 1.25, caption: "Stitch the pleat and trim" },
  { id: "08-turn-out", from: 37.23, to: 46.77, speed: 1.5, caption: "Turn it right side out" },
  { id: "09-reveal", from: 46.77, to: 49.2, speed: 1, caption: "Crisp piping, no cord needed" },
];

export const sceneFrames = (s: Scene) => Math.round(((s.to - s.from) * FPS) / s.speed);
