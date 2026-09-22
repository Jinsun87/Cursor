import { headers } from "next/headers";
import type { Metadata } from "next";
import { PricingPageClient } from "@/components/pricing/PricingPageClient";

export const metadata: Metadata = {
  title: "Pricing & Plans — Lampstand",
  description:
    "Choose a plan to support Scripture mastery. Unlock distraction-free reading, ad-free quizzes, and Certificates of Mastery.",
};

export default async function PricingPage() {
  const headerList = await headers();

  // Server-side country detection from edge CDN headers
  // Vercel sets 'x-vercel-ip-country', Cloudflare sets 'cf-ipcountry'
  const rawCountry =
    headerList.get("x-vercel-ip-country") ||
    headerList.get("cf-ipcountry") ||
    headerList.get("x-country-code");

  // Keep country strictly 2-letter ISO code if present, otherwise undefined
  const detectedCountry =
    rawCountry && rawCountry.trim().length === 2
      ? rawCountry.trim().toUpperCase()
      : undefined;

  return <PricingPageClient detectedCountry={detectedCountry} />;
}
