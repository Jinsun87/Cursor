"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/lib/store";

export default function LoginPage() {
  const { login } = useApp();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const err = login(String(data.get("email")), String(data.get("password")));
    if (err) setError(err);
    else router.push("/profile");
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="font-display text-4xl">Hello again</h1>
      <p className="mt-2 text-parchment/70">Sign in to keep coins, packs, and certificates.</p>
      <form onSubmit={onSubmit} className="mt-8 grid gap-4">
        <label className="grid gap-1 text-sm">
          Email
          <input
            name="email"
            type="email"
            required
            className="rounded-xl border border-pine-600 bg-pine-900 px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          Password
          <input
            name="password"
            type="password"
            required
            className="rounded-xl border border-pine-600 bg-pine-900 px-3 py-2"
          />
        </label>
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        <button type="submit" className="rounded-full bg-gold-400 py-2 text-pine-950">
          Log in
        </button>
      </form>
      <p className="mt-4 text-sm text-parchment/70">
        Demo accounts exist on first visit: maple@quizforge.demo / demo
      </p>
      <p className="mt-2 text-sm">
        No account?{" "}
        <Link href="/register" className="text-gold-400">
          Create one
        </Link>
      </p>
    </div>
  );
}
