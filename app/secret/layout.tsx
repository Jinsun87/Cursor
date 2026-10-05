import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

// page.tsx is a client component, so its metadata lives here.
export const metadata: Metadata = pageMetadata({
  title: "Ad-free Quiet Room Quizzes",
  description: "Extra quizzes off the main catalog. Free accounts see ads here; Premium removes them.",
  path: "/secret",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
