import { describe, it, expect } from "vitest";
import { EventName, type EventEntity } from "@paddle/paddle-node-sdk";
import { isPaddleConfigured } from "./client";
import { processPaddleWebhookEvent, type LifetimePurchase, type SubscriptionStore } from "./process-webhook";
import type { SubscriptionRow } from "@/lib/entitlement";

describe("Paddle Client Helper", () => {
  it("detects when Paddle is unconfigured", () => {
    const originalToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    delete process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;

    expect(isPaddleConfigured()).toBe(false);

    if (originalToken) {
      process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN = originalToken;
    }
  });

  it("detects when Paddle client token is set", () => {
    const originalToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN = "test_123456789";

    expect(isPaddleConfigured()).toBe(true);

    if (originalToken) {
      process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN = originalToken;
    } else {
      delete process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    }
  });
});

const USER_ID = "3f2b8c1e-9a4d-4e7b-8c2a-1d5e6f7a8b9c";

/** In-memory stand-in for the Supabase upsert_paddle_subscription function. */
function fakeStore(emails: Record<string, string> = {}) {
  const rows = new Map<string, SubscriptionRow>();
  const lifetime = new Map<string, LifetimePurchase & { status: string }>();
  const store: SubscriptionStore = {
    async recordLifetimePurchase(purchase) {
      if (!lifetime.has(purchase.paddle_transaction_id)) lifetime.set(purchase.paddle_transaction_id, { ...purchase, status: "completed" });
    },
    async markLifetimeRefunded(transactionId) {
      const row = lifetime.get(transactionId);
      if (!row) return false;
      row.status = "refunded";
      return true;
    },
    async upsertSubscription(row) {
      const existing = rows.get(row.paddle_subscription_id);
      if (existing && existing.paddle_updated_at > row.paddle_updated_at) return false;
      rows.set(row.paddle_subscription_id, { ...row, user_id: row.user_id ?? existing?.user_id ?? null });
      return true;
    },
    async findUserIdByEmail(email) {
      return emails[email] ?? null;
    },
  };
  return { store, rows, lifetime };
}

function subscriptionEvent(
  eventType: EventName,
  overrides: { status?: string; updatedAt?: string; customData?: Record<string, string> | null } = {},
): EventEntity {
  return {
    eventId: `evt_${Math.random()}`,
    eventType,
    occurredAt: new Date().toISOString(),
    notificationId: "ntf_1",
    data: {
      id: "sub_1",
      status: overrides.status ?? "active",
      customerId: "ctm_1",
      updatedAt: overrides.updatedAt ?? "2026-10-01T10:00:00Z",
      currentBillingPeriod: { startsAt: "2026-10-01T10:00:00Z", endsAt: "2026-11-01T10:00:00Z" },
      scheduledChange: null,
      items: [{ price: { id: "pri_monthly" } }],
      customData: overrides.customData === undefined ? { userId: USER_ID } : overrides.customData,
    },
  } as unknown as EventEntity;
}

