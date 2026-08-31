"use client";

import { SECRET_QUIZZES } from "@/lib/catalog";
import { QuizCard } from "@/components/QuizCard";
import { AdSlot } from "@/components/AdSlot";
import { useApp } from "@/lib/store";
import Link from "next/link";

export default function SecretPage() {
  const { user } = useApp();
  return (
    <div>
      <h1 className="font-display text-4xl">Secret quizzes</h1>
      <p className="mt-3 max-w-2xl text-parchment/75">
        Off-homepage challenges. Free accounts see ads here. Premium members get
        the quiet version and a badge on their profile.
      </p>
      {!user?.premium ? (
        <p className="mt-3 text-sm">
          <Link href="/premium" className="text-gold-400">
            Upgrade
          </Link>{" "}
          for ad-free secret quizzes and 5,000 coins.
        </p>
      ) : (
        <p className="mt-3 text-sm text-gold-400">Premium trail is clear. Enjoy the silence.</p>
      )}
      <AdSlot label="Secret-trail ad" />
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {SECRET_QUIZZES.map((q) => (
          <QuizCard key={q.slug} quiz={q} />
        ))}
      </div>
    </div>
  );
}
