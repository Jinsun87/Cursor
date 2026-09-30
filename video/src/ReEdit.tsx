import { AbsoluteFill, Series, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Clip } from "./Clip";
import { SCENES, sceneFrames, type Scene } from "./scenes";

export const TITLE_FRAMES = 45;
export const reEditFrames = () => TITLE_FRAMES + SCENES.reduce((n, s) => n + sceneFrames(s), 0);

const font = "Inter, Helvetica, Arial, sans-serif";

const Caption: React.FC<{ step: number; total: number; text: string }> = ({ step, total, text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 12 });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 170 }}>
      <div
        style={{
          transform: `translateY(${(1 - enter) * 40}px)`,
          opacity: enter,
          background: "rgba(255,255,255,0.94)",
          color: "#1f1a17",
          borderRadius: 22,
          padding: "18px 28px",
          maxWidth: 620,
          fontFamily: font,
          textAlign: "center",
          boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
        }}
      >
        <div style={{ fontSize: 24, fontWeight: 700, color: "#d9622b", letterSpacing: 2 }}>
          STEP {step}/{total}
        </div>
        <div style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.15 }}>{text}</div>
      </div>
    </AbsoluteFill>
  );
};

const Progress: React.FC<{ index: number; total: number; frames: number }> = ({ index, total, frames }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, frames], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ padding: "36px 28px", flexDirection: "row", gap: 6, height: 50 }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{ flex: 1, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.35)" }}>
          <div
            style={{
              height: "100%",
              borderRadius: 3,
              background: "white",
              width: `${(i < index ? 1 : i === index ? p : 0) * 100}%`,
            }}
          />
        </div>
      ))}
    </AbsoluteFill>
  );
};

const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 14 } });
  const out = interpolate(frame, [TITLE_FRAMES - 8, TITLE_FRAMES], [1, 0], { extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill
      style={{ background: "#f6e3d3", justifyContent: "center", alignItems: "center", opacity: out, fontFamily: font }}
    >
      <div style={{ transform: `scale(${0.8 + 0.2 * s})`, textAlign: "center", color: "#1f1a17" }}>
        <div style={{ fontSize: 34, fontWeight: 700, color: "#d9622b", letterSpacing: 4 }}>SEWING HACK</div>
        <div style={{ fontSize: 92, fontWeight: 900, lineHeight: 1 }}>Cordless<br />Piping</div>
        <div style={{ fontSize: 34, marginTop: 20 }}>in {SCENES.length} quick steps</div>
      </div>
    </AbsoluteFill>
  );
};

const Step: React.FC<{ scene: Scene; index: number }> = ({ scene, index }) => (
  <AbsoluteFill>
    <Clip scene={scene} />
    <Progress index={index} total={SCENES.length} frames={sceneFrames(scene)} />
    <Caption step={index + 1} total={SCENES.length} text={scene.caption} />
  </AbsoluteFill>
);

export const ReEdit: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "black" }}>
    <Series>
      <Series.Sequence durationInFrames={TITLE_FRAMES}>
        <TitleCard />
      </Series.Sequence>
      {SCENES.map((scene, i) => (
        <Series.Sequence key={scene.id} durationInFrames={sceneFrames(scene)}>
          <Step scene={scene} index={i} />
        </Series.Sequence>
      ))}
    </Series>
  </AbsoluteFill>
);
