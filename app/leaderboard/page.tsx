"use client";

import { useEffect, useState } from "react";
import { listPublicProfiles } from "@/lib/store";
import { SERIES } from "@/lib/catalog";

export default function LeaderboardPage() {
  const [rows, setRows] = useState<ReturnType<typeof listPublicProfiles>>([]);

  useEffect(() => {
    setRows(listPublicProfiles());
  }, []);

  const ranked = [...rows].sort((a, b) => {
    const am = a.masteredSeries.length;
    const bm = b.masteredSeries.length;
    if (bm !== am) return bm - am;
    return b.attempts.length - a.attempts.length || b.coins - a.coins;
  });

  return (
    <div>
      <h1 className="font-display text-4xl">Bragging board</h1>
      <p className="mt-2 text-parchment/70">
        Ranked by certificates, then quizzes logged, then coins. Demo hikers
        appear on first visit so the trail is not empty.
      </p>
      <ol className="mt-8 space-y-3">
        {ranked.map((row, i) => (
          <li
            key={row.username}
            className="flex items-center justify-between rounded-2xl border border-pine-700 bg-pine-900/50 px-4 py-3"
          >
            <span>
              <span className="mr-3 text-pine-400">{i + 1}</span>
              {row.username}
              {row.premium ? <span className="ml-2 text-gold-400">★</span> : null}
            </span>
            <span className="text-sm text-parchment/70">
              {row.masteredSeries.length} mastered · {row.attempts.length} plays ·{" "}
              {row.coins.toLocaleString()} coins
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-xs text-parchment/50">
        Series in this gym: {SERIES.map((s) => s.title).join(", ")}.
      </p>
    </div>
  );
}
