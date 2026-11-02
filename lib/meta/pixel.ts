"use client";

/**
 * Meta Pixel in the browser, plus a relay of the same events to our server, which forwards them to
 * the Conversions API. Both carry one event id so Meta counts each event once.
 *
 * Consent: in Europe (EU, EEA, UK, Switzerland) ad tracking waits for "Accept" on the consent
 * banner; elsewhere it is on unless the visitor declines. Europe is judged by the device's time zone,
 * which needs no server lookup and errs towards asking.
 */

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[]; loaded?: boolean };
    _fbq?: unknown;
  }
}

export type AdConsent = "granted" | "denied";

/** Events the browser may send; trial and payment events come from the Paddle webhook instead. */
export type BrowserMetaEvent = "ViewContent" | "CompleteRegistration";

const CONSENT_KEY = "lampstand-ad-consent";
export const CONSENT_CHANGED = "lampstand-ad-consent-changed";

export function metaPixelId(): string {
  const id = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
  return id && /^\d{6,20}$/.test(id) ? id : "";
}

export function needsConsent(timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone): boolean {
  return /^(Europe\/|Atlantic\/(Reykjavik|Canary|Madeira|Azores|Faroe)$)/.test(timeZone ?? "");
}

export function readConsent(): AdConsent | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function saveConsent(value: AdConsent) {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* private mode: the choice lasts for this page only */
  }
  window.dispatchEvent(new Event(CONSENT_CHANGED));
}

/** True when the pixel may load and events may be sent for this visitor. */
export function adTrackingAllowed(): boolean {
  if (typeof window === "undefined" || !metaPixelId()) return false;
  const consent = readConsent();
  return needsConsent() ? consent === "granted" : consent !== "denied";
}

/** Meta's standard base code, loaded only once tracking is allowed. */
export function loadPixel(): boolean {
  const id = metaPixelId();
  if (!id || window.fbq) return false;
  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) (fbq.callMethod as (...a: unknown[]) => void)(...args);
    else fbq.queue!.push(args);
  } as NonNullable<Window["fbq"]>;
  window.fbq = fbq;
  window._fbq = fbq;
  fbq.queue = [];
  fbq.loaded = true;
  (fbq as unknown as { version: string }).version = "2.0";
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);
  fbq("init", id);
  fbq("track", "PageView");
  return true;
}

export function trackPageView() {
  if (adTrackingAllowed()) window.fbq?.("track", "PageView");
}

function newEventId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/** Sends one event from the browser pixel and, with the same id, through our server to Meta. */
export function metaTrack(event: BrowserMetaEvent, params: Record<string, string | number> = {}) {
  if (!adTrackingAllowed()) return;
  const eventId = newEventId();
  window.fbq?.("track", event, params, { eventID: eventId });
  try {
    void fetch("/api/meta/event", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ event, eventId, params, url: window.location.href }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* tracking never gets in the way */
  }
}

function cookie(name: string): string {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
}

/**
 * Added to Paddle checkout custom data, so the webhook can report the trial or payment to Meta
 * for this visitor, and only with their consent.
 */
export function checkoutAdData(): Record<string, string> {
  if (!adTrackingAllowed()) return { adConsent: "denied" };
  const data: Record<string, string> = { adConsent: "granted" };
  const fbp = cookie("_fbp");
  const fbc = cookie("_fbc");
  if (fbp) data.fbp = fbp;
  if (fbc) data.fbc = fbc;
  return data;
}
