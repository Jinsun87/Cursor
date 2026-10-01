"use client";

import { useEffect, useMemo, useState } from "react";
import { Player } from "@remotion/player";
import { WalkComposition, type WalkCompositionProps } from "./WalkComposition";
import { WALK_FPS, buildTimeline } from "@/lib/daily-walk/timeline";

export function WalkPlayer({ initialSeconds = 0, ...props }: WalkCompositionProps & { initialSeconds?: number }) {
  const { totalFrames } = useMemo(() => buildTimeline(props.episode, props.timing), [props.episode, props.timing]);
  // The player is browser-only (audio, animation frames); skip server rendering.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="mx-auto w-full max-w-[420px] overflow-hidden rounded-3xl border border-[var(--gold)]/30 shadow-2xl">
      {mounted ? (
        <Player
          component={WalkComposition}
          inputProps={props}
          durationInFrames={totalFrames}
          initialFrame={Math.min(totalFrames - 1, Math.round(initialSeconds * WALK_FPS))}
          fps={WALK_FPS}
          compositionWidth={1080}
          compositionHeight={1920}
          style={{ width: "100%", aspectRatio: "9 / 16" }}
          controls
          clickToPlay
          doubleClickToFullscreen
          spaceKeyToPlayOrPause
        />
      ) : (
        <div style={{ width: "100%", aspectRatio: "9 / 16" }} className="bg-[#0b0c0e]" />
      )}
    </div>
  );
}
