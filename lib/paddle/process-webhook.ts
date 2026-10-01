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

/** Persistence the webhook needs. Supabase in production, an in-memory fake in tests. */
export interface SubscriptionStore {
  /** Returns false when a newer version of the subscription is already stored. */
  upsertSubscription(row: SubscriptionRow): Promise<boolean>;
  findUserIdByEmail(email: string): Promise<string | null>;
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

  return { handled: false, eventType, actionTaken: "Ignored" };
}
