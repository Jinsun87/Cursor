import type { Metadata } from "next";

export const SITE_NAME = "Lampstand";

type PageSeo = {
  /** Page title; the root layout appends " · Lampstand". */
  title: string;
  description?: string;
  /** Path of this page on lampstandbible.com, e.g. "/quizzes/open-the-book". */
  path: string;
  /** Keep out of search results (account pages, thank-you pages, previews). */
  noindex?: boolean;
};

/** Title, description, canonical URL and Open Graph tags for one page. */
export function pageMetadata({ title, description, path, noindex }: PageSeo): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: SITE_NAME, type: "website" },
    twitter: { card: "summary", title, description },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
