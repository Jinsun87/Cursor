import { afterEach, describe, expect, it, vi } from "vitest";
import type { PaddleEventData } from "@paddle/paddle-js";

const trackEvent = vi.fn();
vi.mock("@/lib/analytics", () => ({ trackEvent: (...a: unknown[]) => trackEvent(...a) }));

import { onPaddleEvent } from "./events";

const totals = (total: number) => ({ discount: 0, subtotal: total, tax: 0, total });

function event(name: string, opts: { trial?: boolean; total: number; recurring?: number }): PaddleEventData {
  return {
    name,
    data: {
      currency_code: "USD",
      transaction_id: "txn_1",
      totals: totals(opts.total),
      recurring_totals: opts.recurring === undefined ? undefined : totals(opts.recurring),
      items: [
        {
          price_id: "pri_year",
          price_name: "Yearly",
          product: { id: "pro_1", name: "Lampstand Premium" },
          quantity: 1,
          totals: totals(opts.total),
          recurring_totals: opts.recurring === undefined ? undefined : totals(opts.recurring),
          trial_period: opts.trial ? { frequency: 7, interval: "day" } : undefined,
        },
      ],
    },
  } as unknown as PaddleEventData;
}

describe("onPaddleEvent", () => {
  afterEach(() => trackEvent.mockReset());

  it("sends begin_checkout when the checkout opens", () => {
    onPaddleEvent(event("checkout.loaded", { total: 4.99 }));
    expect(trackEvent).toHaveBeenCalledWith("begin_checkout", expect.objectContaining({ currency: "USD", value: 4.99 }));
  });

  it("sends trial_start (valued at the first renewal) for a free trial", () => {
    onPaddleEvent(event("checkout.completed", { trial: true, total: 0, recurring: 39.99 }));
    expect(trackEvent).toHaveBeenCalledWith("trial_start", expect.objectContaining({ value: 39.99, transaction_id: "txn_1", trial: true }));
  });

  it("sends purchase for a paid checkout such as founding", () => {
    onPaddleEvent(event("checkout.completed", { total: 99 }));
    expect(trackEvent).toHaveBeenCalledWith("purchase", expect.objectContaining({ value: 99, transaction_id: "txn_1" }));
  });

  it("ignores other checkout events", () => {
    onPaddleEvent(event("checkout.customer.created", { total: 4.99 }));
    onPaddleEvent({ name: "checkout.closed" } as unknown as PaddleEventData);
    expect(trackEvent).not.toHaveBeenCalled();
  });
});
