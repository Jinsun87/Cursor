import { NextRequest } from "next/server";
import { getAdminSupabase, getServerSupabase } from "@/lib/supabase/server";

// Home-screen installs, reported by the app itself (lib/install.ts). One row per
// installed copy; launches are counted in days, so a report is at most daily.
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SOURCES = new Set(["launch", "appinstalled"]);
const PLATFORMS = new Set(["ios", "android", "desktop", "other"]);

export async function POST(request: NextRequest) {
  let body: { deviceId?: unknown; source?: unknown; platform?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Bad JSON" }, { status: 400 });
  }
  const { deviceId, source, platform } = body;
  if (
    typeof deviceId !== "string" ||
    !UUID.test(deviceId) ||
    typeof source !== "string" ||
    !SOURCES.has(source) ||
    typeof platform !== "string" ||
    !PLATFORMS.has(platform)
  ) {
    return Response.json({ error: "Bad install report" }, { status: 400 });
  }

  let userId: string | null = null;
  try {
    const { data } = await (await getServerSupabase()).auth.getUser();
    userId = data.user?.id ?? null;
  } catch {
    /* a guest */
  }

  try {
    const db = getAdminSupabase();
    const now = new Date().toISOString();
    const { data: existing, error: readError } = await db
      .from("app_installs")
      .select("launch_days, first_launch_at, user_id")
      .eq("device_id", deviceId)
      .maybeSingle();
    if (readError) throw readError;
    const launch = source === "launch";
    const { error } = !existing
      ? await db.from("app_installs").insert({
          device_id: deviceId,
          user_id: userId,
          platform,
          first_launch_at: launch ? now : null,
          last_launch_at: launch ? now : null,
          launch_days: launch ? 1 : 0,
        })
      : await db
          .from("app_installs")
          .update({
            user_id: userId ?? existing.user_id,
            ...(launch
              ? { first_launch_at: existing.first_launch_at ?? now, last_launch_at: now, launch_days: (existing.launch_days ?? 0) + 1 }
              : {}),
          })
          .eq("device_id", deviceId);
    if (error) throw error;
  } catch (error) {
    console.warn("[install] could not record:", error);
  }
  return new Response(null, { status: 204 });
}
