import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/env";

// Refreshes the Supabase session cookie on navigation so server routes see a
// valid user. Does not gate any page; access rules live in the pages/APIs.
export async function middleware(request: NextRequest) {
  const url = supabaseUrl();
  const key = supabasePublishableKey();
  if (!url || !key) return NextResponse.next();

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet, headers) => {
        for (const { name, value } of toSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of toSet) response.cookies.set(name, value, options);
        for (const [header, value] of Object.entries(headers ?? {})) response.headers.set(header, value);
      },
    },
  });

  // Must run before the response is returned so a refreshed token is written back.
  await supabase.auth.getClaims();
  return response;
}

export const config = {
  matcher: [
    // Skip static assets, images, media, and the Paddle webhook (no user session).
    "/((?!_next/static|_next/image|favicon.ico|images/|daily-walk/|api/webhooks/|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|mp3|wav|txt|xml)$).*)",
  ],
};
