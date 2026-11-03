import { AbsoluteFill, Img, staticFile } from "remotion";

const serif = "Georgia, 'Times New Roman', serif";

/** The closing card of every ad: app icon, the offer, the address. Needs lampstand-icon.png in the render's public folder. */
export const EndCard: React.FC<{ opacity: number; cta: string; ctaSub: string }> = ({ opacity, cta, ctaSub }) => (
  <AbsoluteFill style={{ opacity, backgroundColor: "rgba(7,8,12,0.82)", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 90 }}>
    <Img src={staticFile("lampstand-icon.png")} style={{ width: 150, height: 150, borderRadius: 34, marginTop: -260 }} />
    <div style={{ fontFamily: serif, color: "#f1ebdd", fontSize: 84, marginTop: 50 }}>{cta}</div>
    <div style={{ fontFamily: serif, color: "#e4c04a", fontSize: 46, marginTop: 24 }}>lampstandbible.com</div>
    <div style={{ fontFamily: serif, color: "rgba(241,235,221,0.75)", fontSize: 38, marginTop: 40, lineHeight: 1.35 }}>{ctaSub}</div>
  </AbsoluteFill>
);
