"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/lib/store";
import { EZOIC_PLACEHOLDERS, ezoicAdsEnabled, runEzoic } from "@/lib/ezoic";

export function AdSlot({
  label = "Advertisement",
  placeholderId = EZOIC_PLACEHOLDERS.inQuizSecret,
}: {
  label?: string;
  placeholderId?: number;
}) {
  const { user } = useApp();
  const [ready, setReady] = useState(false);
  const live = ezoicAdsEnabled();

  useEffect(() => {
    if (user?.premium || !live) return;
    setReady(true);
    runEzoic(() => {
      window.ezstandalone?.showAds?.(placeholderId);
    });
    return () => {
      runEzoic(() => {
        window.ezstandalone?.destroyPlaceholders?.(placeholderId);
      });
    };
  }, [live, placeholderId, user?.premium]);

  if (user?.premium) return null;

  return (
    <div
      data-testid="ad-slot"
      className="my-6 rounded-xl border border-dashed p-6 text-center"
      style={{ borderColor: "var(--line)", background: "var(--canvas)" }}
    >
      <p className="text-xs uppercase tracking-widest text-pine-400">{label}</p>
      {live && ready ? (
        <div className="mx-auto min-h-24">
          <div id={`ezoic-pub-ad-placeholder-${placeholderId}`} />
        </div>
      ) : (
        <>
          <p className="mt-2 font-display text-lg">Sponsored placement</p>
          <p className="mt-1 text-sm text-parchment/60">
            Free accounts see ads on long sittings and the quiet room.{" "}
            <a href="/premium" className="text-gold-400">
              Go Premium
            </a>{" "}
            for a quieter path.
          </p>
        </>
      )}
    </div>
  );
}
