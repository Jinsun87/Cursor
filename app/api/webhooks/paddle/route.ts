import { NextRequest } from "next/server";
import { getPaddleInstance } from "@/lib/paddle/get-paddle-instance";
import { processPaddleWebhookEvent } from "@/lib/paddle/process-webhook";
import { supabaseSubscriptionStore } from "@/lib/paddle/supabase-subscription-store";
import { getAdminSupabase } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("paddle-signature") ?? "";
  const rawBody = await request.text();
  const secret = process.env.PADDLE_NOTIFICATION_WEBHOOK_SECRET ?? "";

  // Pre-validation: a request with no signature header or empty body
  // can't be verified or processed.
  if (!signature || !rawBody) {
    return Response.json(
      { error: "Missing signature or body" },
      { status: 400 },
    );
  }

  if (!secret) {
    console.error("PADDLE_NOTIFICATION_WEBHOOK_SECRET is not configured on server.");
    return Response.json(
      { error: "Server webhook secret not configured" },
      { status: 500 },
    );
  }

  try {
    const paddle = getPaddleInstance();
    // Throws on signature mismatch, expired timestamp, or malformed event.
    const eventData = await paddle.webhooks.unmarshal(rawBody, secret, signature);

    if (eventData) {
      const result = await processPaddleWebhookEvent(eventData, supabaseSubscriptionStore(getAdminSupabase()));
      console.log(`[Paddle Webhook] ${result.eventType} ${result.entityId ?? ""}: ${result.actionTaken}`);
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("Paddle webhook error:", error);
    // Non-2xx response tells Paddle to retry on its delivery schedule
    return Response.json({ error: "Webhook processing error" }, { status: 500 });
  }
}