describe("Paddle Webhook Processor", () => {
  it("stores a new subscription against the account in custom data", async () => {
    const { store, rows } = fakeStore();
    const result = await processPaddleWebhookEvent(subscriptionEvent(EventName.SubscriptionCreated), store);

    expect(result.handled).toBe(true);
    expect(result.entityId).toBe("sub_1");
    expect(rows.get("sub_1")).toMatchObject({ user_id: USER_ID, status: "active", price_id: "pri_monthly" });
  });

  it("falls back to the account with the checkout email", async () => {
    const { store, rows } = fakeStore({ "reader@example.com": USER_ID });
    await processPaddleWebhookEvent(
      subscriptionEvent(EventName.SubscriptionCreated, { customData: { userEmail: "Reader@Example.com" } }),
      store,
    );
    expect(rows.get("sub_1")?.user_id).toBe(USER_ID);
  });

  it("still records a subscription with no matching account", async () => {
    const { store, rows } = fakeStore();
    await processPaddleWebhookEvent(subscriptionEvent(EventName.SubscriptionCreated, { customData: null }), store);
    expect(rows.get("sub_1")?.user_id).toBeNull();
  });

  it("is idempotent when Paddle retries the same event", async () => {
    const { store, rows } = fakeStore();
    const event = subscriptionEvent(EventName.SubscriptionCreated);
    await processPaddleWebhookEvent(event, store);
    await processPaddleWebhookEvent(event, store);
    expect(rows.size).toBe(1);
    expect(rows.get("sub_1")?.status).toBe("active");
  });

  it("ignores an older event that arrives after a newer one", async () => {
    const { store, rows } = fakeStore();
    await processPaddleWebhookEvent(
      subscriptionEvent(EventName.SubscriptionCanceled, { status: "canceled", updatedAt: "2026-10-05T00:00:00Z" }),
      store,
    );
    const late = await processPaddleWebhookEvent(
      subscriptionEvent(EventName.SubscriptionUpdated, { status: "active", updatedAt: "2026-10-02T00:00:00Z" }),
      store,
    );
    expect(late.actionTaken).toBe("Skipped stale event");
    expect(rows.get("sub_1")?.status).toBe("canceled");
  });

  it("handles past_due and paused updates", async () => {
    const { store, rows } = fakeStore();
    await processPaddleWebhookEvent(
      subscriptionEvent(EventName.SubscriptionPastDue, { status: "past_due", updatedAt: "2026-10-02T00:00:00Z" }),
      store,
    );
    expect(rows.get("sub_1")?.status).toBe("past_due");
    await processPaddleWebhookEvent(
      subscriptionEvent(EventName.SubscriptionPaused, { status: "paused", updatedAt: "2026-10-03T00:00:00Z" }),
      store,
    );
    expect(rows.get("sub_1")?.status).toBe("paused");
  });

  it("ignores non-subscription events", async () => {
    const { store, rows } = fakeStore();
    const result = await processPaddleWebhookEvent(
      { eventId: "e", eventType: EventName.TransactionCompleted, data: { id: "txn_1" } } as unknown as EventEntity,
      store,
    );
    expect(result.handled).toBe(false);
    expect(rows.size).toBe(0);
  });
});

describe("Founding members (one-time lifetime purchase)", () => {
  const LIFETIME = "pri_lifetime_test";
  const transaction = (priceId: string, id = "txn_1"): EventEntity =>
    ({
      eventId: `evt_${Math.random()}`,
      eventType: EventName.TransactionCompleted,
      occurredAt: "2026-10-13T10:00:00Z",
      notificationId: "ntf_2",
      data: {
        id,
        status: "completed",
        customerId: "ctm_9",
        billedAt: "2026-10-13T10:00:00Z",
        items: [{ price: { id: priceId } }],
        customData: { userId: USER_ID },
      },
    }) as unknown as EventEntity;
  const refund = (transactionId: string): EventEntity =>
    ({
      eventId: `evt_${Math.random()}`,
      eventType: EventName.AdjustmentUpdated,
      occurredAt: "2026-10-14T10:00:00Z",
      notificationId: "ntf_3",
      data: { transactionId, action: "refund", status: "approved" },
    }) as unknown as EventEntity;

  it("records a founding purchase against the buyer's account, once", async () => {
    process.env.NEXT_PUBLIC_PADDLE_LIFETIME_PRICE_ID = LIFETIME;
    const { store, lifetime } = fakeStore();
    const first = await processPaddleWebhookEvent(transaction(LIFETIME), store);
    await processPaddleWebhookEvent(transaction(LIFETIME), store); // Paddle redelivers
    expect(first.handled).toBe(true);
    expect(lifetime.size).toBe(1);
    expect(lifetime.get("txn_1")).toMatchObject({ user_id: USER_ID, price_id: LIFETIME, status: "completed" });
  });

  it("ignores completed transactions for other prices (subscription renewals)", async () => {
    process.env.NEXT_PUBLIC_PADDLE_LIFETIME_PRICE_ID = LIFETIME;
    const { store, lifetime } = fakeStore();
    const result = await processPaddleWebhookEvent(transaction("pri_monthly", "txn_2"), store);
    expect(result.handled).toBe(false);
    expect(lifetime.size).toBe(0);
  });

  it("marks a refunded founding purchase so it no longer grants Premium", async () => {
    process.env.NEXT_PUBLIC_PADDLE_LIFETIME_PRICE_ID = LIFETIME;
    const { store, lifetime } = fakeStore();
    await processPaddleWebhookEvent(transaction(LIFETIME), store);
    const result = await processPaddleWebhookEvent(refund("txn_1"), store);
    expect(result.handled).toBe(true);
    expect(lifetime.get("txn_1")?.status).toBe("refunded");
  });
});
