import type { NextConfig } from "next";
import { adsTxtRedirects } from "./lib/ezoic";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  redirects: async () => adsTxtRedirects(),
  headers: async () => [
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
