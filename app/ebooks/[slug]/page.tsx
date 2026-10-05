import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEBookBySlug } from "@/lib/ebooks/catalog";
import { pageMetadata } from "@/lib/seo";
import { EbookReader } from "@/components/EbookReader";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const ebook = getEBookBySlug(resolvedParams.slug);
  if (!ebook) {
    return { title: "eBook not found", robots: { index: false } };
  }
  return pageMetadata({
    title: `${ebook.title}: ${ebook.subtitle}`,
    description: ebook.description,
    path: `/ebooks/${ebook.slug}`,
  });
}

export default async function EBookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const ebook = getEBookBySlug(resolvedParams.slug);

  if (!ebook) {
    notFound();
  }

  return <EbookReader ebook={ebook} />;
}
