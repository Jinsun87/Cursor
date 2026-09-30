// Reference-style overlays: outlined keyword punch-ins, glowing image cards,
// and a warm light-leak flash on cuts.
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FPS, type Pop } from "./scenes";

export const font = "'Arial Black', 'Helvetica Neue', Arial, sans-serif";
export const YELLOW = "#ffe53b";
const GLOW = "#b8ff2c";

// Heavy black outline built from stacked shadows (renders consistently in headless Chrome).
export const outline = (px: number, color = "black") =>
  Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2;
    return `${(Math.cos(a) * px).toFixed(1)}px ${(Math.sin(a) * px).toFixed(1)}px 0 ${color}`;
  }).join(", ");

const usePopIn = (frames: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inS = spring({ frame, fps, config: { damping: 9, stiffness: 180 } });
  const out = interpolate(frame, [frames - 6, frames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { frame, inS, out };
};

const WordPop: React.FC<{ text: string; frames: number }> = ({ text, frames }) => {
  const { frame, inS, out } = usePopIn(frames);
  const wobble = Math.sin(frame / 2.2) * interpolate(frame, [0, 10], [4, 0], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 300 }}>
      <div
        style={{
          fontFamily: font,
          fontStyle: "italic",
          fontSize: 104,
          color: YELLOW,
          textShadow: `${outline(6)}, 0 10px 24px rgba(0,0,0,0.5)`,
          transform: `scale(${(0.3 + 0.7 * inS) * (1 + 0.15 * (1 - out))}) rotate(${-4 + wobble}deg)`,
          opacity: out,
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

const ImagePop: React.FC<{ src: string; label?: string; frames: number }> = ({ src, label, frames }) => {
  const { frame, inS, out } = usePopIn(frames);
  const photo = /\.(jpe?g|png)$/.test(src);
  // Exit: whip sideways with motion blur, like the reference's slide-outs.
  const exitX = interpolate(out, [0, 1], [420, 0]);
  const pulse = 0.6 + 0.4 * Math.sin(frame / 4);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingTop: 180 }}>
      <div
        style={{
          transform: `translateX(${exitX}px) scale(${0.2 + 0.8 * inS}) rotate(${(1 - inS) * -12}deg)`,
          filter: out < 1 ? `blur(${(1 - out) * 14}px)` : undefined,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: photo ? 330 : 250,
            height: photo ? 330 : 250,
            borderRadius: 44,
            background: "white",
            border: `6px solid ${GLOW}`,
            boxShadow: `0 0 ${24 + 16 * pulse}px ${6 + 6 * pulse}px ${GLOW}, 0 12px 30px rgba(0,0,0,0.45)`,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Img
            src={staticFile(`pops/${src}`)}
            style={photo ? { width: "100%", height: "100%", objectFit: "cover" } : { width: "78%", height: "78%" }}
          />
        </div>
        {label && (
          <div style={{ fontFamily: font, fontSize: 44, color: "white", textShadow: outline(4), whiteSpace: "nowrap" }}>
            {label}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

export const PopLayer: React.FC<{ pops: Pop[] }> = ({ pops }) => (
  <>
    {pops.map((p, i) => {
      const frames = Math.round((p.duration ?? (p.kind === "word" ? 1.1 : 1.4)) * FPS);
      return (
        <Sequence key={i} from={Math.round(p.at * FPS)} durationInFrames={frames} layout="none">
          <Audio src={staticFile(p.kind === "word" ? "sfx/pop.wav" : "sfx/whoosh.wav")} volume={0.5} />
          {p.kind === "word" ? <WordPop text={p.text} frames={frames} /> : <ImagePop src={p.src} label={p.label} frames={frames} />}
        </Sequence>
      );
    })}
  </>
);

export const Flash: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 3, 12], [0.95, 0.85, 0], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill
      style={{
        opacity: o,
        background: "radial-gradient(circle at 60% 35%, #fffbe6 0%, #ffe680 45%, rgba(255,170,40,0.6) 100%)",
        mixBlendMode: "screen",
      }}
    />
  );
};
