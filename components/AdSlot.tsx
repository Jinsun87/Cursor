"use client";

import { useApp } from "@/lib/store";

export function AdSlot({ label = "Advertisement" }: { label?: string }) {
  const { user } = useApp();
  if (user?.premium) return null;
  return (
    <div className="my-6 rounded-xl border border-dashed border-pine-600 bg-pine-900/40 p-6 text-center">
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
