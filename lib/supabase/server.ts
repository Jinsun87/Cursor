import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { supabasePublishableKey, supabaseUrl } from "./env";

/** Per-request client acting as the signed-in user (RLS applies). */
export async function getServerSupabase(): Promise<SupabaseClient> {
  const url = supabaseUrl();
  const key = supabasePublishableKey();
  if (!url || !key) throw new Error("Supabase is not configured (NEXT_PUBLIC_SUPABASE_URL / _PUBLISHABLE_KEY).");

  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          for (const { name, value, options } of toSet) cookieStore.set(name, value, options);
        } catch {
          // Called from a Server Component, where cookies are read-only.
          // middleware.ts refreshes the session instead.
        }
      },
    },
  });
}

/**
 * Service-role client that bypasses RLS. Server-only: used by the Paddle
 * webhook to write subscriptions. Never import this from client code.
 */
export function getAdminSupabase(): SupabaseClient {
  const url = supabaseUrl();
  const secret = process.env.SUPABASE_SECRET_KEY?.trim();
  if (!url || !secret) throw new Error("Supabase admin is not configured (SUPABASE_SECRET_KEY).");
  return createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } });
}
