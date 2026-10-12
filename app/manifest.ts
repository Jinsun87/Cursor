import type { MetadataRoute } from "next";

/**
 * Makes Lampstand installable ("Install app" in Chrome, Add to Home Screen on
 * iPhone). Chrome needs a 192 px and a 512 px icon before it offers Install;
 * the icons come from scripts/make-app-icons.mjs.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Lampstand: Bible Walk, Sleep & Quizzes",
    short_name: "Lampstand",
    description:
      "Whole Bible chapters read aloud: briskly for a walk by day, softly for sleep at night. Plus breathing exercises and Bible quizzes.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0c0a09",
    theme_color: "#0c0a09",
    orientation: "portrait-primary",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    categories: ["education", "lifestyle", "books"],
  };
}
