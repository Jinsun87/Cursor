import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lampstand — Scripture & Quizzes",
    short_name: "Lampstand",
    description:
      "Know the text: Illuminated Bible reading, WhatsApp-style scripture stories, and active recall quizzes.",
    start_url: "/",
    display: "standalone",
    background_color: "#0c0a09",
    theme_color: "#d4af37",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    categories: ["education", "lifestyle", "books"],
  };
}
