import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

// page.tsx is a client component, so its metadata lives here.
// A title set in a layout replaces the root template for nested routes,
// so restate it here for /read/[book]/[chapter].
export const metadata: Metadata = {
  ...pageMetadata({
    title: "Read the Bible: Scripture & Counsel",
    description:
      "Scripture for everyday struggles like anxiety, grief and anger, in the public-domain Berean Standard Bible.",
    path: "/read",
  }),
  title: { default: "Read the Bible: Scripture & Counsel", template: "%s · Lampstand" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
