"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { adsenseClient, adsenseEnabled } from "@/lib/adsense";
import { useApp } from "@/lib/store";

// Pages that never carry ads: the home screen holds the Walk, Sleep and Breathe
// sessions, where Scripture and prayer are not interrupted.
const AD_FREE_PATHS = new Set(["/"]);

/**
 * Loads Google AdSense (including Auto ads) only for readers without Premium,
 * and only once their account state is known. It used to load in <head> for
 * everyone, so paying members still saw Auto ads.
 */
export function AdSenseLoader() {
  const { user, ready } = useApp();
  const pathname = usePathname();
  const allowed = ready && adsenseEnabled() && !user?.premium && !AD_FREE_PATHS.has(pathname);

  useEffect(() => {
    if (!allowed || document.getElementById("adsense-loader")) return;
    const client = adsenseClient();
    const script = document.createElement("script");
    script.id = "adsense-loader";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
    document.head.appendChild(script);
    window.adsbygoogle = window.adsbygoogle || [];
    window.adsbygoogle.push({ google_ad_client: client, enable_page_level_ads: true });
  }, [allowed]);

  return null;
}
