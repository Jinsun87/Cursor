import { Composition } from "remotion";
import { SleepVideo } from "./SleepVideo";
import { Thumbnail } from "./Thumbnail";
import { FPS, type VideoProps } from "./types";

// Placeholder props for the Remotion studio; render.ts always passes real ones.
const sample: VideoProps = { title: "Genesis 1", subtitle: "Read softly for sleep", chapters: [], duration: 10 };

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
    <Composition id="Thumbnail" component={Thumbnail} fps={FPS} width={1280} height={720} durationInFrames={1} defaultProps={sample} />
  </>
);
