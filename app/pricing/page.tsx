import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PricingPageClient } from "@/components/pricing/PricingPageClient";

export const metadata: Metadata = pageMetadata({
  title: "Pricing & Plans",
  description:
    "Lampstand is free to use. Premium removes ads and adds a profile badge and bonus coins, for $4.99 a month or $39.99 a year.",
  path: "/pricing",
});

// Static and CDN-cached: localized prices come from Paddle.js in the browser.
export default function PricingPage() {
  return <PricingPageClient />;
}
