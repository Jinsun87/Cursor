import { AbsoluteFill, Audio, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { AdWord, FactProps } from "./types";

const GOLD = "#f2c94c";
const INK = "#f6efdc";
const serif = "Georgia, 'Times New Roman', serif";
const sans = "Inter, 'Segoe UI', Arial, sans-serif";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = (x: number) => 1 - (1 - x) ** 3;

/** Sentences of the narration, each with the time its first word is spoken. */
function sentencesOf(words: AdWord[]): { text: string; start: number }[] {
  const out: { text: string; start: number }[] = [];
  let cur: AdWord[] = [];
  for (const w of words) {
    cur.push(w);
    if (/[.!?]["”’]?$/.test(w.text)) {
      out.push({ text: cur.map((x) => x.text).join(" "), start: cur[0].start });
      cur = [];
    }
  }
  if (cur.length) out.push({ text: cur.map((x) => x.text).join(" "), start: cur[0].start });
  return out;
}

/**
 * "Why …?" Bible fact reel (1080×1920): a question bar from the first frame, the whole fact building
 * up on screen sentence by sentence (readable on mute), a bright painting behind, and a bar naming
 * the app (no link). Short end: follow for tomorrow's.
 */
export const FactReel: React.FC<FactProps> = ({ question, reference, audio, clip, words, images, footer, endLine }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const sentences = sentencesOf(words);
  const end = interpolate(t, [clip, clip + 0.5], [0, 1], clamp);
  const total = clip + 2.2;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0a08" }}>
      {images.map((im, i) => {
        const to = images[i + 1]?.at ?? total;
        if (t < im.at - 0.7 || t > to + 0.7) return null;
        const opacity = Math.min(i === 0 ? 1 : interpolate(t, [im.at - 0.7, im.at], [0, 1], clamp), interpolate(t, [to, to + 0.7], [1, 0], clamp));
        const zoom = interpolate(t, [im.at - 0.7, to + 0.7], [1.06, 1.16], clamp) + (i === 0 ? interpolate(t, [0, 1], [0.1, 0], { ...clamp, easing: ease }) : 0);
        return (
          <AbsoluteFill key={`${im.src}-${i}`} style={{ opacity }}>
            <Img src={staticFile(im.src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})`, filter: "brightness(1.12) saturate(1.05)" }} />
          </AbsoluteFill>
        );
      })}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.05) 18%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.55) 75%, rgba(0,0,0,0.75) 100%)" }} />

      {/* The question: on screen from the very first frame. */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 300, display: "flex", justifyContent: "center", opacity: 1 - end * 0.85, transform: `scale(${interpolate(t, [0, 0.4], [1.12, 1], { ...clamp, easing: ease })})` }}>
        <div style={{ background: GOLD, color: "#141005", fontFamily: sans, fontWeight: 900, fontSize: question.length > 30 ? 58 : 66, lineHeight: 1.1, padding: "22px 34px", borderRadius: 14, textAlign: "center", textTransform: "uppercase", letterSpacing: "0.01em", boxShadow: "0 18px 50px rgba(0,0,0,0.45)" }}>
          {question}
        </div>
      </div>

      {/* The fact, building up as it is read. */}
      <div style={{ position: "absolute", left: 80, right: 80, top: 560, opacity: 1 - end }}>
        <div style={{ background: "rgba(8,8,8,0.55)", borderRadius: 22, padding: "30px 34px", backdropFilter: "blur(2px)" }}>
          <p style={{ margin: 0, fontFamily: serif, fontSize: 44, lineHeight: 1.36, color: INK, textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>
            {sentences.map((s, i) => {
              // Only what has been read so far, so the box grows with the fact.
              if (t < s.start - 0.25) return null;
              const shown = interpolate(t, [s.start - 0.25, s.start + 0.15], [0, 1], clamp);
              const next = sentences[i + 1]?.start ?? clip;
              const now = t >= s.start - 0.25 && t < next - 0.25;
              return (
                <span key={i} style={{ opacity: shown, color: now ? "#ffffff" : "rgba(246,239,220,0.82)", fontWeight: now ? 700 : 400, transition: "none" }}>
                  {s.text}{" "}
                </span>
              );
            })}
          </p>
          <p style={{ margin: "18px 0 0", fontFamily: sans, fontSize: 28, fontWeight: 700, color: GOLD, letterSpacing: "0.06em" }}>📖 {reference}</p>
        </div>
      </div>

      {/* Bottom bar: the app, by name only. */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 1500, display: "flex", justifyContent: "center", opacity: 1 - end }}>
        <div style={{ background: GOLD, color: "#141005", fontFamily: sans, fontWeight: 800, fontSize: 30, padding: "14px 26px", borderRadius: 10, textAlign: "center", textTransform: "uppercase", letterSpacing: "0.03em" }}>{footer}</div>
      </div>

      {/* End: follow for tomorrow's. */}
      <AbsoluteFill style={{ opacity: end, justifyContent: "center", alignItems: "center", background: "rgba(5,5,5,0.55)" }}>
        <div style={{ textAlign: "center", padding: "0 90px" }}>
          <div style={{ fontFamily: sans, fontWeight: 900, fontSize: 70, color: GOLD, textTransform: "uppercase", lineHeight: 1.1 }}>{endLine}</div>
          <div style={{ fontFamily: serif, fontSize: 46, color: INK, marginTop: 26 }}>Sleep Bible · a new one every day</div>
        </div>
      </AbsoluteFill>

      <Audio src={staticFile(audio)} />
    </AbsoluteFill>
  );
};
