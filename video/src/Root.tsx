import { Composition, Folder } from "remotion";
import { Clip } from "./Clip";
import { ReEdit, reEditFrames } from "./ReEdit";
import { FPS, HEIGHT, SCENES, WIDTH } from "./scenes";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="ReEdit" component={ReEdit} durationInFrames={reEditFrames()} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Folder name="Scenes">
      {SCENES.map((scene) => (
        <Composition
          key={scene.id}
          id={`Scene-${scene.id}`}
          component={Clip}
          defaultProps={{ scene: { ...scene, speed: 1 }, cleanTop: false }}
          durationInFrames={Math.round((scene.to - scene.from) * FPS)}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
      ))}
    </Folder>
  </>
);
