"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ezoicAdsEnabled, runEzoic } from "@/lib/ezoic";

export function EzoicBoot() {
  const pathname = usePathname();
  const markedSpa = useRef(false);

  useEffect(() => {
    if (!ezoicAdsEnabled()) return;
    if (markedSpa.current) return;
    markedSpa.current = true;
    runEzoic(() => {
      window.ezstandalone?.setIsSinglePageApplication?.(true);
    });
  }, []);

  useEffect(() => {
    if (!ezoicAdsEnabled()) return;
    runEzoic(() => {
      window.ezstandalone?.destroyPlaceholders?.();
      requestAnimationFrame(() => {
        window.ezstandalone?.showAds?.();
      });
    });
  }, [pathname]);

  return null;
}
