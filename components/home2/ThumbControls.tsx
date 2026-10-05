"use client";

import type { ReactNode } from "react";

export const SPEEDS = [0.75, 1, 1.25] as const;
export type Speed = (typeof SPEEDS)[number];

/**
 * Player controls laid out for a thumb: a large play/pause in the bottom
 * centre, skip buttons beside it, mute and speed at the outer edges, and the
 * progress bar above. On phones the row stays pinned above the tab bar while
 * its player is on screen.
 */
export function ThumbControls({
  playing,
  muted,
  speed,
  skipSeconds,
  progress,
  onToggle,
  onSkip,
  onMute,
  onSpeed,
}: {
  playing: boolean;
  muted: boolean;
  speed: Speed;
  skipSeconds: number;
  /** The progress row: a scrubber with times either side. */
  progress: ReactNode;
  onToggle: () => void;
  onSkip: (seconds: number) => void;
  onMute: () => void;
  onSpeed: (next: Speed) => void;
}) {
  const nextSpeed = SPEEDS.at((SPEEDS.indexOf(speed) + 1) % SPEEDS.length) ?? 1;
  return (
    <div className="thumb-controls">
      <div className="thumb-progress">{progress}</div>
      <div className="thumb-row">
        <button
          type="button"
          className={`thumb-side${muted ? " is-on" : ""}`}
          onClick={onMute}
          aria-pressed={muted}
          aria-label={muted ? "Turn the voice back on" : "Mute the voice and read along"}
        >
          {muted ? <SpeakerOff /> : <SpeakerOn />}
          <span>{muted ? "Muted" : "Mute"}</span>
        </button>
        <button
          type="button"
          className="thumb-skip"
          onClick={() => onSkip(-skipSeconds)}
          aria-label={`Back ${skipSeconds} seconds`}
        >
          <SkipIcon back />
          <span>{skipSeconds}</span>
        </button>
        <button type="button" className="thumb-play" onClick={onToggle} aria-label={playing ? "Pause" : "Play"}>
          {playing ? (
            <svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true">
              <rect x="6" y="5" width="4.2" height="14" rx="1.2" fill="currentColor" />
              <rect x="13.8" y="5" width="4.2" height="14" rx="1.2" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true">
              <path d="M8.5 5.2 L19 12 L8.5 18.8 Z" fill="currentColor" />
            </svg>
          )}
        </button>
        <button
          type="button"
          className="thumb-skip"
          onClick={() => onSkip(skipSeconds)}
          aria-label={`Forward ${skipSeconds} seconds`}
        >
          <SkipIcon />
          <span>{skipSeconds}</span>
        </button>
        <button
          type="button"
          className="thumb-side"
          onClick={() => onSpeed(nextSpeed)}
          aria-label={`Reading speed ${speed} times. Change to ${nextSpeed} times`}
        >
          <strong>{speed}×</strong>
          <span>Speed</span>
        </button>
      </div>
    </div>
  );
}

function SkipIcon({ back = false }: { back?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="26"
      height="26"
      aria-hidden="true"
      style={back ? undefined : { transform: "scaleX(-1)" }}
    >
      <path
        d="M12 5V2L7 6l5 4V7a6 6 0 1 1-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SpeakerOn() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
      <path
        d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SpeakerOff() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
      <path d="M16.5 9.5l5 5m0-5l-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/** The scrubber row used by both players. */
export function ProgressRow({
  value,
  max,
  label,
  onSeek,
}: {
  value: number;
  max: number;
  label: (seconds: number) => string;
  onSeek: (value: number) => void;
}) {
  return (
    <>
      <span className="thumb-time">{label(value)}</span>
      <input
        className="thumb-scrub"
        type="range"
        min={0}
        max={max || 1}
        step={0.1}
        value={Math.min(value, max || 1)}
        aria-label="Position"
        onChange={(e) => onSeek(Number(e.target.value))}
      />
      <span className="thumb-time">{label(max)}</span>
    </>
  );
}
