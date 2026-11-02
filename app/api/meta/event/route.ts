import { NextRequest } from "next/server";
import { capiConfigured, sendCapiEvents } from "@/lib/meta/capi";
import { getServerSupabase } from "@/lib/supabase/server";

// The browser pixel's events, relayed to the Conversions API with the same event id.
// The browser only calls this after the visitor's consent check (lib/meta/pixel.ts).
const ALLOWED = new Set(["ViewContent", "CompleteRegistration"]);

export async function POST(request: NextRequest) {
  if (!capiConfigured()) return new Response(null, { status: 204 });

  let body: { event?: unknown; eventId?: unknown; params?: unknown; url?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Bad JSON" }, { status: 400 });
  }
  const { event, eventId, params, url } = body;
  if (typeof event !== "string" || !ALLOWED.has(event) || typeof eventId !== "string" || eventId.length > 64) {
    return Response.json({ error: "Unknown event" }, { status: 400 });
  }

  const customData: Record<string, string | number> = {};
  if (params && typeof params === "object") {
    for (const [k, v] of Object.entries(params).slice(0, 8)) {
      if (/^[a-z_]{1,40}$/.test(k) && (typeof v === "number" || (typeof v === "string" && v.length <= 120))) customData[k] = v;
    }
  }

  let email: string | undefined;
  let userId: string | undefined;
  try {
    const { data } = await (await getServerSupabase()).auth.getUser();
    email = data.user?.email ?? undefined;
    userId = data.user?.id;
  } catch {
    /* a guest */
  }

  const origin = request.nextUrl.origin;
  await sendCapiEvents([
    {
      name: event,
      id: eventId,
      sourceUrl: typeof url === "string" && url.startsWith(origin) ? url.slice(0, 500) : undefined,
      actionSource: "website",
      user: {
        email,
        userId,
        ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined,
        userAgent: request.headers.get("user-agent") ?? undefined,
        fbp: request.cookies.get("_fbp")?.value,
        fbc: request.cookies.get("_fbc")?.value,
      },
      customData,
    },
  ]);
  return new Response(null, { status: 204 });
}
