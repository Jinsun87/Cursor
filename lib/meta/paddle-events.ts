import { EventName, type EventEntity } from "@paddle/paddle-node-sdk";
import { checkoutIdentity } from "@/lib/entitlement";
import { lifetimePriceIds } from "@/lib/paddle/process-webhook";
import type { CapiEvent } from "./capi";

interface Money {
  amount?: string;
  currencyCode?: string;
}

interface PaddleSubscriptionLike {
  id: string;
  status: string;
  currencyCode?: string;
  items?: { price?: { id: string; unitPrice?: Money } | null }[] | null;
  customData?: unknown;
}

interface PaddleTransactionLike {
  id: string;
  currencyCode?: string;
  items?: { price?: { id: string } | null }[] | null;
  details?: { totals?: { total?: string } | null } | null;
  customData?: unknown;
}

/** Ad data the checkout attached (see checkoutAdData); events go to Meta only with consent. */
function adData(customData: unknown): { fbp?: string; fbc?: string } | null {
  if (!customData || typeof customData !== "object") return null;
  const data = customData as Record<string, unknown>;
  if (data.adConsent !== "granted") return null;
  const str = (v: unknown) => (typeof v === "string" && v.length < 200 ? v : undefined);
  return { fbp: str(data.fbp), fbc: str(data.fbc) };
}

/** Paddle amounts are strings in the currency's minor unit (cents). */
function major(amount?: string): number | undefined {
  const n = Number(amount);
  return Number.isFinite(n) && amount ? n / 100 : undefined;
}

/**
 * The Meta conversion for a Paddle notification, if it is one:
 * a new trial → StartTrial, a trial's first payment → Subscribe, a founding payment → Purchase.
 * Event ids come from Paddle's own ids, so a retried webhook is counted once.
 */
export function metaEventFromPaddle(event: EventEntity): CapiEvent | null {
  const time = new Date(event.occurredAt);

  if (event.eventType === EventName.SubscriptionCreated || event.eventType === EventName.SubscriptionActivated) {
    const sub = event.data as unknown as PaddleSubscriptionLike;
    const ad = adData(sub.customData);
    if (!ad) return null;
    const trial = event.eventType === EventName.SubscriptionCreated;
    if (trial && sub.status !== "trialing") return null;
    const price = sub.items?.[0]?.price;
    const value = major(price?.unitPrice?.amount);
    const currency = price?.unitPrice?.currencyCode ?? sub.currencyCode;
    const identity = checkoutIdentity(sub.customData);
    return {
      name: trial ? "StartTrial" : "Subscribe",
      id: `${trial ? "trial" : "subscribe"}-${sub.id}`,
      time,
      actionSource: "system_generated",
      user: { email: identity.email, userId: identity.userId, ...ad },
      customData: {
        ...(price?.id ? { content_ids: price.id } : {}),
        ...(value !== undefined && currency ? { value: trial ? 0 : value, currency, predicted_ltv: value } : {}),
      },
    };
  }

  if (event.eventType === EventName.TransactionCompleted) {
    const tx = event.data as unknown as PaddleTransactionLike;
    const lifetime = lifetimePriceIds();
    if (!tx.items?.some((i) => i.price?.id && lifetime.includes(i.price.id))) return null;
    const ad = adData(tx.customData);
    if (!ad) return null;
    const value = major(tx.details?.totals?.total);
    const identity = checkoutIdentity(tx.customData);
    return {
      name: "Purchase",
      id: `purchase-${tx.id}`,
      time,
      actionSource: "system_generated",
      user: { email: identity.email, userId: identity.userId, ...ad },
      customData: {
        content_name: "founding",
        ...(value !== undefined && tx.currencyCode ? { value, currency: tx.currencyCode } : {}),
      },
    };
  }

  return null;
}
