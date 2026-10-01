"use client";

import Link from "next/link";
import { useState } from "react";
import { useApp } from "@/lib/store";
import { SERIES } from "@/lib/catalog";

export default function ProfilePage() {
  const { user, logout, ready } = useApp();
  const [portalError, setPortalError] = useState<string | null>(null);
  const [openingPortal, setOpeningPortal] = useState(false);

  async function manageSubscription() {
    setOpeningPortal(true);
    setPortalError(null);
    const res = await fetch("/api/billing/portal", { method: "POST" });
    const body = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
    if (body.url) window.location.href = body.url;
    else {
      setPortalError(body.error ?? "Could not open billing. Please try again.");
      setOpeningPortal(false);
    }
  }

  if (!ready) return <p>Loading…</p>;
  if (!user) {
    return (
      <p>
        <Link href="/login?next=/profile" className="text-gold-400">
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
          <span data-testid="premium-badge" className="rounded-full bg-gold-400 px-3 py-1 text-sm text-pine-950">
            Premium
          </span>
        ) : null}
      </div>
      {user.premium ? (
        <div data-testid="premium-status" className="mt-6 rounded-2xl border border-gold-500/40 p-4 text-sm">
          <p className="font-semibold text-gold-400">
            Premium{user.premiumPlan ? ` · ${user.premiumPlan === "annual" ? "Annual" : "Monthly"}` : ""}
          </p>
          {user.premiumPeriodEnd ? (
            <p className="mt-1 text-parchment/70">
              {user.premiumScheduledChange === "cancel" ? "Ends" : "Renews"} on{" "}
              {new Date(user.premiumPeriodEnd).toLocaleDateString(undefined, { dateStyle: "long" })}
            </p>
          ) : null}
          <button
            type="button"
            onClick={manageSubscription}
            disabled={openingPortal}
            className="mt-3 text-gold-400 underline underline-offset-4"
          >
            {openingPortal ? "Opening…" : "Manage subscription (cancel, card, invoices)"}
          </button>
          {portalError ? <p className="mt-2 text-red-300">{portalError}</p> : null}
        </div>
      ) : null}
      <dl className="mt-8 grid grid-cols-2 gap-4 text-sm">
        <div className="rounded-2xl border border-pine-700 p-4">
          <dt className="text-pine-400">Coins</dt>
          <dd data-testid="coin-balance" className="font-display text-2xl">
            {user.coins.toLocaleString()}
          </dd>
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
          <Link href="/premium" className="btn btn-primary">
            Upgrade
          </Link>
        ) : null}
        <button type="button" onClick={() => void logout()} className="btn btn-ghost">
          Log out
        </button>
      </div>
    </div>
  );
}
