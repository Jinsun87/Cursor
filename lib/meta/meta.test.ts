import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { EventName, type EventEntity } from "@paddle/paddle-node-sdk";
import { capiPayload, sha256 } from "./capi";
import { metaEventFromPaddle } from "./paddle-events";
import { needsConsent } from "./pixel";

const USER_ID = "3f2b8c1e-9a4d-4e7b-8c2a-1d5e6f7a8b9c";
const consented = { userId: USER_ID, userEmail: "Reader@Example.com", adConsent: "granted", fbp: "fb.1.123.456" };

function event(eventType: string, data: Record<string, unknown>): EventEntity {
  return { eventType, occurredAt: "2026-11-02T10:00:00Z", data } as unknown as EventEntity;
}

const subscription = (status: string, customData: unknown) => ({
  id: "sub_01",
  status,
  items: [{ price: { id: "pri_monthly", unitPrice: { amount: "499", currencyCode: "USD" } } }],
  customData,
});

describe("Meta conversions from Paddle", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_PADDLE_LIFETIME_PRICE_ID = "pri_founding";
  });
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_PADDLE_LIFETIME_PRICE_ID;
  });

  it("reports a new trial as StartTrial with a stable id", () => {
    const e = metaEventFromPaddle(event(EventName.SubscriptionCreated, subscription("trialing", consented)));
    expect(e).toMatchObject({ name: "StartTrial", id: "trial-sub_01", actionSource: "system_generated" });
    expect(e?.customData).toMatchObject({ value: 0, currency: "USD", predicted_ltv: 4.99 });
    expect(e?.user).toMatchObject({ email: "reader@example.com", userId: USER_ID, fbp: "fb.1.123.456" });
  });

  it("reports the first payment after a trial as Subscribe", () => {
    const e = metaEventFromPaddle(event(EventName.SubscriptionActivated, subscription("active", consented)));
    expect(e).toMatchObject({ name: "Subscribe", id: "subscribe-sub_01", customData: { value: 4.99, currency: "USD" } });
  });

  it("reports a founding payment as Purchase, and ignores other transactions", () => {
    const tx = (priceId: string) => ({
      id: "txn_01",
      currencyCode: "USD",
      items: [{ price: { id: priceId } }],
      details: { totals: { total: "9900" } },
      customData: consented,
    });
    expect(metaEventFromPaddle(event(EventName.TransactionCompleted, tx("pri_founding")))).toMatchObject({
      name: "Purchase",
      id: "purchase-txn_01",
      customData: { value: 99, currency: "USD" },
    });
    expect(metaEventFromPaddle(event(EventName.TransactionCompleted, tx("pri_monthly")))).toBeNull();
  });

  it("sends nothing without the buyer's consent", () => {
    const declined = { ...consented, adConsent: "denied" };
    expect(metaEventFromPaddle(event(EventName.SubscriptionCreated, subscription("trialing", declined)))).toBeNull();
    expect(metaEventFromPaddle(event(EventName.SubscriptionCreated, subscription("trialing", { userId: USER_ID })))).toBeNull();
  });

  it("ignores events that are not conversions", () => {
    expect(metaEventFromPaddle(event(EventName.SubscriptionCanceled, subscription("canceled", consented)))).toBeNull();
    expect(metaEventFromPaddle(event(EventName.SubscriptionCreated, subscription("active", consented)))).toBeNull();
  });
});

describe("Conversions API payload", () => {
  it("hashes email and user id, and passes browser ids as they are", () => {
    const p = capiPayload({
      name: "CompleteRegistration",
      id: "abc",
      time: new Date("2026-11-02T10:00:00Z"),
      actionSource: "website",
      user: { email: " Reader@Example.com ", userId: USER_ID, fbp: "fb.1.1.1", ip: "1.2.3.4" },
    });
    expect(p.user_data.em).toEqual([sha256("reader@example.com")]);
    expect(p.user_data.em?.[0]).toMatch(/^[0-9a-f]{64}$/);
    expect(p.user_data.external_id).toEqual([sha256(USER_ID)]);
    expect(p).toMatchObject({ event_id: "abc", event_time: 1793613600, user_data: { fbp: "fb.1.1.1", client_ip_address: "1.2.3.4" } });
  });
});

describe("consent region", () => {
  it("asks in Europe and not elsewhere", () => {
    expect(needsConsent("Europe/London")).toBe(true);
    expect(needsConsent("Europe/Berlin")).toBe(true);
    expect(needsConsent("Atlantic/Reykjavik")).toBe(true);
    expect(needsConsent("America/Chicago")).toBe(false);
    expect(needsConsent("Asia/Kolkata")).toBe(false);
  });
});
