"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { WalkComposition } from "@/components/daily-walk/WalkComposition";
import { WALK_FPS, buildTimeline } from "@/lib/daily-walk/timeline";
import type { WalkEpisode } from "@/lib/daily-walk/types";
import type { ClipTiming } from "@/lib/daily-walk/timeline";
import { useListeningMeter } from "./useListening";
import { ProgressRow, ThumbControls, type Speed } from "./ThumbControls";

type Length = 10 | 20;

/**
 * Today's guided walk. The 10-minute session is the walk followed by the full
 * chapter in Sleep; the 20-minute session adds a related passage and quiet
 * reflection (Premium). This preview plays the walk itself.
 */
export function WalkPanel({
  episode,
  timing,
  title,
  reference,
  cover,
  onContinueToChapter,
}: {
  episode: WalkEpisode;
  timing: ClipTiming;
  title: string;
  reference: string;
  cover: string;
  onContinueToChapter: () => void;
}) {
  const [length, setLength] = useState<Length>(10);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState<Speed>(1);
  const [frame, setFrame] = useState(0);
  const player = useRef<PlayerRef | null>(null);
  const meter = useListeningMeter();
  const { totalFrames } = useMemo(() => buildTimeline(episode, timing), [episode, timing]);
  const walkMinutes = Math.round(totalFrames / WALK_FPS / 60);

  useEffect(() => {
    const p = player.current;
    if (!p || !started) return;
    // The buttons mirror the player's own state, read from its events, so they
    // never drift (React's dev double-mount can swallow the first "play" event).
    const onFrame = (e: { detail: { frame: number } }) => {
      setFrame(e.detail.frame);
      setPlaying(p.isPlaying());
      // Muted time is reading, not listening, so it does not light the lamp.
      if (p.isPlaying() && !p.isMuted()) meter.tick(e.detail.frame / WALK_FPS);
      else meter.stop();
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => {
      setPlaying(false);
      meter.stop();
    };
    const onEnded = () => {
      setPlaying(false);
      meter.stop();
      setFinished(true);
    };
    p.addEventListener("frameupdate", onFrame);
    p.addEventListener("play", onPlay);
    p.addEventListener("pause", onPause);
    const onMuteChange = (e: { detail: { isMuted: boolean } }) => setMuted(e.detail.isMuted);
    p.addEventListener("ended", onEnded);
    p.addEventListener("mutechange", onMuteChange);
    return () => {
      p.removeEventListener("frameupdate", onFrame);
      p.removeEventListener("play", onPlay);
      p.removeEventListener("pause", onPause);
      p.removeEventListener("ended", onEnded);
      p.removeEventListener("mutechange", onMuteChange);
    };
  }, [started, meter]);

  // Start playing once, when the reader taps "Begin today's walk".
  useEffect(() => {
    if (!started) return;
    player.current?.play();
  }, [started]);

  if (!started) {
    return (
      <div className="walk-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cover} alt="" className="walk-cover" />
        <div className="walk-card-body">
          <p className="walk-eyebrow">Today&apos;s walk · {reference}</p>
          <h3 className="walk-title">{title}</h3>
          <p className="walk-desc">
            A guided reading of the key verses, a short reflection, one small practice for today, and a prayer. Then the
            full chapter, read aloud.
          </p>
          <div className="walk-lengths" role="radiogroup" aria-label="Session length">
            <button type="button" role="radio" aria-checked={length === 10} onClick={() => setLength(10)}>
              <strong>10 min</strong>
              <span>Walk + chapter</span>
            </button>
            <button type="button" role="radio" aria-checked={length === 20} onClick={() => setLength(20)}>
              <strong>20 min</strong>
              <span>+ reflection · Premium</span>
            </button>
          </div>
          <button type="button" className="walk-start" onClick={() => setStarted(true)}>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path d="M8 5 L19 12 L8 19 Z" fill="currentColor" />
            </svg>
            Begin today&apos;s walk
          </button>
          <p className="walk-note">
            {length === 20
              ? "The 20-minute session is part of Premium. This preview plays the walk."
              : `The walk is about ${walkMinutes} minutes, then the chapter follows.`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="walk-session">
      <div className="walk-frame">
        <Player
          ref={player}
          component={WalkComposition}
          inputProps={{ episode, timing }}
          durationInFrames={totalFrames}
          fps={WALK_FPS}
          compositionWidth={1080}
          compositionHeight={1920}
          style={{ width: "100%", aspectRatio: "9 / 16" }}
          clickToPlay
          playbackRate={speed}
          spaceKeyToPlayOrPause
        />
      </div>
      <div className="walk-controls">
        <ThumbControls
          playing={playing}
          muted={muted}
          speed={speed}
          skipSeconds={10}
          onToggle={() => {
            const p = player.current;
            if (!p) return;
            if (p.isPlaying()) p.pause();
            else p.play();
          }}
          onSkip={(sec) => {
            const p = player.current;
            if (!p) return;
            p.seekTo(Math.max(0, Math.min(totalFrames - 1, p.getCurrentFrame() + sec * WALK_FPS)));
          }}
          onMute={() => {
            const p = player.current;
            if (!p) return;
            if (muted) p.unmute();
            else p.mute();
            setMuted(!muted);
          }}
          onSpeed={setSpeed}
          progress={
            <ProgressRow
              value={frame / WALK_FPS}
              max={totalFrames / WALK_FPS}
              label={clock}
              onSeek={(v) => player.current?.seekTo(Math.round(v * WALK_FPS))}
            />
          }
        />
      </div>
      <div className="walk-after">
        <p className="walk-eyebrow">{finished ? "Walk complete" : "Next in your 10 minutes"}</p>
        <p className="walk-after-title">The full chapter, read aloud</p>
        <p className="walk-desc">
          After the walk, hear all of {reference} in the Sleep player, with the text to follow along.
        </p>
        <button type="button" className="walk-secondary" onClick={onContinueToChapter}>
          Continue to the full chapter
        </button>
      </div>
    </div>
  );
}

function clock(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}
