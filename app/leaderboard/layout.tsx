import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

// page.tsx is a client component, so its metadata lives here.
export const metadata: Metadata = pageMetadata({
  title: "Leaderboard",
  description: "Certificates, quizzes completed and coins earned on Lampstand.",
  path: "/leaderboard",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
