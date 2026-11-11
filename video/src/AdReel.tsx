import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
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
export const AdReel: React.FC<AdProps> = ({ hook, kicker, audio, clip, words, images, cta, ctaSub, hookUntil, phones, phonesUntil, badge, endNote, punch, endCard: endCardSeconds }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const lines = linesOf(words);
  const END = endCardSeconds ?? END_CARD;
  const ease = (x: number) => 1 - (1 - x) ** 3;
  // Punch opening: 0 while the hook fills the screen, 1 once it has settled at the top.
  const settle = punch ? interpolate(t, [2.1, 2.7], [0, 1], { ...clamp, easing: ease }) : 1;
  const hookSize = hook.length > 48 ? 62 : 74;
  const lineIndex = lines.findIndex((l, i) => t >= l[0].start - 0.15 && t < (lines[i + 1]?.[0].start ?? l[l.length - 1].end + 1.2) - 0.15);
  const line = lineIndex >= 0 ? lines[lineIndex] : null;
  const endCard = interpolate(t, [clip, clip + 0.6], [0, 1], clamp);
  const hookOpacity = hookUntil === undefined ? 1 - endCard : interpolate(t, [hookUntil, hookUntil + 0.6], [1, 0], clamp);
  const phoneEnd = phonesUntil ?? clip;
  const phoneShown = phones?.length
    ? Math.min(interpolate(t, [phones[0].at - 0.5, phones[0].at], [0, 1], clamp), interpolate(t, [phoneEnd, phoneEnd + 0.5], [1, 0], clamp))
    : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#07080c" }}>
      {images.map((im, i) => {
        const to = images[i + 1]?.at ?? clip + END;
        if (t < im.at - FADE || t > to + FADE) return null;
        const opacity = Math.min(i === 0 ? 1 : interpolate(t, [im.at - FADE, im.at], [0, 1], clamp), interpolate(t, [to, to + FADE], [1, 0], clamp));
        // Slow push in across the whole clip, so cuts between paintings keep moving.
        // A punch opening adds a fast push-in over the first second, so the very first frames move.
        const zoom =
          interpolate(t, [0, clip + END], [1.04, 1.16], clamp) + (punch ? interpolate(t, [0, 1.1], [0.14, 0], { ...clamp, easing: ease }) : 0);
        return (
          <AbsoluteFill key={`${im.src}-${i}`} style={{ opacity }}>
            {im.video ? (
              // Started a fade early so it is already moving as it appears; scaled past the generator's corner watermark.
              <Sequence from={Math.max(0, Math.round((im.at - (i === 0 ? 0 : FADE)) * fps))} layout="none">
                <OffthreadVideo
                  muted
                  src={staticFile(im.src)}
                  playbackRate={im.rate ?? 1}
                  style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom + 0.08})` }}
                />
              </Sequence>
            ) : (
              <Img src={staticFile(im.src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})` }} />
            )}
          </AbsoluteFill>
        );
      })}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(7,8,12,0.78) 0%, rgba(7,8,12,0.15) 32%, rgba(7,8,12,0.2) 46%, rgba(7,8,12,0.72) 70%, rgba(7,8,12,0.9) 100%)" }} />

      <div style={{ position: "absolute", left: 80, right: 80, top: (badge ? 230 : 250) + (1 - settle) * 330, opacity: hookOpacity, textAlign: "center", transform: `scale(${interpolate(t, [0, 0.45], [punch ? 1.16 : 1.08, 1], { ...clamp, easing: ease })})` }}>
        {badge ? (
          <div style={{ display: "inline-block", fontFamily: serif, color: "#1a1408", background: GOLD, borderRadius: 999, padding: "8px 22px", fontSize: 26, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 22 }}>
            {badge}
          </div>
        ) : null}
        <div style={{ fontFamily: serif, color: GOLD, letterSpacing: "0.2em", fontSize: 28, textTransform: "uppercase" }}>{kicker}</div>
        <div style={{ fontFamily: serif, color: INK, fontSize: hookSize + (1 - settle) * 26, lineHeight: 1.15, marginTop: 22, textWrap: "balance", textShadow: "0 4px 24px rgba(0,0,0,0.6)" }}>
          {hook}
        </div>
      </div>

      {phones?.length && phoneShown > 0 ? (
        <>
          <AbsoluteFill style={{ backgroundColor: "rgba(7,8,12,0.45)", opacity: phoneShown }} />
          <div
            style={{
              position: "absolute", left: (1080 - 352) / 2, top: 220, width: 352, height: 762, borderRadius: 46, overflow: "hidden",
              border: "6px solid #1b1c22", boxShadow: "0 30px 90px rgba(0,0,0,0.75), 0 0 0 2px rgba(228,192,74,0.35)",
              opacity: phoneShown, transform: `translateY(${(1 - phoneShown) * 40}px)`, backgroundColor: "#07080c",
            }}
          >
            {phones.map((p, i) => {
              const to = phones[i + 1]?.at ?? phoneEnd + 1;
              const o = Math.min(i === 0 ? 1 : interpolate(t, [p.at - 0.3, p.at], [0, 1], clamp), interpolate(t, [to, to + 0.3], [1, 0], clamp));
              return o > 0 ? (
                <Img key={p.src} src={staticFile(p.src)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: o }} />
              ) : null;
            })}
          </div>
        </>
      ) : null}

      {line ? (
        <div style={{ position: "absolute", left: 70, right: 70, top: 1010, opacity: (1 - endCard) * (punch ? interpolate(t, [2.2, 2.6], [0, 1], clamp) : 1), textAlign: "center", fontFamily: serif, fontSize: 64, lineHeight: 1.25, textWrap: "balance", textShadow: "0 3px 18px rgba(0,0,0,0.85)" }}>
          {line.map((w, i) => (
            <span key={i} style={{ color: t >= w.start - 0.05 ? (t < w.end + 0.1 ? GOLD : INK) : "rgba(241,235,221,0.55)" }}>
              {w.text}{" "}
            </span>
          ))}
        </div>
      ) : null}

      <EndCard opacity={endCard} cta={cta} ctaSub={ctaSub} note={endNote} />

      <Audio src={staticFile(audio)} />
    </AbsoluteFill>
  );
};
