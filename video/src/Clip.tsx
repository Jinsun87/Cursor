import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";
import { FPS, SOURCE, type Scene } from "./scenes";

// The source has a burned-in title bar across the top ~9% of the frame.
// Zooming 1.12x anchored at the bottom pushes it out of view.
const ZOOM = 1.12;

export const Clip: React.FC<{ scene: Scene; cleanTop?: boolean }> = ({ scene, cleanTop = true }) => (
  <AbsoluteFill style={{ backgroundColor: "black", overflow: "hidden" }}>
    <OffthreadVideo
      src={staticFile(SOURCE)}
      startFrom={Math.round(scene.from * FPS)}
      endAt={Math.round(scene.to * FPS)}
      playbackRate={scene.speed}
      style={{
        width: "100%",
        height: "100%",
        transform: cleanTop ? `scale(${ZOOM})` : undefined,
        transformOrigin: "50% 100%",
      }}
    />
  </AbsoluteFill>
);
