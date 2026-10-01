import type { WalkBeat, WalkEpisode } from "./types";

export const WALK_FPS = 30;

/** Clip durations in seconds, keyed by clip name (public/<audioDir>/timing.json). */
export type ClipTiming = Record<string, number>;

export interface TimedClip {
  name: string;
  /** Frame offset within the beat. */
  at: number;
  frames: number;
}

export interface TimedBeat {
  beat: WalkBeat;
  /** Absolute start frame in the episode. */
  from: number;
  frames: number;
  clips: TimedClip[];
  /** Verse beats: frame the gold highlight begins. Others: 0. */
  glowAt: number;
}

// Pacing, in frames at 30fps. One thing moves at a time.
const RISE = 36; // verse drifts up from the bottom in silence
const AFTER_READ = 12; // breath after the verse is read
const GLOW_LEAD = 12; // highlight settles before the reflection starts
const HOLD = 18; // stillness after the voice ends
const EXIT = 24; // fade out before the next beat
const LINE_GAP = 14; // pause between prayer lines

const toFrames = (seconds: number) => Math.ceil(seconds * WALK_FPS);

export function buildTimeline(episode: WalkEpisode, timing: ClipTiming) {
  const clipFrames = (name: string) => {
    const seconds = timing[name];
    if (seconds === undefined) throw new Error(`timing.json is missing clip "${name}"`);
    return toFrames(seconds);
  };

  let cursor = 0;
  const beats: TimedBeat[] = episode.beats.map((beat) => {
    const clips: TimedClip[] = [];
    const queue = (name: string, at: number) => {
      const frames = clipFrames(name);
      clips.push({ name, at, frames });
      return at + frames;
    };

    let end: number;
    let glowAt = 0;
    switch (beat.kind) {
      case "verse": {
        const readEnd = queue(`${beat.id}-read`, RISE);
        glowAt = readEnd + AFTER_READ;
        end = queue(`${beat.id}-say`, glowAt + GLOW_LEAD);
        break;
      }
      case "prayer": {
        let at = queue(`${beat.id}-intro`, 20) + LINE_GAP;
        beat.lines.forEach((_, i) => {
          at = queue(`${beat.id}-line${i + 1}`, at) + LINE_GAP;
        });
        end = at + 30;
        break;
      }
      case "close":
        end = queue(`${beat.id}-say`, 20) + 60;
        break;
      default:
        end = queue(`${beat.id}-say`, 30);
    }

    const frames = end + HOLD + EXIT;
    const timed = { beat, from: cursor, frames, clips, glowAt };
    cursor += frames;
    return timed;
  });

  return { beats, totalFrames: cursor };
}

export const BEAT_EXIT_FRAMES = EXIT;
export const VERSE_RISE_FRAMES = RISE;
