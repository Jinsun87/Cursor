import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

// page.tsx is a client component, so its metadata lives here.
export const metadata: Metadata = pageMetadata({
  title: "Donate",
  description: "Support Lampstand with an optional one-time gift.",
  path: "/donate",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
