import type { NextConfig } from "next";
import { adsTxtRedirects } from "./lib/ezoic";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  redirects: async () => [
    ...adsTxtRedirects(),
    {
      source: "/Pricing",
      destination: "/pricing",
      permanent: true,
    },
    {
      source: "/Terms",
      destination: "/terms",
      permanent: true,
    },
    {
      source: "/Privacy",
      destination: "/privacy",
      permanent: true,
    },
    {
      source: "/Refund",
      destination: "/refunds",
      permanent: true,
    },
    {
      source: "/Refunds",
      destination: "/refunds",
      permanent: true,
    },
    {
      source: "/Donate",
      destination: "/donate",
      permanent: true,
    },
  ],
};

export default nextConfig;
