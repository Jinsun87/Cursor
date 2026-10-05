"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DAILY_GOAL_SECONDS,
  computeStreak,
  localDayKey,
  readLog,
  recordListening,
  subscribeListening,
} from "@/lib/listening";

/** Today's listening and the streak, kept in sync across every player on the page. */
export function useListening() {
  const [state, setState] = useState({ secondsToday: 0, streak: 0, ready: false });

  useEffect(() => {
    const refresh = () => {
      const log = readLog();
      setState({ secondsToday: log[localDayKey()] ?? 0, streak: computeStreak(log), ready: true });
    };
    refresh();
    // Re-check at least once a minute so the day rolls over at local midnight.
    const timer = window.setInterval(refresh, 60_000);
    const unsubscribe = subscribeListening(refresh);
    return () => {
      window.clearInterval(timer);
      unsubscribe();
    };
  }, []);

  return {
    ...state,
    goalSeconds: DAILY_GOAL_SECONDS,
    progress: Math.min(1, state.secondsToday / DAILY_GOAL_SECONDS),
    litToday: state.secondsToday >= DAILY_GOAL_SECONDS,
  };
}

/**
 * Accumulates seconds of audio actually heard and flushes them to the
 * listening log every few seconds. Call tick(currentTime) as playback advances
 * and stop() on pause; seeks and pauses never count.
 */
export function useListeningMeter() {
  const last = useRef<number | null>(null);
  const pending = useRef(0);

  const flush = useCallback(() => {
    if (pending.current > 0) recordListening(pending.current);
    pending.current = 0;
  }, []);

  const tick = useCallback(
    (time: number) => {
      const prev = last.current;
      last.current = time;
      if (prev === null) return;
      const delta = time - prev;
      // Ignore seeks and stalls: only small forward steps are listening.
      if (delta > 0 && delta < 2) pending.current += delta;
      if (pending.current >= 5) flush();
    },
    [flush],
  );

  const stop = useCallback(() => {
    last.current = null;
    flush();
  }, [flush]);

  useEffect(() => stop, [stop]);
  // Stable identity, so effects that depend on the meter do not re-run every render.
  return useMemo(() => ({ tick, stop }), [tick, stop]);
}
