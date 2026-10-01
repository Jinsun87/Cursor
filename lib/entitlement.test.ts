import { describe, expect, it } from "vitest";
import {
  checkoutIdentity,
  hasPremium,
  isPremiumStatus,
  planForPrice,
  primarySubscription,
  subscriptionRowFromPaddle,
} from "./entitlement";
import { safeNext } from "./safe-next";

describe("isPremiumStatus", () => {
  it("grants Premium while active, trialing, or retrying a failed payment", () => {
    expect(isPremiumStatus("active")).toBe(true);
    expect(isPremiumStatus("trialing")).toBe(true);
    expect(isPremiumStatus("past_due")).toBe(true);
  });

  it("removes Premium when paused or canceled", () => {
    expect(isPremiumStatus("paused")).toBe(false);
    expect(isPremiumStatus("canceled")).toBe(false);
  });
});

describe("hasPremium", () => {
  it("is true if any subscription is premium", () => {
    expect(hasPremium([{ status: "canceled" }, { status: "active" }])).toBe(true);
    expect(hasPremium([{ status: "canceled" }])).toBe(false);
    expect(hasPremium([])).toBe(false);
  });
});

describe("primarySubscription", () => {
  it("prefers a premium subscription over a newer canceled one", () => {
    const subs = [
      { status: "active" as const, paddle_updated_at: "2026-01-01T00:00:00Z", id: "old-active" },
      { status: "canceled" as const, paddle_updated_at: "2026-06-01T00:00:00Z", id: "new-canceled" },
    ];
    expect(primarySubscription(subs)?.id).toBe("old-active");
  });

  it("falls back to the most recently updated", () => {
    const subs = [
      { status: "canceled" as const, paddle_updated_at: "2026-01-01T00:00:00Z", id: "a" },
      { status: "canceled" as const, paddle_updated_at: "2026-03-01T00:00:00Z", id: "b" },
    ];
    expect(primarySubscription(subs)?.id).toBe("b");
  });
});

describe("planForPrice", () => {
  const prices = { monthly: ["pri_m"], annual: ["pri_a"] };
  it("maps known price ids", () => {
    expect(planForPrice("pri_m", prices)).toBe("monthly");
    expect(planForPrice("pri_a", prices)).toBe("annual");
    expect(planForPrice("pri_x", prices)).toBeUndefined();
    expect(planForPrice(null, prices)).toBeUndefined();
  });
});

describe("subscriptionRowFromPaddle", () => {
  it("maps the fields the app stores", () => {
    const row = subscriptionRowFromPaddle(
      {
        id: "sub_1",
        status: "active",
        customerId: "ctm_1",
        updatedAt: "2026-10-01T10:00:00Z",
        currentBillingPeriod: { endsAt: "2026-11-01T10:00:00Z" },
        scheduledChange: { action: "cancel" },
        items: [{ price: { id: "pri_m" } }],
      },
      "user-1",
    );
    expect(row).toEqual({
      paddle_subscription_id: "sub_1",
      user_id: "user-1",
      paddle_customer_id: "ctm_1",
      status: "active",
      price_id: "pri_m",
      current_period_end: "2026-11-01T10:00:00Z",
      scheduled_change: "cancel",
      paddle_updated_at: "2026-10-01T10:00:00Z",
    });
  });

  it("rejects statuses it does not understand rather than guessing", () => {
    expect(() =>
      subscriptionRowFromPaddle({ id: "s", status: "mystery", customerId: "c", updatedAt: "2026-01-01" }, null),
    ).toThrow(/Unknown Paddle subscription status/);
  });
});

describe("checkoutIdentity", () => {
  const uuid = "3f2b8c1e-9a4d-4e7b-8c2a-1d5e6f7a8b9c";

  it("reads userId and normalises email", () => {
    expect(checkoutIdentity({ userId: uuid, userEmail: " Reader@Example.com " })).toEqual({
      userId: uuid,
      email: "reader@example.com",
    });
  });

  it("ignores a userId that is not a UUID (e.g. an old username value)", () => {
    expect(checkoutIdentity({ userId: "MapleMind", userEmail: "a@b.co" })).toEqual({ email: "a@b.co" });
  });

  it("handles missing or malformed custom data", () => {
    expect(checkoutIdentity(null)).toEqual({});
    expect(checkoutIdentity("nope")).toEqual({});
    expect(checkoutIdentity({ userEmail: "not-an-email" })).toEqual({});
  });
});

describe("safeNext", () => {
  it("allows same-site paths only", () => {
    expect(safeNext("/pricing")).toBe("/pricing");
    expect(safeNext("https://evil.example")).toBe("/profile");
    expect(safeNext("//evil.example")).toBe("/profile");
    expect(safeNext("/\\evil.example")).toBe("/profile");
    expect(safeNext(null)).toBe("/profile");
  });
});
