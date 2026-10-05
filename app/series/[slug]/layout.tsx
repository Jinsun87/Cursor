import type { Metadata } from "next";
import { getSeries } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo";

// page.tsx is a client component, so its metadata lives here.
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const series = getSeries((await params).slug);
  if (!series) return { title: "Pack not found", robots: { index: false } };
  return pageMetadata({
    title: `${series.title} Quiz Pack`,
    description: series.description,
    path: `/series/${series.slug}`,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
