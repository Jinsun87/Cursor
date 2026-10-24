import type { SupabaseClient } from "@supabase/supabase-js";
import { clearListening, readOwnLog, setOtherDevicesLog, type ListeningLog } from "@/lib/listening";
import { applyRemoteProgress, clearProgress, readProgress, type ReadingProgress } from "@/lib/sleep/progress";
import { applyRemotePlan, clearSavedPlan, readSavedPlan, type SavedPlan } from "@/lib/plan/storage";

/**
 * Keeps the lamp streak, the Walk/Sleep reading position and the reading plan
 * with the reader's account, so they follow them across devices. The browser
 * stays the working copy (everything works offline); a sync sends this
 * device's state to sync_progress() (supabase/migrations/…_progress_sync.sql),
 * which merges it on the server, and takes the combined state back.
 */

const DEVICE_KEY = "lampstand-device-id";

export type SyncResult = {
  /** Seconds per day across every device. */
  listening: ListeningLog;
  progress: ReadingProgress;
  plan: { plan: SavedPlan; at: number } | null;
};

/** A random id for this browser, so its listening is counted once however often it syncs. */
export function deviceId(): string {
  try {
    let id = localStorage.getItem(DEVICE_KEY);
    if (!id) {
      id = Array.from(crypto.getRandomValues(new Uint8Array(12)), (b) => b.toString(16).padStart(2, "0")).join("");
      localStorage.setItem(DEVICE_KEY, id);
    }
    return id;
  } catch {
    return "nostorage";
  }
}

/** What the other devices heard: the account's total per day minus what this device sent. */
export function otherDevices(total: ListeningLog, sent: ListeningLog): ListeningLog {
  const others: ListeningLog = {};
  for (const [day, s] of Object.entries(total)) {
    const rest = Math.round((s - (sent[day] ?? 0)) * 10) / 10;
    if (rest > 0) others[day] = rest;
  }
  return others;
}

/** Sync once. Resolves to false when offline or signed out; the next sync catches up. */
export async function syncProgress(supabase: SupabaseClient): Promise<boolean> {
  const sent = readOwnLog();
  const plan = readSavedPlan();
  const { data, error } = await supabase.rpc("sync_progress", {
    p_device: deviceId(),
    p_listening: sent,
    p_progress: readProgress(),
    p_plan: plan ? { plan, at: plan.updatedAt ?? 0 } : null,
  });
  if (error || !data) return false;
  const result = data as SyncResult;
  setOtherDevicesLog(otherDevices(result.listening ?? {}, sent));
  applyRemoteProgress(result.progress ?? {});
  if (result.plan?.plan) {
    const { updatedAt: _ignored, ...plain } = result.plan.plan;
    applyRemotePlan(plain, result.plan.at);
  }
  return true;
}

/** On sign-out: forget progress on this device. It is safe in the account, and the next person on a shared device starts clean. */
export function clearLocalProgress(): void {
  clearListening();
  clearProgress();
  clearSavedPlan();
}
