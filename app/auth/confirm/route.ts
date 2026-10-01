import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { safeNext } from "@/lib/safe-next";
import { getServerSupabase } from "@/lib/supabase/server";

/**
 * Landing route for email sign-in links, sign-up confirmations, and Google sign-in.
 *
 * Email links use `token_hash` (see docs/accounts-setup.md for the email
 * templates) so they work even when opened on a different device than the one
 * that requested them, which is common for older readers who check email on
 * one device and browse on another. Google sign-in returns a `code`.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const next = safeNext(searchParams.get("next"));
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");

  const supabase = await getServerSupabase();
  const { error } = tokenHash && type
    ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
    : code
      ? await supabase.auth.exchangeCodeForSession(code)
      : { error: new Error("Missing sign-in token") };

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=link`);
  }
  return NextResponse.redirect(`${origin}${next}`);
}
