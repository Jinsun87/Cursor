"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";
import { SERIES } from "@/lib/catalog";

export default function ProfilePage() {
  const { user, logout, ready } = useApp();

  if (!ready) return <p>Loading…</p>;
  if (!user) {
    return (
      <p>
        <Link href="/login" className="text-gold-400">
          Log in
        </Link>{" "}
        to see your trail.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-4xl">{user.username}</h1>
          <p className="mt-1 text-parchment/70">{user.email}</p>
        </div>
        {user.premium ? (
          <span className="rounded-full bg-gold-400 px-3 py-1 text-sm text-pine-950">Premium</span>
        ) : null}
      </div>
      <dl className="mt-8 grid grid-cols-2 gap-4 text-sm">
        <div className="rounded-2xl border border-pine-700 p-4">
          <dt className="text-pine-400">Coins</dt>
          <dd className="font-display text-2xl">{user.coins.toLocaleString()}</dd>
        </div>
        <div className="rounded-2xl border border-pine-700 p-4">
          <dt className="text-pine-400">Quizzes logged</dt>
          <dd className="font-display text-2xl">{user.attempts.length}</dd>
        </div>
      </dl>
      <h2 className="mt-10 font-display text-2xl">Certificates</h2>
      {user.masteredSeries.length ? (
        <ul className="mt-3 space-y-2">
          {user.masteredSeries.map((slug) => {
            const series = SERIES.find((s) => s.slug === slug);
            return (
              <li key={slug}>
                <Link href={`/certificate/${slug}`} className="text-gold-400">
                  {series?.title ?? slug}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-2 text-parchment/70">Finish a pack review at 70%+ to hang a certificate here.</p>
      )}
      {user.donatedCents ? (
        <p className="mt-6 text-sm text-parchment/70">
          Simulated donations: ${(user.donatedCents / 100).toFixed(0)}
        </p>
      ) : null}
      <div className="mt-8 flex gap-3">
        {!user.premium ? (
          <Link href="/premium" className="rounded-full bg-gold-400 px-4 py-2 text-pine-950">
            Upgrade
          </Link>
        ) : null}
        <button type="button" onClick={logout} className="rounded-full border border-pine-500 px-4 py-2">
          Log out
        </button>
      </div>
    </div>
  );
}
