"use client";

import { useEffect } from "react";
import { useApp } from "@/lib/store";
import { metaTrack } from "@/lib/meta/pixel";
import { trackEvent } from "@/lib/analytics";

const FRESH_MS = 30 * 60 * 1000;
const TRACKED_KEY = "lampstand-registration-tracked";

/**
 * Reports a sign-up once the account really exists, whichever way it was made
 * (password, emailed link or Google): the first time a new account is seen
 * signed in, within half an hour of being created. Unconfirmed attempts are
 * not counted.
 */
export function NewAccountTracker() {
  const { user, ready } = useApp();

  useEffect(() => {
    if (!ready || !user?.createdAt) return;
    const age = Date.now() - new Date(user.createdAt).getTime();
    if (!(age >= 0 && age < FRESH_MS)) return;
    try {
      if (localStorage.getItem(TRACKED_KEY) === user.id) return;
      localStorage.setItem(TRACKED_KEY, user.id);
    } catch {
      /* private mode: track anyway */
    }
    metaTrack("CompleteRegistration", { content_name: "account" });
    trackEvent("sign_up");
  }, [ready, user?.id, user?.createdAt]);

  return null;
}
