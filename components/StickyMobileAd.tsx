"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/lib/store";
import { adsenseClient, adsenseEnabled, adsenseSlot, whenAdSenseReady, requestAdSense } from "@/lib/adsense";
import { EZOIC_PLACEHOLDERS, ezoicAdsEnabled, runEzoic } from "@/lib/ezoic";

export function StickyMobileAd({
  placeholderId = EZOIC_PLACEHOLDERS.inQuizSecret,
  refreshIntervalSec = 30,
}: {
  placeholderId?: number;
  refreshIntervalSec?: number;
}) {
  const { user } = useApp();
  const [dismissed, setDismissed] = useState(false);
  const [ready, setReady] = useState(false);
  const ezoic = ezoicAdsEnabled();
  const adsense = adsenseEnabled();
  const client = adsenseClient();
  const slot = adsenseSlot();

  useEffect(() => {
    if (user?.premium || (!ezoic && !adsense)) return;
    setReady(true);
  }, [user?.premium, ezoic, adsense]);

  // Handle ad refresh every X seconds when tab is visible
  useEffect(() => {
    if (user?.premium || dismissed || !ready || refreshIntervalSec <= 0) return;

    const interval = setInterval(() => {
      if (typeof window === "undefined" || document.visibilityState !== "visible") return;

      if (ezoic) {
        runEzoic(() => {
          window.ezstandalone?.refresh?.(placeholderId);
        });
      } else if (adsense) {
        whenAdSenseReady(() => requestAdSense());
      }
    }, refreshIntervalSec * 1000);

    return () => clearInterval(interval);
  }, [user?.premium, dismissed, ready, refreshIntervalSec, ezoic, adsense, placeholderId]);

  if (user?.premium || dismissed) return null;

  return (
    <aside
      data-testid="sticky-mobile-ad"
      aria-label="Sponsored placement"
      className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur border-t border-amber-500/30 p-2 text-center shadow-2xl transition-all"
    >
      <div className="relative mx-auto flex max-w-md items-center justify-between gap-2 px-2">
        <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
          Ad • Sponsored
        </span>
        <button
          onClick={() => setDismissed(true)}
          className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] font-bold text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
          title="Close Ad"
          aria-label="Close Ad"
        >
          ✕ Close
        </button>
      </div>

      <div className="mx-auto mt-1 flex min-h-[50px] max-h-[90px] items-center justify-center overflow-hidden">
        {ezoic && ready ? (
          <div id={`ezoic-pub-ad-placeholder-${placeholderId}`} />
        ) : adsense && ready ? (
          <ins
            className="adsbygoogle"
            style={{ display: "block", width: "100%", height: "50px" }}
            data-ad-client={client}
            {...(slot ? { "data-ad-slot": slot } : {})}
            data-ad-format="horizontal"
          />
        ) : (
          <div className="flex items-center gap-3 px-3 py-1.5 text-xs text-slate-300">
            <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/40">
              AD 320x50
            </span>
            <span className="font-semibold text-slate-200">
              Bible Quiz Sponsor • High-Viewability Mobile Banner
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}
