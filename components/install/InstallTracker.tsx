"use client";

import { useEffect } from "react";
import { isStandalone, reportInstall, setDeferredPrompt, type BeforeInstallPromptEvent } from "@/lib/install";

/**
 * Counts home-screen installs: reports when Lampstand opens from the home
 * screen, and when Chrome says it was installed. Also keeps Chrome's install
 * prompt so the install page can offer a one-tap Install button.
 */
export function InstallTracker() {
  useEffect(() => {
    if (isStandalone()) reportInstall("launch");

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setDeferredPrompt(null);
      reportInstall("appinstalled");
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  return null;
}
