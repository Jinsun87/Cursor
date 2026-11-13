"use client";

import type { PaddleEventData } from "@paddle/paddle-js";
import { trackEvent } from "@/lib/analytics";

/**
 * Paddle checkout events → analytics (GA4 recommended e-commerce names), so the funnel
 * visit → sign_up → begin_checkout → trial_start / purchase can be measured.
 *
 * - checkout.loaded    → begin_checkout
 * - checkout.completed → trial_start when an item has a free trial (nothing is charged yet,
 *                        value = what the first renewal will cost), otherwise purchase.
 *
 * Renewals after a trial are charged server-side and arrive by webhook, not here.
 * Paddle.js amounts are numbers in major units (4.99, not 499).
 */
export function onPaddleEvent(event: PaddleEventData) {
  const name = String(event.name ?? "");
  const d = event.data;
  if (!d || (name !== "checkout.loaded" && name !== "checkout.completed")) return;

  const trial = d.items.some((i) => Boolean(i.trial_period));
  const items = d.items.map((i) => ({
    item_id: i.price_id,
    item_name: i.price_name || i.product?.name,
    quantity: i.quantity,
    price: trial ? (i.recurring_totals?.total ?? i.totals.total) : i.totals.total,
  }));
  const value = trial ? (d.recurring_totals?.total ?? d.totals.total) : d.totals.total;
  const params = { currency: d.currency_code, value, items, trial };

  if (name === "checkout.loaded") {
    trackEvent("begin_checkout", params);
  } else {
    trackEvent(trial ? "trial_start" : "purchase", { ...params, transaction_id: d.transaction_id });
  }
}
