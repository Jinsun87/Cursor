import type { Metadata } from "next";
import { WalkPlayer } from "@/components/daily-walk/WalkPlayer";
import { GENESIS_1 } from "@/lib/daily-walk/genesis-1";
import timing from "@/public/daily-walk/genesis-1/timing.json";

// Prototype of the audio-led Daily Walk reel. Placeholder voice only.
export const metadata: Metadata = {
  title: "Daily Walk preview",
  robots: { index: false, follow: false },
};

export default async function WalkPreviewPage({ searchParams }: { searchParams: Promise<{ t?: string }> }) {
  const { t } = await searchParams;
  return (
    <div className="space-y-4 py-4">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold)]">Prototype · placeholder voice</p>
        <h1 className="font-display text-2xl font-bold text-[var(--ink)]">Daily Walk · Genesis 1</h1>
      </div>
      <WalkPlayer episode={GENESIS_1} timing={timing} initialSeconds={Number(t) || 0} />
    </div>
  );
}
