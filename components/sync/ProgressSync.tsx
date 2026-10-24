"use client";

import { useEffect, useRef } from "react";
import { useApp } from "@/lib/store";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { subscribeListening } from "@/lib/listening";
import { subscribeProgress } from "@/lib/sleep/progress";
import { subscribePlan } from "@/lib/plan/storage";
import { syncProgress } from "@/lib/sync/progress-sync";

const EVERY_MS = 2 * 60_000;
const AFTER_CHANGE_MS = 10_000;

/**
 * While someone is signed in, keeps their progress with their account: on
 * opening the app, every couple of minutes, a few seconds after a change, and
 * when the app goes to the background. Renders nothing.
 */
export function ProgressSync() {
  const { user } = useApp();
  const userId = user?.id;
  const busy = useRef(false);

  useEffect(() => {
    const supabase = getBrowserSupabase();
    if (!userId || !supabase) return;
    let soon: number | undefined;

    const run = async () => {
      if (busy.current) return;
      busy.current = true;
      try {
        await syncProgress(supabase);
      } finally {
        busy.current = false;
      }
    };
    const later = () => {
      window.clearTimeout(soon);
      soon = window.setTimeout(() => void run(), AFTER_CHANGE_MS);
    };
    const onHide = () => {
      if (document.visibilityState === "hidden") void run();
    };

    void run();
    const timer = window.setInterval(() => void run(), EVERY_MS);
    // Changes made by a sync itself also fire these; the busy flag and the delay keep that from looping fast.
    const offListening = subscribeListening(later);
    const offProgress = subscribeProgress(later);
    const offPlan = subscribePlan(later);
    document.addEventListener("visibilitychange", onHide);
    return () => {
      window.clearTimeout(soon);
      window.clearInterval(timer);
      offListening();
      offProgress();
      offPlan();
      document.removeEventListener("visibilitychange", onHide);
    };
  }, [userId]);

  return null;
}
