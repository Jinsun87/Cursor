import type { NextConfig } from "next";
import { adsTxtRedirects } from "./lib/ezoic";
import { STAGING_HOSTS } from "./lib/site";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  redirects: async () => adsTxtRedirects(),
  headers: async () => [
    // Staging copies of the site must never compete with lampstandbible.com in search.
    ...STAGING_HOSTS.map((host) => ({
      source: "/:path*",
      has: [{ type: "host" as const, value: host }],
      headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
    })),
    {
      source: "/audio/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
  ],
};

export default nextConfig;
