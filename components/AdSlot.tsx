"use client";

import { useApp } from "@/lib/store";

export function AdSlot({ label = "Advertisement" }: { label?: string }) {
  const { user } = useApp();
  if (user?.premium) return null;
  return (
    <div
      data-testid="ad-slot"
      className="my-6 rounded-xl border border-dashed p-6 text-center"
      style={{ borderColor: "var(--line)", background: "var(--canvas)" }}
    >
      <p className="text-xs uppercase tracking-widest text-pine-400">{label}</p>
      <p className="mt-2 font-display text-lg">Sponsored placement</p>
      <p className="mt-1 text-sm text-parchment/60">
        Free accounts see ads on secret quizzes.{" "}
        <a href="/premium" className="text-gold-400">
          Go Premium
        </a>{" "}
        for a quieter path.
      </p>
    </div>
  );
}
