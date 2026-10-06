"use client";

import { useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  Html5Audio,
  Img,
  Sequence,
  interpolate,
  interpolateColors,
  useCurrentFrame,
} from "remotion";
import type { WalkBeat, WalkEpisode } from "@/lib/daily-walk/types";
import {
  BEAT_EXIT_FRAMES,
  VERSE_RISE_FRAMES,
  buildTimeline,
  type ClipTiming,
  type TimedBeat,
} from "@/lib/daily-walk/timeline";

export interface WalkCompositionProps {
  episode: WalkEpisode;
  timing: ClipTiming;
}

const GOLD = "#e4c04a";
const INK = "#f3efe4";
const SERIF = "var(--font-display), Georgia, 'Times New Roman', serif";
const SANS = "var(--font-sans), system-ui, sans-serif";
const CROSSFADE = 40;
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

export function WalkComposition({ episode, timing }: WalkCompositionProps) {
  const { beats } = useMemo(() => buildTimeline(episode, timing), [episode, timing]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0c0e", fontFamily: SERIF, color: INK }}>
      <Backdrop beats={beats} />

      {beats.map((timed) => (
        <Sequence key={timed.beat.id} from={timed.from} durationInFrames={timed.frames} layout="none">
          <BeatLayer timed={timed} />
        </Sequence>
      ))}

      {beats.flatMap((timed) =>
        timed.clips.map((clip) => (
          <Sequence
            key={clip.name}
            from={timed.from + clip.at}
            durationInFrames={clip.frames}
            layout="none"
          >
            <Html5Audio src={`${episode.audioDir}/${clip.name}.mp3`} />
          </Sequence>
        )),
      )}

      <div
        style={{
          position: "absolute",
          top: 72,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: SANS,
          fontSize: 26,
          letterSpacing: 8,
          textTransform: "uppercase",
          color: GOLD,
          opacity: 0.7,
        }}
      >
        Lampstand · Daily Walk
      </div>
    </AbsoluteFill>
  );
}

/** Painting layers with slow drift; crossfades only when the image changes. */
function Backdrop({ beats }: { beats: TimedBeat[] }) {
  const frame = useCurrentFrame();

  const runs: { image: string; from: number; to: number }[] = [];
  for (const { beat, from, frames } of beats) {
    const last = runs[runs.length - 1];
    if (last && last.image === beat.image) last.to = from + frames;
    else runs.push({ image: beat.image, from, to: from + frames });
  }

  return (
    <AbsoluteFill>
      {runs.map((run, i) => {
        const next = runs[i + 1];
        if (frame < run.from - 1 || (next && frame > next.from + CROSSFADE)) return null;
        const opacity = i === 0 ? 1 : interpolate(frame, [run.from, run.from + CROSSFADE], [0, 1], clamp);
        const progress = interpolate(frame, [run.from, run.to], [0, 1], clamp);
        const scale = 1.08 + progress * 0.1;
        const y = -progress * 40;
        return (
          <AbsoluteFill key={`${run.image}-${run.from}`} style={{ opacity }}>
            <Img
              src={run.image}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: `scale(${scale}) translateY(${y}px)`,
              }}
            />
          </AbsoluteFill>
        );
      })}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 85% 42% at 50% 50%, rgba(5,6,8,0.62) 0%, rgba(5,6,8,0.3) 100%), linear-gradient(180deg, rgba(5,6,8,0.55) 0%, rgba(5,6,8,0.35) 30%, rgba(5,6,8,0.6) 60%, rgba(5,6,8,0.92) 100%)",
        }}
      />
    </AbsoluteFill>
  );
}

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Shared entrance/exit: drift up from below, keep creeping upward, fade out at the end. */
function useRiseStyle(frames: number, enterAt = 0, enterFrames = VERSE_RISE_FRAMES): React.CSSProperties {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [enterAt, enterAt + enterFrames], [0, 1], { ...clamp, easing: easeOut });
  const exit = interpolate(frame, [frames - BEAT_EXIT_FRAMES, frames], [0, 1], clamp);
  const drift = interpolate(frame, [enterAt, frames], [0, -36], clamp);
  return {
    opacity: enter * (1 - exit),
    transform: `translateY(${(1 - enter) * 180 + drift - exit * 30}px)`,
  };
}

function BeatLayer({ timed }: { timed: TimedBeat }) {
  const { beat } = timed;
  switch (beat.kind) {
    case "title":
      return <TitleBeat beat={beat} frames={timed.frames} />;
    case "verse":
      return <VerseBeat beat={beat} frames={timed.frames} glowAt={timed.glowAt} />;
    case "practice":
      return <PracticeBeat beat={beat} frames={timed.frames} />;
    case "prayer":
      return <PrayerBeat beat={beat} timed={timed} />;
    case "close":
      return <CloseBeat beat={beat} frames={timed.frames} />;
  }
}

const stage: React.CSSProperties = {
  position: "absolute",
  left: 96,
  right: 96,
  top: 0,
  bottom: 0,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  textShadow: "0 2px 18px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.9)",
};

