import type { Metadata } from "next";

// Personal certificates are shareable but should not appear in search results.
export const metadata: Metadata = {
  title: "Certificate of Mastery",
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
