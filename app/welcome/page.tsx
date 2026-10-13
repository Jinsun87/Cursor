import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ActivationStatus } from "@/components/pricing/ActivationStatus";
import { WelcomeContent } from "@/components/pricing/WelcomeContent";

export const metadata: Metadata = pageMetadata({
  title: "Welcome to Lampstand Pro",
  description: "Thank you for joining Lampstand Pro.",
  path: "/welcome",
  noindex: true,
});

export default function WelcomePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      {/* Illuminated Icon */}
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[var(--gold)]/40 bg-[var(--gold)]/10 text-[var(--gold)] shadow-xl shadow-[var(--gold)]/10">
        <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      </div>

      <ActivationStatus />

      <WelcomeContent />
    </div>
  );
}
