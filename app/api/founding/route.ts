import { fetchFoundingSpots } from "@/lib/founding";

// Founding spots left, for the live count on the pricing page and in onboarding.
export const revalidate = 60;

export async function GET() {
  const spots = await fetchFoundingSpots();
  if (!spots) return Response.json({ error: "Unavailable" }, { status: 503 });
  return Response.json(spots, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
}
