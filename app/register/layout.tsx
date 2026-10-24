import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

// page.tsx is a client component, so its metadata lives here.
export const metadata: Metadata = pageMetadata({
  title: "Create a free account",
  description: "Hear the Bible read aloud, word for word: briskly in Walk by day and softly in Sleep at night. A free account keeps your place on every device.",
  path: "/register",
  noindex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
