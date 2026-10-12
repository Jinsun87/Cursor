import { pageMetadata } from "@/lib/seo";
import { OnboardingRoute } from "./OnboardingRoute";

// A shareable link to the welcome (for ads and testing); the home page shows the
// same welcome to first-time visitors. Not indexed: it is not a page of its own content.
export const metadata = pageMetadata({
  title: "Welcome to Lampstand",
  description: "A few quiet questions, your reader's voice, and your first moment of Scripture.",
  path: "/onboarding",
  noindex: true,
});

export default function OnboardingPage() {
  return <OnboardingRoute />;
}
