import type { MetadataRoute } from "next";
import { QUIZZES } from "@/lib/catalog";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const staticPaths = ["", "/quizzes", "/daily", "/how-it-works", "/privacy", "/premium"];
  const quizPaths = QUIZZES.filter((q) => !q.isSecret).map((q) => `/quizzes/${q.slug}`);
  return [...staticPaths, ...quizPaths].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: path.includes("/quizzes/") ? "weekly" : "daily",
    priority: path === "" ? 1 : path === "/quizzes/open-the-book" ? 0.9 : 0.6,
  }));
}
