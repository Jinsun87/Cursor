import { Composition } from "remotion";
import { SleepVideo } from "./SleepVideo";
import { Thumbnail } from "./Thumbnail";
import { AdReel } from "./AdReel";
import { FactReel } from "./FactReel";
import { PovDemo } from "./PovDemo";
import { END_CARD, FPS, type AdProps, type FactProps, type PovProps, type VideoProps } from "./types";

// Placeholder props for the Remotion studio; render.ts always passes real ones.
const adSample: AdProps = { hook: "Psalm 23, read slowly for sleep", kicker: "Psalm 23", audio: "", clip: 5, words: [], images: [], cta: "Listen free", ctaSub: "" };
const factSample: FactProps = { question: "Why?", reference: "", audio: "", clip: 5, words: [], images: [], footer: "", endLine: "" };
const povSample: PovProps = { screens: [], taps: [], drags: [], camera: [{ at: 0, y: 300 }], captions: [], narration: { src: "", at: 0, from: 0 }, rain: { src: "", levels: [] }, dim: 8, dark: 10, cta: "", ctaSub: "" };
const sample: VideoProps = { title: "Genesis 1", subtitle: "Read softly for sleep", tagline: "Word for word · Lampstand", chapters: [], duration: 10 };

export const Root: React.FC = () => (
  <>
    <Composition
      id="SleepVideo"
      component={SleepVideo}
      fps={FPS}
      width={1920}
      height={1080}
      durationInFrames={10 * FPS}
      defaultProps={sample}
      calculateMetadata={({ props }) => ({ durationInFrames: Math.ceil(props.duration * FPS) })}
    />
    <Composition
      id="FactReel"
      component={FactReel}
      fps={FPS}
      width={1080}
      height={1920}
      durationInFrames={10 * FPS}
      defaultProps={factSample}
      calculateMetadata={({ props }) => ({ durationInFrames: Math.ceil((props.clip + 2.2) * FPS) })}
    />
    <Composition
      id="AdReel"
      component={AdReel}
      fps={FPS}
      width={1080}
      height={1920}
      durationInFrames={10 * FPS}
      defaultProps={adSample}
      calculateMetadata={({ props }) => ({ durationInFrames: Math.ceil((props.clip + (props.endCard ?? END_CARD)) * FPS) })}
    />
    <Composition
      id="PovDemo"
      component={PovDemo}
      fps={FPS}
      width={1080}
      height={1920}
      durationInFrames={10 * FPS}
      defaultProps={povSample}
      calculateMetadata={({ props }) => ({ durationInFrames: Math.ceil((props.dark + END_CARD) * FPS) })}
    />
    <Composition id="Thumbnail" component={Thumbnail} fps={FPS} width={1280} height={720} durationInFrames={1} defaultProps={sample} />
  </>
);
