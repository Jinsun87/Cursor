import type { NextConfig } from "next";
import { adsTxtRedirects } from "./lib/ezoic";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  redirects: async () => adsTxtRedirects(),
};

export default nextConfig;
