import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

// page.tsx is a client component, so its metadata lives here.
export const metadata: Metadata = pageMetadata({
  title: "Your profile",
  description: "Your Lampstand coins, certificates and subscription.",
  path: "/profile",
  noindex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
