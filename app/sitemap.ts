import type { MetadataRoute } from "next";
import { QUIZZES, SERIES } from "@/lib/catalog";
import { CANONICAL_ORIGIN } from "@/lib/site";

type Entry = { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] };

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: Entry[] = [
    { path: "/", priority: 1, changeFrequency: "daily" },
    { path: "/quizzes", priority: 0.9, changeFrequency: "weekly" },
    { path: "/daily", priority: 0.8, changeFrequency: "daily" },
    { path: "/read", priority: 0.8, changeFrequency: "weekly" },
    { path: "/pricing", priority: 0.6, changeFrequency: "monthly" },
    { path: "/premium", priority: 0.5, changeFrequency: "monthly" },
    { path: "/how-it-works", priority: 0.5, changeFrequency: "monthly" },
    { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
    { path: "/refunds", priority: 0.2, changeFrequency: "yearly" },
    ...QUIZZES.filter((q) => !q.isSecret).map((q) => ({
      path: `/quizzes/${q.slug}`,
      priority: q.category === "bible" ? 0.8 : 0.4,
      changeFrequency: "monthly" as const,
    })),
    ...SERIES.map((s) => ({ path: `/series/${s.slug}`, priority: 0.5, changeFrequency: "monthly" as const })),
  ];
  return entries.map(({ path, ...rest }) => ({ url: `${CANONICAL_ORIGIN}${path === "/" ? "" : path}`, ...rest }));
}
