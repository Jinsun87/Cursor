"use client";

import { useEffect, useState } from "react";
import { CONSENT_CHANGED, adTrackingAllowed, metaPixelId, saveConsent } from "@/lib/meta/pixel";

/** On the privacy page: lets anyone switch Meta ad measurement on or off. */
export function AdConsentChoice() {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const sync = () => setAllowed(adTrackingAllowed());
    sync();
    window.addEventListener(CONSENT_CHANGED, sync);
    return () => window.removeEventListener(CONSENT_CHANGED, sync);
  }, []);

  if (allowed === null || !metaPixelId()) return null;
  return (
    <p className="text-sm text-[var(--muted)]">
      Meta ad measurement is <strong className="text-[var(--ink)]">{allowed ? "on" : "off"}</strong> on this device.{" "}
      <button
        type="button"
        className="underline text-[var(--gold)]"
        onClick={() => {
          saveConsent(allowed ? "denied" : "granted");
          // The pixel cannot be unloaded from a page that already has it; a reload clears it.
          if (allowed) window.location.reload();
        }}
      >
        {allowed ? "Turn it off" : "Turn it on"}
      </button>
    </p>
  );
}
