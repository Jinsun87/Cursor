import type { MetadataRoute } from "next";
import { CANONICAL_ORIGIN } from "@/lib/site";

// Staging hosts (quiz.mediareferee.com) also send X-Robots-Tag: noindex via next.config.ts.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/auth/", "/profile", "/welcome", "/certificate/", "/walk-preview"],
    },
    sitemap: `${CANONICAL_ORIGIN}/sitemap.xml`,
    host: CANONICAL_ORIGIN,
  };
}
