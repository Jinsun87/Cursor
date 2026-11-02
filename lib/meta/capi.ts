import { createHash } from "node:crypto";

/**
 * Meta Conversions API: server-side copies of conversion events. Personal data is SHA-256 hashed
 * before it leaves our server, as Meta requires. Nothing is sent unless both the pixel id and the
 * access token are configured.
 */

export interface CapiUser {
  email?: string;
  userId?: string;
  ip?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
}

export interface CapiEvent {
  name: string;
  /** Same id as the browser pixel's event (or a stable Paddle id), so Meta counts it once. */
  id: string;
  time?: Date;
  sourceUrl?: string;
  /** "website" for browser relays; "system_generated" for billing events with no page. */
  actionSource: "website" | "system_generated";
  user: CapiUser;
  customData?: Record<string, string | number>;
}

const GRAPH_VERSION = process.env.META_GRAPH_VERSION?.trim() || "v24.0";

export function capiConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() && process.env.META_CAPI_ACCESS_TOKEN?.trim());
}

export function sha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

/** The `data[]` entry Meta expects, with hashed identifiers. */
export function capiPayload(event: CapiEvent) {
  const u = event.user;
  const userData: Record<string, string | string[]> = {};
  if (u.email) userData.em = [sha256(u.email)];
  if (u.userId) userData.external_id = [sha256(u.userId)];
  if (u.ip) userData.client_ip_address = u.ip;
  if (u.userAgent) userData.client_user_agent = u.userAgent;
  if (u.fbp) userData.fbp = u.fbp;
  if (u.fbc) userData.fbc = u.fbc;
  return {
    event_name: event.name,
    event_id: event.id,
    event_time: Math.floor((event.time ?? new Date()).getTime() / 1000),
    action_source: event.actionSource,
    ...(event.sourceUrl ? { event_source_url: event.sourceUrl } : {}),
    user_data: userData,
    ...(event.customData ? { custom_data: event.customData } : {}),
  };
}

/** Sends events to Meta. Never throws: a tracking failure must not break sign-up or billing. */
export async function sendCapiEvents(events: CapiEvent[]): Promise<void> {
  if (!events.length || !capiConfigured()) return;
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID!.trim();
  const body: Record<string, unknown> = {
    data: events.map(capiPayload),
    access_token: process.env.META_CAPI_ACCESS_TOKEN!.trim(),
  };
  const testCode = process.env.META_TEST_EVENT_CODE?.trim();
  if (testCode) body.test_event_code = testCode;
  try {
    const res = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) console.warn(`[Meta CAPI] ${res.status} ${(await res.text()).slice(0, 300)}`);
  } catch (error) {
    console.warn("[Meta CAPI] send failed:", error);
  }
}
