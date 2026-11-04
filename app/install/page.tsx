import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { safeNext } from "@/lib/safe-next";
import { InstallGuide } from "@/components/install/InstallGuide";

export const metadata: Metadata = pageMetadata({
  title: "Put Lampstand on your phone",
  description: "Add Lampstand to your home screen in about 30 seconds, on iPhone or Android. No app store needed.",
  path: "/install",
});

// New accounts land here after sign-up (see app/register), then go on to `next`.
export default async function InstallPage({ searchParams }: { searchParams: Promise<{ next?: string; from?: string }> }) {
  const params = await searchParams;
  return (
    <div className="mx-auto max-w-3xl px-1 py-6">
      <InstallGuide next={safeNext(params.next, "/?tab=sleep")} from={params.from === "trial" ? "trial" : params.next ? "signup" : "direct"} />
    </div>
  );
}
