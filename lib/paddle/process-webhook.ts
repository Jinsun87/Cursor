import {
  type EventEntity,
  EventName,
  type SubscriptionCreatedEvent,
  type SubscriptionUpdatedEvent,
  type SubscriptionCanceledEvent,
  type TransactionCompletedEvent,
  type CustomerCreatedEvent,
} from "@paddle/paddle-node-sdk";

export interface WebhookProcessingResult {
  handled: boolean;
  eventType: string;
  entityId?: string;
  actionTaken?: string;
}

/**
 * Paddle delivers at-least-once. The same event arrives on every retry,
 * so every handler below is idempotent.
 */
export async function processPaddleWebhookEvent(
  event: EventEntity,
): Promise<WebhookProcessingResult> {
  const eventType = event.eventType;

  switch (eventType) {
    case EventName.SubscriptionCreated:
    case EventName.SubscriptionUpdated: {
      const subEvent = event as SubscriptionCreatedEvent | SubscriptionUpdatedEvent;
      const sub = subEvent.data;
      const customerId = sub.customerId;
      const status = sub.status;
      const customData = sub.customData as Record<string, string> | null;
      const userEmail = customData?.email || customData?.userEmail;

      console.log(`[Paddle Webhook] ${eventType} for subscription ${sub.id}:`, {
        customerId,
        status,
        userEmail,
      });

      return {
        handled: true,
        eventType,
        entityId: sub.id,
        actionTaken: `Subscription ${status}`,
      };
    }

    case EventName.SubscriptionCanceled: {
      const cancelEvent = event as SubscriptionCanceledEvent;
      const sub = cancelEvent.data;

      console.log(`[Paddle Webhook] Subscription canceled: ${sub.id}`);
      return {
        handled: true,
        eventType,
        entityId: sub.id,
        actionTaken: "Subscription canceled",
      };
    }

    case EventName.TransactionCompleted: {
      const txEvent = event as TransactionCompletedEvent;
      const tx = txEvent.data;
      const customData = tx.customData as Record<string, string> | null;

      console.log(`[Paddle Webhook] Transaction completed: ${tx.id}`, {
        amount: tx.details?.totals?.total,
        currencyCode: tx.currencyCode,
        customData,
      });

      return {
        handled: true,
        eventType,
        entityId: tx.id,
        actionTaken: "Transaction processed",
      };
    }

    case EventName.CustomerCreated: {
      const custEvent = event as CustomerCreatedEvent;
      const cust = custEvent.data;
      console.log(`[Paddle Webhook] Customer created: ${cust.id} (${cust.email})`);
      return {
        handled: true,
        eventType,
        entityId: cust.id,
        actionTaken: "Customer created",
      };
    }

    default:
      console.log(`[Paddle Webhook] Unhandled event type: ${eventType}`);
      return {
        handled: false,
        eventType,
        actionTaken: "Ignored unhandled event",
      };
  }
}
