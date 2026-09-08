"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ezoicAdsEnabled, runEzoic } from "@/lib/ezoic";

function inject(src: string, id: string, extra?: Record<string, string>) {
  if (document.getElementById(id)) return;
  const el = document.createElement("script");
  el.id = id;
  el.src = src;
  el.async = true;
  if (extra) {
    for (const [k, v] of Object.entries(extra)) el.setAttribute(k, v);
  }
  document.head.appendChild(el);
}

export function EzoicBoot() {
  const pathname = usePathname();

  useEffect(() => {
    if (!ezoicAdsEnabled()) return;
    window.ezstandalone ??= { cmd: [] };
    window.ezstandalone.cmd ??= [];
    inject("https://cmp.gatekeeperconsent.com/min.js", "ezoic-cmp", { "data-cfasync": "false" });
    inject("https://the.gatekeeperconsent.com/cmp.min.js", "ezoic-cmp-2", { "data-cfasync": "false" });
    inject("https://www.ezojs.com/ezoic/sa.min.js", "ezoic-sa");
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
