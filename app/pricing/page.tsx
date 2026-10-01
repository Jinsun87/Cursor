import type { Metadata } from "next";
import { PricingPageClient } from "@/components/pricing/PricingPageClient";

export const metadata: Metadata = {
  title: "Pricing & Plans — Lampstand",
  description:
    "Choose a plan to support Scripture mastery. Unlock distraction-free reading, ad-free quizzes, and Certificates of Mastery.",
};

// Static and CDN-cached: localized prices come from Paddle.js in the browser.
export default function PricingPage() {
  return <PricingPageClient />;
}
