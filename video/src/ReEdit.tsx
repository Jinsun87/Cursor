import { AbsoluteFill, Audio, Img, Sequence, Series, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Clip } from "./Clip";
import { Flash, PopLayer, YELLOW, font, outline } from "./Pops";
import { SCENES, sceneFrames, type Scene } from "./scenes";

export const TITLE_FRAMES = 60;
export const reEditFrames = () => TITLE_FRAMES + SCENES.reduce((n, s) => n + sceneFrames(s), 0);

// "Fold the *edge* under" -> words, with *starred* ones flagged as keywords.
const parseCaption = (text: string) =>
  text.split(/(\*[^*]+\*)/).filter(Boolean).flatMap((part) => {
    const key = part.startsWith("*");
    return part.replace(/\*/g, "").split(/(\s+)/).filter(Boolean).map((w) => ({ w, key }));
  });

const Caption: React.FC<{ step: number; total: number; text: string }> = ({ step, total, text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = parseCaption(text);
  let wi = 0;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 150 }}>
      <div style={{ textAlign: "center", maxWidth: 640, fontFamily: font }}>
        <div
          style={{
            display: "inline-block",
            fontSize: 26,
            color: "black",
            background: YELLOW,
            borderRadius: 8,
            padding: "2px 12px",
            marginBottom: 10,
            opacity: spring({ frame, fps, config: { damping: 200 }, durationInFrames: 8 }),
          }}
        >
          STEP {step}/{total}
        </div>
        <div style={{ fontSize: 52, lineHeight: 1.18 }}>
          {words.map(({ w, key }, i) => {
            if (/^\s+$/.test(w)) return <span key={i}>{w}</span>;
            // Word-by-word reveal, 3 frames apart; keywords land bigger in yellow.
            const s = spring({ frame: frame - 3 * wi++, fps, config: { damping: 12, stiffness: 200 } });
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  color: key ? YELLOW : "white",
                  fontSize: key ? 60 : undefined,
                  fontStyle: key ? "italic" : undefined,
                  textShadow: `${outline(key ? 5 : 4)}, 0 6px 14px rgba(0,0,0,0.5)`,
                  transform: `translateY(${(1 - s) * 30}px) scale(${key ? 0.6 + 0.4 * s : 1})`,
                  opacity: Math.min(1, s * 1.5),
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
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
              background: YELLOW,
              width: `${(i < index ? 1 : i === index ? p : 0) * 100}%`,
            }}
          />
        </div>
      ))}
    </AbsoluteFill>
  );
};

const HOOK_ICONS = ["sewing-needle.svg", "scissors.svg", "straight-ruler.svg", "yarn.svg", "sparkles.svg"];

// Hook: finished result behind a punchy title, with an icon row dropping in
// (the reference opens on a row of icons).
const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 4, fps, config: { damping: 10 } });
  const out = interpolate(frame, [TITLE_FRAMES - 6, TITLE_FRAMES], [1, 0], { extrapolateLeft: "clamp" });
  const zoom = interpolate(frame, [0, TITLE_FRAMES], [1.05, 1.2]);
  return (
    <AbsoluteFill style={{ backgroundColor: "black", opacity: out }}>
      <Img
        src={staticFile("pops/result.jpg")}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})`, filter: "brightness(0.55) blur(2px)" }}
      />
      <AbsoluteFill style={{ flexDirection: "row", justifyContent: "center", gap: 18, paddingTop: 110 }}>
        {HOOK_ICONS.map((src, i) => {
          const d = spring({ frame: frame - i * 4, fps, config: { damping: 9 } });
          return (
            <Img
              key={src}
              src={staticFile(`pops/${src}`)}
              style={{ width: 96, height: 96, transform: `translateY(${(1 - d) * -160}px) rotate(${(1 - d) * 40}deg)` }}
            />
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", fontFamily: font, textAlign: "center" }}>
        <div style={{ transform: `scale(${0.4 + 0.6 * s}) rotate(-3deg)` }}>
          <div style={{ fontSize: 44, color: "white", textShadow: outline(4) }}>SEWING HACK</div>
          <div style={{ fontSize: 118, lineHeight: 1, fontStyle: "italic", color: YELLOW, textShadow: `${outline(7)}, 0 12px 30px rgba(0,0,0,0.6)` }}>
            Piping
            <br />
            without cord
          </div>
          <div style={{ fontSize: 42, color: "white", marginTop: 18, textShadow: outline(4) }}>{SCENES.length} quick steps</div>
        </div>
      </AbsoluteFill>
      <Audio src={staticFile("sfx/whoosh.wav")} volume={0.6} />
    </AbsoluteFill>
  );
};

const Step: React.FC<{ scene: Scene; index: number }> = ({ scene, index }) => (
  <AbsoluteFill>
    <Clip scene={scene} />
    <Progress index={index} total={SCENES.length} frames={sceneFrames(scene)} />
    <PopLayer pops={scene.pops ?? []} />
    <Caption step={index + 1} total={SCENES.length} text={scene.caption} />
    {scene.flash && (
      <Sequence durationInFrames={12} layout="none">
        <Flash />
      </Sequence>
    )}
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
