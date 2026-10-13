import { type EventEntity, EventName } from "@paddle/paddle-node-sdk";
import {
  checkoutIdentity,
  subscriptionRowFromPaddle,
  type PaddleSubscriptionLike,
  type SubscriptionRow,
} from "@/lib/entitlement";

export interface WebhookProcessingResult {
  handled: boolean;
  eventType: string;
  entityId?: string;
  actionTaken?: string;
}

/** A founding-member purchase: Premium for life from one payment. */
export interface LifetimePurchase {
  paddle_transaction_id: string;
  user_id: string | null;
  paddle_customer_id: string;
  price_id: string;
  purchased_at: string;
}

/** Persistence the webhook needs. Supabase in production, an in-memory fake in tests. */
export interface SubscriptionStore {
  /** Returns false when a newer version of the subscription is already stored. */
  upsertSubscription(row: SubscriptionRow): Promise<boolean>;
  findUserIdByEmail(email: string): Promise<string | null>;
  /** Stores a founding purchase once; a repeat delivery of the same transaction is a no-op. */
  recordLifetimePurchase(purchase: LifetimePurchase): Promise<void>;
  /** Marks a founding purchase refunded; false if the transaction was not a founding purchase. */
  markLifetimeRefunded(transactionId: string): Promise<boolean>;
}

/** The one-time founding price(s): the sandbox or live ID, from the environment. */
export function lifetimePriceIds(): string[] {
  return [process.env.NEXT_PUBLIC_PADDLE_LIFETIME_PRICE_ID]
    .map((x) => x?.trim())
    .filter((x): x is string => Boolean(x));
}

interface PaddleTransactionLike {
  id: string;
  customerId: string | null;
  items?: { price?: { id: string } | null }[] | null;
  customData?: unknown;
  billedAt?: string | null;
  updatedAt?: string;
}

interface PaddleAdjustmentLike {
  transactionId: string;
  action: string;
  status: string;
}

const SUBSCRIPTION_EVENTS = new Set<string>([
  EventName.SubscriptionCreated,
  EventName.SubscriptionUpdated,
  EventName.SubscriptionActivated,
  EventName.SubscriptionTrialing,
  EventName.SubscriptionPastDue,
  EventName.SubscriptionPaused,
  EventName.SubscriptionResumed,
  EventName.SubscriptionCanceled,
  EventName.SubscriptionImported,
]);

/**
 * Paddle delivers at-least-once and not always in order. Every subscription
 * event carries the full subscription, so each one is written as a snapshot
 * and the store keeps whichever has the latest `updatedAt`.
 */
export async function processPaddleWebhookEvent(
  event: EventEntity,
  store: SubscriptionStore,
): Promise<WebhookProcessingResult> {
  const eventType = event.eventType;

  if (SUBSCRIPTION_EVENTS.has(eventType)) {
    const sub = event.data as unknown as PaddleSubscriptionLike;
    const identity = checkoutIdentity(sub.customData);
    const userId = identity.userId ?? (identity.email ? await store.findUserIdByEmail(identity.email) : null);

    if (!userId) {
      // Stored anyway so it can be linked later; logged so it gets noticed.
      console.warn(`[Paddle Webhook] ${eventType} ${sub.id}: no matching Lampstand account`);
    }

    const applied = await store.upsertSubscription(subscriptionRowFromPaddle(sub, userId));
    return {
      handled: true,
      eventType,
      entityId: sub.id,
      actionTaken: applied ? `Stored subscription as ${sub.status}` : "Skipped stale event",
    };
  }

  // A completed one-time payment: a founding membership if it bought the lifetime price.
  if (eventType === EventName.TransactionCompleted) {
    const tx = event.data as unknown as PaddleTransactionLike;
    const lifetime = lifetimePriceIds();
    const priceId = tx.items?.map((i) => i.price?.id).find((id) => id && lifetime.includes(id));
    if (!priceId || !tx.customerId) {
      return { handled: false, eventType, entityId: tx.id, actionTaken: "Not a founding purchase" };
    }
    const identity = checkoutIdentity(tx.customData);
    const userId = identity.userId ?? (identity.email ? await store.findUserIdByEmail(identity.email) : null);
    if (!userId) console.warn(`[Paddle Webhook] founding purchase ${tx.id}: no matching Lampstand account`);
    await store.recordLifetimePurchase({
      paddle_transaction_id: tx.id,
      user_id: userId,
      paddle_customer_id: tx.customerId,
      price_id: priceId,
      purchased_at: tx.billedAt ?? tx.updatedAt ?? new Date().toISOString(),
    });
    return { handled: true, eventType, entityId: tx.id, actionTaken: "Stored founding membership" };
  }

  // An approved refund of a founding purchase ends that lifetime Premium (and frees the spot).
  if (eventType === EventName.AdjustmentCreated || eventType === EventName.AdjustmentUpdated) {
    const adj = event.data as unknown as PaddleAdjustmentLike;
    if (adj.action === "refund" && adj.status === "approved") {
      const changed = await store.markLifetimeRefunded(adj.transactionId);
      return {
        handled: changed,
        eventType,
        entityId: adj.transactionId,
        actionTaken: changed ? "Founding membership refunded" : "Refund was not for a founding purchase",
      };
    }
  }

  return { handled: false, eventType, actionTaken: "Ignored" };
}
