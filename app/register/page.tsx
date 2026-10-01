"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { safeNext } from "@/lib/safe-next";
import { AccountsUnavailable, CheckEmail, GoogleButton } from "@/components/auth/CheckEmail";

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const { user, ready, accountsAvailable, signUp, sendSignInLink, signInWithGoogle } = useApp();
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const [error, setError] = useState<string | null>(null);
  const [withPassword, setWithPassword] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (ready && user) router.replace(next);
  }, [ready, user, next, router]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email"));
    setBusy(true);
    setError(null);
    const result = await signUp({
      email,
      username: String(data.get("username")),
      newsletter: Boolean(data.get("newsletter")),
      password: withPassword ? String(data.get("password")) : undefined,
      next,
    });
    setBusy(false);
    if (result.error) setError(result.error);
    else if (!result.signedIn) setSentTo(email);
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="font-display text-4xl">Join Lampstand</h1>
      <p className="mt-2 text-parchment/70">
        Know the text. A free account starts you at 100 coins so packs, 50/50, and certificates can stick.
      </p>

      {!accountsAvailable ? <AccountsUnavailable /> : null}

      {sentTo ? (
        <CheckEmail
          email={sentTo}
          onResend={() => void sendSignInLink(sentTo, next).then(setError)}
          onBack={() => setSentTo(null)}
        />
      ) : (
        <>
          <GoogleButton onClick={() => void signInWithGoogle(next).then(setError)} />
          <form onSubmit={onSubmit} className="mt-8 grid gap-4">
            <label className="grid gap-1 text-sm">
              Email
              <input name="email" type="email" required autoComplete="email" className="field" />
            </label>
            <label className="grid gap-1 text-sm">
              Username
              <input
                name="username"
                required
                minLength={3}
                maxLength={24}
                autoComplete="username"
                className="field"
              />
            </label>
            {withPassword ? (
              <label className="grid gap-1 text-sm">
                Password
                <input
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="field"
                />
              </label>
            ) : null}
            <label className="flex items-center gap-2 text-sm">
              <input name="newsletter" type="checkbox" className="h-5 w-5" />
              Send me new quiz series
            </label>
            {error ? <p className="text-sm text-red-300">{error}</p> : null}
            <button type="submit" className="btn btn-primary" disabled={busy || !accountsAvailable}>
              {busy ? "One moment…" : "Create my account"}
            </button>
            <button
              type="button"
              onClick={() => setWithPassword((v) => !v)}
              className="text-sm text-parchment/70 underline underline-offset-4"
            >
              {withPassword ? "Skip the password, email me a link" : "I'd rather set a password"}
            </button>
          </form>
        </>
      )}

      <p className="mt-6 text-sm">
        Already here?{" "}
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="text-gold-400">
          Sign in
        </Link>
      </p>
    </div>
  );
}
