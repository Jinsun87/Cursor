import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

// page.tsx is a client component, so its metadata lives here.
export const metadata: Metadata = pageMetadata({
  title: "Premium",
  description: "Remove ads and support Lampstand for $4.99 a month or $39.99 a year.",
  path: "/premium",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
