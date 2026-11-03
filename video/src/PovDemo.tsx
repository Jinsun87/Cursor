import { AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { EndCard } from "./EndCard";
import { END_CARD, type PovProps } from "./types";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const SCREEN_W = 390; // CSS px of the recorded phone screen
const SCREEN_H = 844;
const PX = 1080 / SCREEN_W; // frame px per screen px: the screen fills the width
const FOCUS = 760; // frame y the camera keeps its focus on, clear of Instagram's caption and buttons
const sans = "'Helvetica Neue', Arial, sans-serif";

/** Screen y at the focus line, eased between the camera's keyframes. */
function cameraAt(camera: PovProps["camera"], t: number): number {
  const next = camera.findIndex((k) => k.at > t);
  if (next === -1) return camera[camera.length - 1].y;
  if (next === 0) return camera[0].y;
  const a = camera[next - 1];
  const b = camera[next];
  return interpolate(t, [Math.max(a.at, b.at - 0.55), b.at], [a.y, b.y], { ...clamp, easing: Easing.inOut(Easing.cubic) });
}

/** 1080×1920 Reel of the app in use, like a screen recording shared by a listener. */
export const PovDemo: React.FC<PovProps> = ({ screens, taps, drags, camera, captions, narration, rain, dim, dark, cta, ctaSub }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Keep the screen's top edge in frame. The bottom may rise up to 120 screen px past the frame's
  // bottom (onto the background), so the dark verse screens can lift their text above Instagram's caption.
  const minY = FOCUS / PX;
  const maxY = SCREEN_H - (1920 - FOCUS) / PX + 120;
  const focus = Math.min(maxY, Math.max(minY, cameraAt(camera, t)));
  const top = FOCUS - focus * PX;

  const screen = [...screens].reverse().find((s) => s.at <= t) ?? screens[0];
  const darkness = interpolate(t, [dim, dark], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const endCard = interpolate(t, [dark, dark + 0.6], [0, 1], clamp);
  const caption = captions.find((c) => t >= c.from && t < c.to);

  const finger = (() => {
    for (const d of drags) {
      if (t >= d.from - 0.15 && t <= d.to + 0.2) {
        const p = interpolate(t, [d.from, d.to], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
        return { x: d.x0 + (d.x1 - d.x0) * p, y: d.y, scale: 1, opacity: 1 };
      }
    }
    for (const tap of taps) {
      if (t >= tap.at - 0.25 && t <= tap.at + 0.35) {
        const press = interpolate(t, [tap.at - 0.25, tap.at, tap.at + 0.35], [0, 1, 0], clamp);
        return { x: tap.x, y: tap.y, scale: 1.25 - 0.35 * press, opacity: press };
      }
    }
    return null;
  })();

  return (
    <AbsoluteFill style={{ backgroundColor: "#07080c" }}>
      <div style={{ position: "absolute", left: 0, top, width: 1080, height: SCREEN_H * PX }}>
        <Img src={staticFile(screen.src)} style={{ width: "100%", height: "100%" }} />
        {finger ? (
          <div
            style={{
              position: "absolute",
              left: finger.x * PX - 45,
              top: finger.y * PX - 45,
              width: 90,
              height: 90,
              borderRadius: 45,
              background: "rgba(255,255,255,0.38)",
              border: "3px solid rgba(255,255,255,0.75)",
              transform: `scale(${finger.scale})`,
              opacity: finger.opacity,
            }}
          />
        ) : null}
      </div>
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: darkness }} />

      {caption ? (
        <div style={{ position: "absolute", left: 90, right: 90, top: 270, display: "flex", justifyContent: "center", opacity: 1 - endCard }}>
          <div
            style={{
              background: "#fff",
              color: "#111",
              fontFamily: sans,
              fontWeight: 700,
              fontSize: caption === captions[0] ? 60 : 50,
              lineHeight: 1.22,
              padding: "18px 30px",
              borderRadius: 18,
              textAlign: "center",
              textWrap: "balance",
              boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
            }}
          >
            {caption.text}
          </div>
        </div>
      ) : null}

      <EndCard opacity={endCard} cta={cta} ctaSub={ctaSub} />

      <Audio
        src={staticFile(rain.src)}
        volume={(f) => {
          const s = f / fps;
          const ks = rain.levels;
          const level = interpolate(s, ks.map((k) => k.at), ks.map((k) => k.level), clamp);
          return level * interpolate(s, [dark + END_CARD - 1.2, dark + END_CARD], [1, 0], clamp);
        }}
      />
      <Sequence from={Math.round(narration.at * fps)}>
        <Audio src={staticFile(narration.src)} trimBefore={Math.round(narration.from * fps)} volume={(f) => interpolate((f / fps) + narration.at, [dark - 0.5, dark + 1.5], [1, 0], clamp)} />
      </Sequence>
    </AbsoluteFill>
  );
};
