// Who has Premium. Pure functions so the rules are unit-tested and shared by
// the webhook (server) and the account store (client).

export type SubscriptionStatus = "active" | "trialing" | "past_due" | "paused" | "canceled";

export interface SubscriptionRow {
  paddle_subscription_id: string;
  user_id: string | null;
  paddle_customer_id: string;
  status: SubscriptionStatus;
  price_id: string | null;
  current_period_end: string | null;
  scheduled_change: string | null;
  paddle_updated_at: string;
}

/**
 * Paddle keeps a subscription `active` until the end of the paid period even
 * after the customer cancels (with a scheduled `cancel` change), then flips it
 * to `canceled`. `past_due` means Paddle is retrying a failed payment, so the
 * customer keeps access during the retry window.
 */
export function isPremiumStatus(status: string): boolean {
  return status === "active" || status === "trialing" || status === "past_due";
}

export function hasPremium(subscriptions: Pick<SubscriptionRow, "status">[]): boolean {
  return subscriptions.some((s) => isPremiumStatus(s.status));
}

/** The subscription to show on the profile: a premium one first, then the most recent. */
export function primarySubscription<T extends Pick<SubscriptionRow, "status" | "paddle_updated_at">>(
  subscriptions: T[],
): T | undefined {
  return [...subscriptions].sort((a, b) => {
    const premiumDiff = Number(isPremiumStatus(b.status)) - Number(isPremiumStatus(a.status));
    if (premiumDiff) return premiumDiff;
    return b.paddle_updated_at.localeCompare(a.paddle_updated_at);
  })[0];
}

export function planForPrice(
  priceId: string | null | undefined,
  prices: { monthly?: string[]; annual?: string[] },
): "monthly" | "annual" | undefined {
  if (!priceId) return undefined;
  if (prices.annual?.includes(priceId)) return "annual";
  if (prices.monthly?.includes(priceId)) return "monthly";
  return undefined;
}

/** The fields of a Paddle subscription notification this app stores. */
export interface PaddleSubscriptionLike {
  id: string;
  status: string;
  customerId: string;
  updatedAt: string;
  currentBillingPeriod?: { endsAt: string } | null;
  scheduledChange?: { action: string } | null;
  items?: { price?: { id: string } | null }[] | null;
  customData?: unknown;
}

const KNOWN_STATUSES: SubscriptionStatus[] = ["active", "trialing", "past_due", "paused", "canceled"];

/** Map a Paddle subscription notification to a `subscriptions` row. */
export function subscriptionRowFromPaddle(
  sub: PaddleSubscriptionLike,
  userId: string | null,
): SubscriptionRow {
  if (!KNOWN_STATUSES.includes(sub.status as SubscriptionStatus)) {
    throw new Error(`Unknown Paddle subscription status "${sub.status}"`);
  }
  return {
    paddle_subscription_id: sub.id,
    user_id: userId,
    paddle_customer_id: sub.customerId,
    status: sub.status as SubscriptionStatus,
    price_id: sub.items?.[0]?.price?.id ?? null,
    current_period_end: sub.currentBillingPeriod?.endsAt ?? null,
    scheduled_change: sub.scheduledChange?.action ?? null,
    paddle_updated_at: sub.updatedAt,
  };
}

/** Checkout attaches `{ userId, userEmail }` as custom data; read it defensively. */
export function checkoutIdentity(customData: unknown): { userId?: string; email?: string } {
  if (!customData || typeof customData !== "object") return {};
  const data = customData as Record<string, unknown>;
  const userId = typeof data.userId === "string" && UUID.test(data.userId) ? data.userId : undefined;
  const rawEmail = data.userEmail ?? data.email;
  const email = typeof rawEmail === "string" && rawEmail.includes("@") ? rawEmail.trim().toLowerCase() : undefined;
  return { userId, email };
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
