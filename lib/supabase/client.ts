"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabasePublishableKey, supabaseUrl } from "./env";

let client: SupabaseClient | null | undefined;

/** Browser Supabase client, or null when the project keys are not configured. */
export function getBrowserSupabase(): SupabaseClient | null {
  if (client !== undefined) return client;
  const url = supabaseUrl();
  const key = supabasePublishableKey();
  client = url && key ? createBrowserClient(url, key) : null;
  return client;
}
