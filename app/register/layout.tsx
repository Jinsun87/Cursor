import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

// page.tsx is a client component, so its metadata lives here.
export const metadata: Metadata = pageMetadata({
  title: "Create a free account",
  description: "Create a free Lampstand account to keep your coins, quizzes and certificates.",
  path: "/register",
  noindex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
