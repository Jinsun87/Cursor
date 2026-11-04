import { adsenseClient } from "@/lib/adsense";

// Authorises Google AdSense to sell ads on this site, when AdSense is on.
export function GET() {
  const client = adsenseClient();
  if (!client) return new Response("Not found", { status: 404 });
  const publisher = client.replace(/^ca-/, "");
  return new Response(`google.com, ${publisher}, DIRECT, f08c47fec0942fa0\n`, {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" },
  });
}
