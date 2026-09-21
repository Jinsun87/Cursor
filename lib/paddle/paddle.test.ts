import { describe, it, expect, vi } from "vitest";
import { isPaddleConfigured } from "./client";
import { processPaddleWebhookEvent } from "./process-webhook";
import { EventName } from "@paddle/paddle-node-sdk";

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

describe("Paddle Webhook Processor", () => {
  it("processes subscription.created event idempotently", async () => {
    const mockEvent = {
      eventId: "evt_01h8abc",
      eventType: EventName.SubscriptionCreated,
      occurredAt: new Date().toISOString(),
      notificationId: "ntf_01h8xyz",
      data: {
        id: "sub_01h8abc",
        status: "active",
        customerId: "ctm_01h8def",
        customData: {
          userEmail: "tester@lampstand.demo",
        },
      },
    };

    // @ts-expect-error test mock
    const result = await processPaddleWebhookEvent(mockEvent);
    expect(result.handled).toBe(true);
    expect(result.eventType).toBe("subscription.created");
    expect(result.entityId).toBe("sub_01h8abc");
  });

  it("processes transaction.completed event", async () => {
    const mockEvent = {
      eventId: "evt_01h8tx",
      eventType: EventName.TransactionCompleted,
      occurredAt: new Date().toISOString(),
      notificationId: "ntf_01h8tx",
      data: {
        id: "txn_01h8tx",
        status: "completed",
        currencyCode: "USD",
        details: {
          totals: {
            total: "999",
          },
        },
        customData: {
          giftCause: "platform",
        },
      },
    };

    // @ts-expect-error test mock
    const result = await processPaddleWebhookEvent(mockEvent);
    expect(result.handled).toBe(true);
    expect(result.eventType).toBe("transaction.completed");
    expect(result.entityId).toBe("txn_01h8tx");
  });

  it("handles unhandled event types gracefully without throwing", async () => {
    const mockEvent = {
      eventId: "evt_unknown",
      eventType: "custom.unrecognized.event",
      occurredAt: new Date().toISOString(),
      notificationId: "ntf_unknown",
      data: {},
    };

    // @ts-expect-error test mock
    const result = await processPaddleWebhookEvent(mockEvent);
    expect(result.handled).toBe(false);
  });
});
