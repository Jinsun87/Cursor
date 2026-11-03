import { AbsoluteFill, Audio, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { EndCard } from "./EndCard";
import { END_CARD, type AdProps, type AdWord } from "./types";

const GOLD = "#e4c04a";
const INK = "#f1ebdd";
const FADE = 0.8;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const serif = "Georgia, 'Times New Roman', serif";

/** Caption lines: up to 5 words or 26 characters, ending early at a comma or full stop. */
function linesOf(words: AdWord[]): AdWord[][] {
  const lines: AdWord[][] = [];
  let line: AdWord[] = [];
  for (const w of words) {
    const len = line.reduce((n, x) => n + x.text.length + 1, 0);
    if (line.length && (line.length >= 5 || len + w.text.length > 26)) {
      lines.push(line);
      line = [];
    }
    line.push(w);
    if (/[.,;:!?”’]$/.test(w.text)) {
      lines.push(line);
      line = [];
    }
  }
  if (line.length) lines.push(line);
  return lines;
}

/**
 * 1080×1920 Reel for Meta ads. Kept clear of Instagram's own buttons and caption: nothing in the top
 * 220 px or the bottom 640 px except the painting.
 */
export const AdReel: React.FC<AdProps> = ({ hook, kicker, audio, clip, words, images, cta, ctaSub }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const lines = linesOf(words);
  const lineIndex = lines.findIndex((l, i) => t >= l[0].start - 0.15 && t < (lines[i + 1]?.[0].start ?? l[l.length - 1].end + 1.2) - 0.15);
  const line = lineIndex >= 0 ? lines[lineIndex] : null;
  const endCard = interpolate(t, [clip, clip + 0.6], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#07080c" }}>
      {images.map((im, i) => {
        const to = images[i + 1]?.at ?? clip + END_CARD;
        if (t < im.at - FADE || t > to + FADE) return null;
        const opacity = Math.min(i === 0 ? 1 : interpolate(t, [im.at - FADE, im.at], [0, 1], clamp), interpolate(t, [to, to + FADE], [1, 0], clamp));
        // Slow push in across the whole clip, so cuts between paintings keep moving.
        const zoom = interpolate(t, [0, clip + END_CARD], [1.04, 1.16], clamp);
        return (
          <AbsoluteFill key={`${im.src}-${i}`} style={{ opacity }}>
            <Img src={staticFile(im.src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})` }} />
          </AbsoluteFill>
        );
      })}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(7,8,12,0.78) 0%, rgba(7,8,12,0.15) 32%, rgba(7,8,12,0.2) 46%, rgba(7,8,12,0.72) 70%, rgba(7,8,12,0.9) 100%)" }} />

      <div style={{ position: "absolute", left: 80, right: 80, top: 250, opacity: 1 - endCard, textAlign: "center" }}>
        <div style={{ fontFamily: serif, color: GOLD, letterSpacing: "0.2em", fontSize: 28, textTransform: "uppercase" }}>{kicker}</div>
        <div style={{ fontFamily: serif, color: INK, fontSize: hook.length > 48 ? 62 : 74, lineHeight: 1.15, marginTop: 22, textWrap: "balance", textShadow: "0 4px 24px rgba(0,0,0,0.6)" }}>
          {hook}
        </div>
      </div>

      {line ? (
        <div style={{ position: "absolute", left: 70, right: 70, top: 1010, opacity: 1 - endCard, textAlign: "center", fontFamily: serif, fontSize: 64, lineHeight: 1.25, textWrap: "balance", textShadow: "0 3px 18px rgba(0,0,0,0.85)" }}>
          {line.map((w, i) => (
            <span key={i} style={{ color: t >= w.start - 0.05 ? (t < w.end + 0.1 ? GOLD : INK) : "rgba(241,235,221,0.55)" }}>
              {w.text}{" "}
            </span>
          ))}
        </div>
      ) : null}

      <EndCard opacity={endCard} cta={cta} ctaSub={ctaSub} />

      <Audio src={staticFile(audio)} />
    </AbsoluteFill>
  );
};
