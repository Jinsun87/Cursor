"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  CONSENT_CHANGED,
  adTrackingAllowed,
  loadPixel,
  metaPixelId,
  needsConsent,
  readConsent,
  saveConsent,
  trackPageView,
} from "@/lib/meta/pixel";

/** Loads the Meta Pixel once tracking is allowed, counts page views, and asks for consent in Europe. */
export function MetaPixel() {
  const pathname = usePathname();
  const [ask, setAsk] = useState(false);
  const firstPath = useRef<string | null>(null);

  useEffect(() => {
    if (!metaPixelId()) return;
    const sync = () => {
      setAsk(needsConsent() && readConsent() === null);
      // loadPixel counts the first page view itself.
      if (adTrackingAllowed() && loadPixel()) firstPath.current = window.location.pathname;
    };
    sync();
    window.addEventListener(CONSENT_CHANGED, sync);
    return () => window.removeEventListener(CONSENT_CHANGED, sync);
  }, []);

  useEffect(() => {
    if (firstPath.current === pathname) {
      firstPath.current = null;
      return;
    }
    trackPageView();
  }, [pathname]);

  if (!ask) return null;
  return (
    <div
      role="dialog"
      aria-label="Cookies for ads"
      className="fixed inset-x-4 bottom-24 z-[70] mx-auto max-w-md rounded-xl border border-[var(--gold)]/30 bg-[var(--canvas-2)] p-4 shadow-2xl md:bottom-6"
    >
      <p className="text-sm text-[var(--ink)]">
        May we use Meta cookies to measure our ads? It helps us reach more people with the Word. You can say no and
        everything still works. <Link href="/privacy" className="underline">Privacy</Link>
      </p>
      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => saveConsent("denied")}
          className="rounded-lg border border-[var(--line)] px-4 py-2 text-sm text-[var(--ink)]"
        >
          No thanks
        </button>
        <button
          type="button"
          onClick={() => saveConsent("granted")}
          className="rounded-lg bg-[var(--gold)] px-4 py-2 text-sm font-medium text-[var(--gold-ink)]"
        >
          Allow
        </button>
      </div>
    </div>
  );
}
