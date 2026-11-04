"use client";

import { trackEvent } from "@/lib/analytics";

/**
 * Lampstand as a home-screen app. Android Chrome can install it in one tap
 * (beforeinstallprompt); iPhone needs Share → Add to Home Screen, and in-app
 * browsers (Facebook, Instagram) can't add to the home screen at all, so the
 * visitor has to open the page in Safari or Chrome first.
 *
 * Installs are counted by the home-screen app reporting itself when it opens
 * (display-mode: standalone), which works on every platform, plus Chrome's
 * appinstalled event. Each installed copy keeps its own random device id.
 */

export type InstallPlatform = "installed" | "in-app" | "ios" | "android" | "desktop";

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const IN_APP = /FBAN|FBAV|FB_IAB|FBIOS|Instagram|Messenger|Line\/|Snapchat|TikTok|musical_ly|Pinterest/i;

export function detectPlatform(userAgent: string, standalone: boolean, touchMac = false): InstallPlatform {
  if (standalone) return "installed";
  if (IN_APP.test(userAgent)) return "in-app";
  if (/iPhone|iPad|iPod/i.test(userAgent) || touchMac) return "ios";
  if (/Android/i.test(userAgent)) return "android";
  return "desktop";
}

/** The platform for the install report: what the device is, not how the page is shown. */
export function devicePlatform(userAgent: string, touchMac = false): "ios" | "android" | "desktop" | "other" {
  if (/iPhone|iPad|iPod/i.test(userAgent) || touchMac) return "ios";
  if (/Android/i.test(userAgent)) return "android";
  if (/Windows|Macintosh|Linux|CrOS/i.test(userAgent)) return "desktop";
  return "other";
}

export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return Boolean(nav.standalone) || window.matchMedia?.("(display-mode: standalone)").matches === true;
}

/** iPadOS reports itself as a Mac; a touch screen gives it away. */
export function isTouchMac(): boolean {
  return typeof navigator !== "undefined" && /Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1;
}

export function currentPlatform(): InstallPlatform {
  if (typeof navigator === "undefined") return "desktop";
  return detectPlatform(navigator.userAgent, isStandalone(), isTouchMac());
}

const DEVICE_KEY = "lampstand-device-id";
const REPORTED_KEY = "lampstand-install-reported";

function deviceId(): string | null {
  try {
    let id = localStorage.getItem(DEVICE_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(DEVICE_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}

/**
 * Tells the server this copy of the app is installed: "launch" when it opens
 * from the home screen (at most once a day), "appinstalled" when Chrome
 * reports an install. Never throws.
 */
export function reportInstall(source: "launch" | "appinstalled") {
  const id = deviceId();
  if (!id) return;
  const today = new Date().toISOString().slice(0, 10);
  const key = `${REPORTED_KEY}:${source}`;
  try {
    if (localStorage.getItem(key) === today) return;
    localStorage.setItem(key, today);
  } catch {
    /* private mode: report anyway */
  }
  const platform = devicePlatform(navigator.userAgent, isTouchMac());
  trackEvent(source === "launch" ? "app_launch_standalone" : "app_installed", { platform });
  void fetch("/api/install", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ deviceId: id, source, platform }),
    keepalive: true,
  }).catch(() => {});
}

/* The install prompt Chrome offers, kept from the moment it fires so the install page can use it. */

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();

export function setDeferredPrompt(event: BeforeInstallPromptEvent | null) {
  deferredPrompt = event;
  listeners.forEach((fn) => fn());
}

export function getDeferredPrompt(): BeforeInstallPromptEvent | null {
  return deferredPrompt;
}

export function onDeferredPromptChange(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** The install page, then on to `next`. */
export function installUrl(next: string): string {
  return `/install?next=${encodeURIComponent(next)}`;
}

// Sign-ups on their way to checkout go straight there; /welcome shows the install guide after payment.
const CHECKOUT_PATHS = /^\/(pricing|premium|plan\/read)(?=$|[/?#])/;

/** Where a brand-new account goes: the install page first, unless they are on their way to pay. */
export function afterSignUpPath(next: string): string {
  return CHECKOUT_PATHS.test(next) ? next : installUrl(next);
}
