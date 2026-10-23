import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { VideoChapter, VideoProps, VideoVerse } from "./types";

const FADE = 1.5; // seconds for crossfades between paintings
const GOLD = "#e4c04a";
const INK = "#f1ebdd";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Paintings in order: each shows from the first verse that uses it until the next one begins. */
function scenesOf(chapters: VideoChapter[], end: number) {
  const scenes: { image: string; background: string; from: number; to: number }[] = [];
  for (const c of chapters) {
    for (const v of c.verses) {
      const last = scenes[scenes.length - 1];
      if (!last || last.image !== v.image) scenes.push({ image: v.image, background: v.background, from: v.start, to: end });
    }
  }
  scenes.forEach((s, i) => (s.to = i < scenes.length - 1 ? scenes[i + 1].from : end));
  scenes[0].from = 0;
  return scenes;
}

/** The verse being read at time t, and when it ends (the next verse or the chapter's end). */
function verseAt(chapters: VideoChapter[], t: number): { chapter: VideoChapter; verse: VideoVerse; to: number } | null {
  for (const c of chapters) {
    if (t < c.start - 0.5 || t > c.start + c.duration) continue;
    for (let i = c.verses.length - 1; i >= 0; i--) {
      if (c.verses[i].start <= t) return { chapter: c, verse: c.verses[i], to: i < c.verses.length - 1 ? c.verses[i + 1].start : c.start + c.duration };
    }
    return { chapter: c, verse: c.verses[0], to: c.verses[1]?.start ?? c.start + c.duration };
  }
  return null;
}

export const SleepVideo: React.FC<VideoProps> = ({ title, subtitle, chapters, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const scenes = scenesOf(chapters, duration);
  const now = verseAt(chapters, t);
  const master = Math.min(interpolate(t, [0, 3], [0, 1], clamp), interpolate(t, [duration - 4, duration], [1, 0], clamp));

  const textOpacity = now
    ? Math.min(interpolate(t, [now.verse.start, now.verse.start + 1], [0, 1], clamp), interpolate(t, [now.to - 0.8, now.to], [1, 0], clamp))
    : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#07080c", opacity: master }}>
      {scenes.map((s, i) => {
        if (t < s.from - FADE || t > s.to + FADE) return null;
        const opacity = Math.min(
          i === 0 ? 1 : interpolate(t, [s.from - FADE, s.from], [0, 1], clamp),
          i === scenes.length - 1 ? 1 : interpolate(t, [s.to, s.to + FADE], [1, 0], clamp),
        );
        // A very slow drift: 6% over the scene.
        const zoom = interpolate(t, [s.from, s.to], [1, 1.06], clamp);
        return (
          <AbsoluteFill key={`${s.image}-${i}`} style={{ opacity }}>
            {/* Blurred once in advance by render.ts: blurring in every frame made renders 3x slower. */}
            <Img src={staticFile(s.background)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", left: 170, top: 70, width: 530, height: 940, overflow: "hidden", borderRadius: 6, boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }}>
              <Img src={staticFile(s.image)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})` }} />
            </div>
          </AbsoluteFill>
        );
      })}

      <div style={{ position: "absolute", left: 820, right: 150, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ fontFamily: "Georgia, serif", color: GOLD, letterSpacing: "0.22em", fontSize: 22, textTransform: "uppercase", marginBottom: 28 }}>
          {now ? `${now.chapter.label} · ${now.chapter.title}` : title}
        </div>
        {now ? (
          <div style={{ opacity: textOpacity, fontFamily: "Georgia, serif", color: INK, fontSize: now.verse.text.length > 260 ? 38 : 46, lineHeight: 1.45 }}>
            <sup style={{ fontSize: 22, color: GOLD, marginRight: 10 }}>{now.verse.n}</sup>
            {now.verse.text}
          </div>
        ) : (
          <div style={{ fontFamily: "Georgia, serif", color: INK, fontSize: 46 }}>{subtitle}</div>
        )}
      </div>

      <div style={{ position: "absolute", left: 820, bottom: 60, fontFamily: "Georgia, serif", color: "rgba(241,235,221,0.5)", fontSize: 20 }}>
        Berean Standard Bible · lampstandbible.com
      </div>

      {chapters.map((c) => (
        <Sequence key={c.label} from={Math.round(c.start * fps)} durationInFrames={Math.ceil(c.duration * fps)}>
          <Audio src={staticFile(c.audio)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