const eyebrowStyle: React.CSSProperties = {
  fontFamily: SANS,
  fontSize: 30,
  letterSpacing: 6,
  textTransform: "uppercase",
  color: GOLD,
  fontWeight: 600,
};

function TitleBeat({ beat, frames }: { beat: Extract<WalkBeat, { kind: "title" }>; frames: number }) {
  const style = useRiseStyle(frames, 0, 50);
  return (
    <div style={{ ...stage, ...style }}>
      <div style={eyebrowStyle}>{beat.eyebrow}</div>
      <div style={{ marginTop: 36, fontSize: 104, lineHeight: 1.08, fontWeight: 600 }}>{beat.title}</div>
      <div style={{ marginTop: 48, width: 120, height: 2, background: GOLD, opacity: 0.6 }} />
    </div>
  );
}

function VerseBeat({
  beat,
  frames,
  glowAt,
}: {
  beat: Extract<WalkBeat, { kind: "verse" }>;
  frames: number;
  glowAt: number;
}) {
  const frame = useCurrentFrame();
  const style = useRiseStyle(frames);
  const glow = interpolate(frame, [glowAt, glowAt + 24], [0, 1], { ...clamp, easing: easeOut });

  const start = beat.text.indexOf(beat.highlight);
  const before = start >= 0 ? beat.text.slice(0, start) : beat.text;
  const lit = start >= 0 ? beat.highlight : "";
  const after = start >= 0 ? beat.text.slice(start + lit.length) : "";
  const size = beat.text.length > 110 ? 66 : beat.text.length > 70 ? 76 : 88;

  return (
    <div style={{ ...stage, ...style }}>
      <div style={eyebrowStyle}>{beat.reference}</div>
      <div style={{ marginTop: 40, fontSize: size, lineHeight: 1.28 }}>
        <span style={{ opacity: 1 - glow * 0.3 }}>{before}</span>
        <span
          style={{
            color: interpolateColors(glow, [0, 1], [INK, GOLD]),
            textShadow: `0 2px 18px rgba(0,0,0,0.85), 0 0 ${glow * 36}px rgba(228,192,74,${glow * 0.45})`,
          }}
        >
          {lit}
        </span>
        <span style={{ opacity: 1 - glow * 0.3 }}>{after}</span>
      </div>
    </div>
  );
}

function PracticeBeat({ beat, frames }: { beat: Extract<WalkBeat, { kind: "practice" }>; frames: number }) {
  const style = useRiseStyle(frames, 0, 48);
  return (
    <div style={{ ...stage, ...style }}>
      <div
        style={{
          padding: "72px 64px",
          borderRadius: 40,
          border: `2px solid rgba(228,192,74,0.55)`,
          background: "rgba(10,11,13,0.6)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
        }}
      >
        <div style={eyebrowStyle}>{beat.label}</div>
        <div style={{ marginTop: 36, fontSize: 72, lineHeight: 1.25 }}>{beat.card}</div>
      </div>
    </div>
  );
}

function PrayerBeat({ beat, timed }: { beat: Extract<WalkBeat, { kind: "prayer" }>; timed: TimedBeat }) {
  const frame = useCurrentFrame();
  const style = useRiseStyle(timed.frames, 0, 30);
  const lineStarts = beat.lines.map((_, i) => timed.clips.find((c) => c.name === `${beat.id}-line${i + 1}`)!.at);

  return (
    <div style={{ ...stage, ...style }}>
      <div style={eyebrowStyle}>{beat.intro}</div>
      <div style={{ marginTop: 48, display: "flex", flexDirection: "column", gap: 28 }}>
        {beat.lines.map((line, i) => {
          const at = lineStarts[i];
          const enter = interpolate(frame, [at - 6, at + 24], [0, 1], { ...clamp, easing: easeOut });
          const next = lineStarts[i + 1];
          const dim = next === undefined ? 0 : interpolate(frame, [next, next + 20], [0, 0.4], clamp);
          return (
            <div
              key={i}
              style={{
                fontSize: 58,
                lineHeight: 1.3,
                fontStyle: i === beat.lines.length - 1 ? "normal" : "italic",
                color: i === beat.lines.length - 1 ? GOLD : INK,
                opacity: enter * (1 - dim),
                transform: `translateY(${(1 - enter) * 60}px)`,
              }}
            >
              {line}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CloseBeat({ beat, frames }: { beat: Extract<WalkBeat, { kind: "close" }>; frames: number }) {
  const frame = useCurrentFrame();
  const style = useRiseStyle(frames, 0, 40);
  return (
    <div style={{ ...stage, ...style }}>
      {beat.lines.map((line, i) => {
        const enter = interpolate(frame, [i * 30, i * 30 + 30], [0, 1], { ...clamp, easing: easeOut });
        return (
          <div
            key={i}
            style={{
              marginTop: i === 0 ? 0 : 36,
              fontSize: i === 0 ? 84 : 44,
              fontFamily: i === 0 ? SERIF : SANS,
              color: i === 0 ? GOLD : INK,
              opacity: enter * (i === 2 ? 0.75 : 1),
              transform: `translateY(${(1 - enter) * 40}px)`,
            }}
          >
            {line}
          </div>
        );
      })}
    </div>
  );
}
