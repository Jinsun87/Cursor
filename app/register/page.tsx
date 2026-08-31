"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/lib/store";

export default function RegisterPage() {
  const { register } = useApp();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const err = register({
      email: String(data.get("email")),
      username: String(data.get("username")),
      password: String(data.get("password")),
      newsletter: Boolean(data.get("newsletter")),
    });
    if (err) setError(err);
    else router.push("/profile");
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="font-display text-4xl">Join QuizForge</h1>
      <p className="mt-2 text-parchment/70">
        The source product cites hundreds of thousands of quiz-takers. This gym
        starts you at 100 coins.
      </p>
      <form onSubmit={onSubmit} className="mt-8 grid gap-4">
        <label className="grid gap-1 text-sm">
          Email
          <input name="email" type="email" required autoComplete="email" className="field" />
        </label>
        <label className="grid gap-1 text-sm">
          Username
          <input name="username" required minLength={3} autoComplete="username" className="field" />
        </label>
        <label className="grid gap-1 text-sm">
          Password
          <input name="password" type="password" required minLength={4} autoComplete="new-password" className="field" />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input name="newsletter" type="checkbox" className="h-5 w-5" />
          Send me new quiz series
        </label>
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        <button type="submit" className="btn btn-primary">
          Sign up
        </button>
      </form>
      <p className="mt-4 text-sm">
        Already here?{" "}
        <Link href="/login" className="text-gold-400">
          Log in
        </Link>
      </p>
    </div>
  );
}
