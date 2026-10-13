"use client";

import { useEffect, useState } from "react";
import type { FoundingSpots } from "@/lib/founding";

/** The live founding-spots count, or null while loading or if unavailable. */
export function useFoundingSpots(): FoundingSpots | null {
  const [spots, setSpots] = useState<FoundingSpots | null>(null);
  useEffect(() => {
    let live = true;
    fetch("/api/founding")
      .then((r) => (r.ok ? r.json() : null))
      .then((s: FoundingSpots | null) => live && setSpots(s))
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, []);
  return spots;
}
