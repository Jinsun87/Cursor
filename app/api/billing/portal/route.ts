import { getPaddleInstance } from "@/lib/paddle/get-paddle-instance";
import { primarySubscription, type SubscriptionRow } from "@/lib/entitlement";
import { getServerSupabase } from "@/lib/supabase/server";

/** Returns a one-time link to Paddle's customer portal (cancel, update card, invoices). */
export async function POST() {
  const supabase = await getServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return Response.json({ error: "Sign in first" }, { status: 401 });

  // RLS limits this to the signed-in user's own subscriptions.
  const { data: subs, error } = await supabase
    .from("subscriptions")
    .select("paddle_subscription_id, paddle_customer_id, status, paddle_updated_at");
  if (error) return Response.json({ error: "Could not load subscription" }, { status: 500 });

  const sub = primarySubscription((subs ?? []) as Pick<
    SubscriptionRow,
    "paddle_subscription_id" | "paddle_customer_id" | "status" | "paddle_updated_at"
  >[]);
  if (!sub) return Response.json({ error: "No subscription found" }, { status: 404 });

  try {
    const session = await getPaddleInstance().customerPortalSessions.create(sub.paddle_customer_id, [
      sub.paddle_subscription_id,
    ]);
    return Response.json({ url: session.urls.general.overview });
  } catch (err) {
    console.error("Paddle portal session failed:", err);
    return Response.json({ error: "Billing portal unavailable" }, { status: 502 });
  }
}
