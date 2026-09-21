"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import Link from "next/link";
import { isPaddleConfigured, openPaddleCheckout } from "@/lib/paddle/client";

export default function PremiumPage() {
  const { user, upgrade } = useApp();
  const router = useRouter();
  const [plan, setPlan] = useState<"monthly" | "annual">("annual");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const paddleActive = isPaddleConfigured();

  async function checkout() {
    if (!user) {
      router.push("/register");
      return;
    }

    setErrorMessage(null);

    const monthlyPriceId = process.env.NEXT_PUBLIC_PADDLE_MONTHLY_PRICE_ID;
    const annualPriceId = process.env.NEXT_PUBLIC_PADDLE_ANNUAL_PRICE_ID;
    const priceId = plan === "monthly" ? monthlyPriceId : annualPriceId;

    if (paddleActive && priceId) {
      setIsProcessing(true);
      const opened = await openPaddleCheckout({
        priceId,
        customerEmail: user.email,
        customData: {
          userEmail: user.email,
          username: user.username,
          plan,
        },
        onError: (err) => {
          console.error("Paddle checkout error:", err);
          setErrorMessage("Failed to open Paddle Checkout. Please try again.");
          setIsProcessing(false);
        },
      });

      if (!opened) {
        setIsProcessing(false);
        setErrorMessage("Could not initialize Paddle Checkout. Falling back to local upgrade.");
        // Fallback to local upgrade if checkout failed to launch
        upgrade(plan);
        router.push("/profile");
      }
      return;
    }

    // Local / simulated upgrade
    upgrade(plan);
    router.push("/profile");
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl">Lampstand Premium</h1>
        {paddleActive ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Paddle Billing Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-xs font-medium text-gold-400">
            Simulated Sandbox Mode
          </span>
        )}
      </div>

      <p className="mt-3 text-parchment/75">
        Quiet room without ads, a coin grant, and a badge. Enjoy an undisturbed experience while keeping your mind focused on the text.
      </p>

      {errorMessage ? (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          {errorMessage}
        </div>
      ) : null}

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
          className={`rounded-2xl border p-6 text-left transition-all ${
            plan === "monthly"
              ? "border-gold-400 bg-pine-900/40 shadow-lg"
              : "border-pine-700 hover:border-pine-500"
          }`}
        >
          <p className="text-sm text-pine-400">Monthly</p>
          <p className="font-display text-3xl">$9.99/mo</p>
          <p className="mt-1 text-sm text-parchment/60">Cancel anytime. Full access to all benefits.</p>
        </button>
        <button
          type="button"
          onClick={() => setPlan("annual")}
          className={`rounded-2xl border p-6 text-left transition-all ${
            plan === "annual"
              ? "border-gold-400 bg-pine-900/40 shadow-lg"
              : "border-pine-700 hover:border-pine-500"
          }`}
        >
          <p className="text-sm text-pine-400">Annual · two months free</p>
          <p className="font-display text-3xl">$8.33/mo</p>
          <p className="mt-1 text-sm text-parchment/60">$99.99 billed annually.</p>
        </button>
      </div>

      <button
        type="button"
        onClick={checkout}
        disabled={isProcessing}
        className="btn btn-primary mt-6 w-full md:w-auto"
      >
        {isProcessing
          ? "Opening Checkout…"
          : user
            ? paddleActive
              ? `Subscribe with Paddle (${plan === "annual" ? "$99.99/yr" : "$9.99/mo"})`
              : "Activate Premium (Demo Mode)"
            : "Create an account to upgrade"}
      </button>

      <div className="mt-6 flex items-center gap-2 text-xs text-parchment/50">
        <svg
          className="h-4 w-4 text-emerald-400 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
        <span>
          Payments secured by <strong>Paddle</strong> Merchant of Record. Tax compliance, fraud protection, and instant invoicing handled automatically.
        </span>
      </div>

      <p className="mt-4 text-sm">
        Prefer to support the mission without a subscription?{" "}
        <Link href="/donate" className="text-gold-400 underline underline-offset-4">
          Donate
        </Link>
      </p>
    </div>
  );
}
