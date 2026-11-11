"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QuickStart } from "@/components/onboarding/QuickStart";
import { getSection } from "@/lib/section-store";
import { readOnboarding } from "@/lib/onboarding";
import { showApp } from "@/components/landing/LandingClient";

/**
 * /onboarding: the one-question welcome, every time, even for someone who has
 * finished it before. "Sleep and relax" or skipping lands on the home screen;
 * "Read the Bible consistently" goes on to today's reading.
 */
export function OnboardingRoute() {
  const router = useRouter();
  // The welcome renders into document.body, so it can only mount in the browser.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="min-h-[60vh]" aria-hidden="true" />;

  return (
    <QuickStart
      onDone={() => {
        // Welcomed now: the home screen is the app, not the landing page.
        showApp();
        const tab = getSection();
        // "Read the Bible consistently" sends them on to today's reading itself.
        if (readOnboarding().intent !== "read") router.push(tab === "today" ? "/" : `/?tab=${tab}`);
      }}
    />
  );
}
