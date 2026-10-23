import { AbsoluteFill, Img, staticFile } from "remotion";
import type { VideoProps } from "./types";

/** 1280×720 YouTube thumbnail: the first painting, big title, quiet subtitle. */
export const Thumbnail: React.FC<VideoProps> = ({ title, subtitle, chapters }) => {
  const first = chapters[0].verses[0];
  return (
    <AbsoluteFill style={{ backgroundColor: "#07080c" }}>
      <Img src={staticFile(first.background)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", left: 70, top: 40, width: 360, height: 640, overflow: "hidden", borderRadius: 6, boxShadow: "0 24px 60px rgba(0,0,0,0.6)" }}>
        <Img src={staticFile(first.image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ position: "absolute", left: 490, right: 60, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ fontFamily: "Georgia, serif", color: "#f1ebdd", fontSize: 92, lineHeight: 1.05, fontWeight: 600 }}>{title}</div>
        <div style={{ fontFamily: "Georgia, serif", color: "#e4c04a", fontSize: 40, marginTop: 24 }}>{subtitle}</div>
        <div style={{ fontFamily: "Georgia, serif", color: "rgba(241,235,221,0.6)", fontSize: 26, marginTop: 40 }}>Word for word · Lampstand</div>
      </div>
    </AbsoluteFill>
  );
};
