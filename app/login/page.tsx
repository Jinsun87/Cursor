"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { safeNext } from "@/lib/safe-next";
import { AccountsUnavailable, CheckEmail, GoogleButton } from "@/components/auth/CheckEmail";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const { user, ready, accountsAvailable, sendSignInLink, signInWithPassword, signInWithGoogle } = useApp();
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const [error, setError] = useState<string | null>(
    params.get("error") === "link" ? "That sign-in link has expired or was already used. Request a new one below." : null,
  );
  const [email, setEmail] = useState("");
  const [usePassword, setUsePassword] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (ready && user) router.replace(next);
  }, [ready, user, next, router]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setBusy(true);
    setError(null);
    if (usePassword) {
      const err = await signInWithPassword(email, String(data.get("password")));
      if (err) setError(err);
      // On success the auth listener loads the account and the effect above redirects.
    } else {
      const err = await sendSignInLink(email, next);
      if (err) setError(err);
      else setSentTo(email);
    }
    setBusy(false);
  }

  async function resend() {
    if (!sentTo) return;
    const err = await sendSignInLink(sentTo, next);
    if (err) setError(err);
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="font-display text-4xl">Hello again</h1>
      <p className="mt-2 text-parchment/70">Sign in to keep your Premium, coins, and certificates.</p>

      {!accountsAvailable ? <AccountsUnavailable /> : null}

      {sentTo ? (
        <CheckEmail email={sentTo} onResend={resend} onBack={() => setSentTo(null)} />
      ) : (
        <>
          <GoogleButton onClick={() => void signInWithGoogle(next).then(setError)} />
          <form onSubmit={onSubmit} className="mt-8 grid gap-4">
            <label className="grid gap-1 text-sm">
              Email
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className="field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            {usePassword ? (
              <label className="grid gap-1 text-sm">
                Password
                <input name="password" type="password" required autoComplete="current-password" className="field" />
              </label>
            ) : null}
            {error ? <p className="text-sm text-red-300">{error}</p> : null}
            <button type="submit" className="btn btn-primary" disabled={busy || !accountsAvailable}>
              {busy ? "One moment…" : usePassword ? "Sign in" : "Email me a sign-in link"}
            </button>
            <button
              type="button"
              onClick={() => setUsePassword((v) => !v)}
              className="text-sm text-parchment/70 underline underline-offset-4"
            >
              {usePassword ? "Email me a link instead" : "Use a password instead"}
            </button>
          </form>
        </>
      )}

      <p className="mt-6 text-sm">
        No account?{" "}
        <Link href={`/register?next=${encodeURIComponent(next)}`} className="text-gold-400">
          Create one free
        </Link>
      </p>
    </div>
  );
}
