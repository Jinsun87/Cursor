import type { SupabaseClient } from "@supabase/supabase-js";
import type { SubscriptionStore } from "./process-webhook";

export function supabaseSubscriptionStore(admin: SupabaseClient): SubscriptionStore {
  return {
    async upsertSubscription(row) {
      const { data, error } = await admin.rpc("upsert_paddle_subscription", {
        p_subscription_id: row.paddle_subscription_id,
        p_user_id: row.user_id,
        p_customer_id: row.paddle_customer_id,
        p_status: row.status,
        p_price_id: row.price_id,
        p_current_period_end: row.current_period_end,
        p_scheduled_change: row.scheduled_change,
        p_paddle_updated_at: row.paddle_updated_at,
      });
      if (error) throw new Error(`upsert_paddle_subscription failed: ${error.message}`);
      return data === true;
    },

    async findUserIdByEmail(email) {
      const { data, error } = await admin
        .from("profiles")
        .select("id")
        // Supabase Auth stores emails lowercased; checkoutIdentity lowercases too.
        .eq("email", email.toLowerCase())
        .limit(1)
        .maybeSingle();
      if (error) throw new Error(`profile lookup failed: ${error.message}`);
      return data?.id ?? null;
    },
  };
}
