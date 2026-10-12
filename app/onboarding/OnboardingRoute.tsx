"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Onboarding } from "@/components/onboarding/Onboarding";
import { getSection } from "@/lib/section-store";

/**
 * /onboarding: the welcome, every time, even for someone who has finished it
 * before. When it ends (or is skipped) the reader lands on the home screen, on
 * the tab their answers chose.
 */
export function OnboardingRoute() {
  const router = useRouter();
  // The welcome renders into document.body, so it can only mount in the browser.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="min-h-[60vh]" aria-hidden="true" />;

  return (
    <Onboarding
      onDone={() => {
        const tab = getSection();
        router.push(tab === "today" ? "/" : `/?tab=${tab}`);
      }}
    />
  );
}
