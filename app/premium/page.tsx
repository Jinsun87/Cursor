"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import Link from "next/link";

export default function PremiumPage() {
  const { user, upgrade } = useApp();
  const router = useRouter();
  const [plan, setPlan] = useState<"monthly" | "annual">("annual");

  function checkout() {
    if (!user) {
      router.push("/register");
      return;
    }
    upgrade(plan);
    router.push("/profile");
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-4xl">QuizForge Premium</h1>
      <p className="mt-3 text-parchment/75">
        The best trivia trail on this recreation of the model: secret quizzes
        without ads, a coin grant, and a badge worth bragging about.
      </p>
      <table className="mt-8 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-pine-700 text-pine-400">
            <th className="py-2">Benefit</th>
            <th>Free</th>
            <th>Premium</th>
          </tr>
        </thead>
        <tbody className="text-parchment/80">
          {[
            ["Access to public packs", "Yes", "Yes"],
            ["Certificates of Mastery", "Yes", "Yes"],
            ["Ad-free secret quizzes", "No", "Yes"],
            ["5,000 extra coins", "No", "On upgrade"],
            ["Premium badge", "No", "Yes"],
            ["Early series notices", "No", "Yes"],
          ].map((row) => (
            <tr key={row[0]} className="border-b border-pine-800">
              {row.map((cell) => (
                <td key={cell} className="py-2">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={() => setPlan("monthly")}
          className={`rounded-2xl border p-6 text-left ${plan === "monthly" ? "border-gold-400" : "border-pine-700"}`}
        >
          <p className="text-sm text-pine-400">Monthly</p>
          <p className="font-display text-3xl">$9.99/mo</p>
          <p className="mt-1 text-sm text-parchment/60">Simulated checkout. Cancel anytime in this demo.</p>
        </button>
        <button
          type="button"
          onClick={() => setPlan("annual")}
          className={`rounded-2xl border p-6 text-left ${plan === "annual" ? "border-gold-400" : "border-pine-700"}`}
        >
          <p className="text-sm text-pine-400">Annual · two months free</p>
          <p className="font-display text-3xl">$8.33/mo</p>
          <p className="mt-1 text-sm text-parchment/60">$99.99 billed annually in the live model.</p>
        </button>
      </div>
      <button
        type="button"
        onClick={checkout}
        className="btn btn-primary mt-6"
      >
        {user ? "Activate simulated Premium" : "Create an account to upgrade"}
      </button>
      <p className="mt-4 text-xs text-parchment/50">
        No real charges. This sandbox recreates pricing psychology from the
        source product ($9.99 / $99.99).
      </p>
      <p className="mt-2 text-sm">
        Prefer to support the mission without a sub? <Link href="/donate" className="text-gold-400">Donate</Link>
      </p>
    </div>
  );
}
