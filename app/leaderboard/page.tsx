"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";
import { SERIES } from "@/lib/catalog";

// The community board needs progress stored on the server (coming next).
// Until then this shows the reader's own standing only.
export default function LeaderboardPage() {
  const { user, ready } = useApp();

  return (
    <div>
      <h1 className="font-display text-4xl">Board</h1>
      <p className="mt-2 text-parchment/70">
        Ranked by certificates, then quizzes logged, then coins. The community board opens soon; for now, here is your
        own standing.
      </p>
      {!ready ? null : user ? (
        <div className="mt-8 flex items-center justify-between rounded-2xl border border-pine-700 bg-pine-900/50 px-4 py-3">
          <span>
            {user.username}
            {user.premium ? <span className="ml-2 text-gold-400">★</span> : null}
          </span>
          <span className="text-sm text-parchment/70">
            {user.masteredSeries.length} mastered · {user.attempts.length} plays · {user.coins.toLocaleString()} coins
          </span>
        </div>
      ) : (
        <p className="mt-8">
          <Link href="/login?next=/leaderboard" className="text-gold-400">
            Sign in
          </Link>{" "}
          to see your standing.
        </p>
      )}
      <p className="mt-6 text-xs text-parchment/50">
        Series on Lampstand: {SERIES.map((s) => s.title).join(", ")}.
      </p>
    </div>
  );
}
