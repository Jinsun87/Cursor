"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";

const POLL_MS = 2000;
const GIVE_UP_MS = 90_000;

/**
 * Paddle redirects here right after payment, usually a few seconds before its
 * webhook reaches us. Poll the account until Premium shows up.
 */
export function ActivationStatus() {
  const { user, ready, refreshAccount } = useApp();
  const [slow, setSlow] = useState(false);
  const active = Boolean(user?.premium);

  useEffect(() => {
    if (!ready || !user || active) return;
    const started = Date.now();
    const timer = setInterval(() => {
      if (Date.now() - started > GIVE_UP_MS) {
        setSlow(true);
        clearInterval(timer);
        return;
      }
      void refreshAccount();
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [ready, user, active, refreshAccount]);

  const [tone, label] = !ready
    ? ["muted", "Checking your account…"]
    : !user
      ? ["muted", "Sign in to see your Premium"]
      : active
        ? ["ok", "Premium is active"]
        : slow
          ? ["muted", "Payment received, still activating"]
          : ["muted", "Confirming your payment…"];

  return (
    <div data-testid="activation-status" className="mt-6 flex flex-col items-center gap-3">
      <div
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
          tone === "ok"
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
            : "border-[var(--gold)]/30 bg-[var(--gold)]/10 text-[var(--gold)]"
        }`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${tone === "ok" ? "bg-emerald-400" : "bg-[var(--gold)] animate-pulse"}`} />
        {label}
      </div>
      {ready && !user ? (
        <Link href="/login?next=/welcome" className="text-sm text-[var(--gold)] underline underline-offset-4">
          Sign in
        </Link>
      ) : null}
      {slow && !active ? (
        <p className="max-w-md text-sm text-[var(--muted)]">
          Premium usually switches on within a minute. Check your profile again shortly. If it still isn&apos;t there,
          reply to your Paddle receipt email and we&apos;ll sort it out.
        </p>
      ) : null}
    </div>
  );
}
