"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackActiveDwellTime, trackPageview } from "@/lib/analytics";

export function AnalyticsTracker() {
  const pathname = usePathname();
  const activeTimeMs = useRef(0);
  const lastTickTime = useRef<number | null>(null);

  // Route change tracking
  useEffect(() => {
    trackPageview(pathname);
    activeTimeMs.current = 0;
    lastTickTime.current = Date.now();
  }, [pathname]);

  // Active Dwell Time Tracker (15s Heartbeat Ping, pauses when tab is hidden)
  useEffect(() => {
    lastTickTime.current = Date.now();

    const interval = setInterval(() => {
      if (document.visibilityState === "visible" && lastTickTime.current) {
        const now = Date.now();
        const delta = now - lastTickTime.current;
        lastTickTime.current = now;
        activeTimeMs.current += delta;

        // Emit heartbeat ping every 15s
        if (activeTimeMs.current >= 15000) {
          trackActiveDwellTime(pathname, activeTimeMs.current / 1000);
          activeTimeMs.current = 0;
        }
      } else {
        lastTickTime.current = null;
      }
    }, 3000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        lastTickTime.current = Date.now();
      } else {
        lastTickTime.current = null;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pathname]);

  return null;
}
