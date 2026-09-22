"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { type Environments, initializePaddle, type Paddle } from "@paddle/paddle-js";
import { PricingTier, type Tier } from "@/constants/pricing-tier";
import { usePaddlePrices } from "@/hooks/usePaddlePrices";
import { useApp } from "@/lib/store";
import { getPaddleEnvironment, getPaddleClientToken } from "@/lib/paddle/client";

interface Props {
  detectedCountry?: string;
}

export function PricingPageClient({ detectedCountry }: Props) {
  const { user } = useApp();
  const [frequency, setFrequency] = useState<"month" | "year">("month");
  const [paddle, setPaddle] = useState<Paddle | null>(null);
  const [paddleInitError, setPaddleInitError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  // Initialize Paddle.js client-side
  useEffect(() => {
    try {
      const environment = getPaddleEnvironment();
      const token = getPaddleClientToken();

      initializePaddle({
        token,
        environment: environment as Environments,
      })
        .then((p) => {
          if (p) {
            setPaddle(p);
          }
        })
        .catch((err) => {
          console.error("Failed to initialize Paddle.js:", err);
          setPaddleInitError("Failed to initialize payment gateway. Please check your connection or client token.");
        });
    } catch (err: any) {
      console.error("Paddle configuration error:", err.message);
      setPaddleInitError(err.message);
    }
  }, []);

  // Fetch localized prices using Paddle.PricePreview
  const { prices, loading: pricesLoading, error: pricesError } = usePaddlePrices(paddle, detectedCountry);

  const handleSubscribe = async (tier: Tier) => {
    const priceId = tier.priceId[frequency];

    if (!priceId) {
      // Free or contact tier
      if (tier.name === "Starter") {
        window.location.href = user ? "/quizzes" : "/register";
        return;
      }
      return;
    }

    if (!paddle) {
      alert("Payment gateway is initializing. Please try again in a moment.");
      return;
    }

    setCheckoutLoading(tier.name);

    try {
      paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        customer: user?.email ? { email: user.email } : undefined,
        customData: {
          tierName: tier.name,
          frequency,
          userEmail: user?.email || "",
          userId: user?.username || "",
        },
        settings: {
          displayMode: "overlay",
          theme: "dark",
          variant: "one-page",
          successUrl: `${window.location.origin}/welcome`,
          allowLogout: !user?.email,
        },
      });
    } catch (err) {
      console.error("Failed to open checkout:", err);
      alert("Could not launch Paddle Checkout. Please try again.");
    } finally {
      setCheckoutLoading(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/30 bg-[var(--gold)]/10 px-4 py-1 text-xs font-medium text-[var(--gold)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)] animate-pulse" />
          Illuminated Scripture Study
        </div>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl md:text-6xl text-[var(--ink)] tracking-tight">
          Invest in Quiet, Deep Recall
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-[var(--muted)]">
          Support the Scripture knowledge mission, unlock distraction-free reading, and earn Certificates of Mastery
          with zero advertising.
        </p>

        {/* Billing Frequency Toggle */}
        <div className="mt-8 inline-flex items-center rounded-full border border-[var(--line)] bg-[var(--canvas-2)] p-1.5 shadow-inner">
          <button
            type="button"
            onClick={() => setFrequency("month")}
            className={`min-h-10 rounded-full px-5 py-1.5 text-sm font-medium transition-all ${
              frequency === "month"
                ? "bg-[var(--gold)] text-[var(--gold-ink)] shadow-sm font-semibold"
                : "text-[var(--muted)] hover:text-[var(--ink)]"
            }`}
          >
            Monthly billing
          </button>
          <button
            type="button"
            onClick={() => setFrequency("year")}
            className={`min-h-10 flex items-center gap-2 rounded-full px-5 py-1.5 text-sm font-medium transition-all ${
              frequency === "year"
                ? "bg-[var(--gold)] text-[var(--gold-ink)] shadow-sm font-semibold"
                : "text-[var(--muted)] hover:text-[var(--ink)]"
            }`}
          >
            <span>Annual billing</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                frequency === "year" ? "bg-black/20 text-[var(--gold-ink)]" : "bg-[var(--gold)]/20 text-[var(--gold)]"
              }`}
            >
              2 months free
            </span>
          </button>
        </div>

        {detectedCountry && detectedCountry !== "OTHERS" && (
          <p className="mt-3 text-xs text-[var(--muted)]">
            Showing country-localized prices for: <strong className="text-[var(--ink)]">{detectedCountry}</strong>
          </p>
        )}
      </div>

      {/* Error banner */}
      {paddleInitError && (
        <div className="mx-auto mt-8 max-w-2xl rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center text-sm text-red-300">
          <p className="font-semibold">Payment Gateway Notice</p>
          <p className="mt-1">{paddleInitError}</p>
        </div>
      )}

      {pricesError && (
        <div className="mx-auto mt-4 max-w-2xl rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-center text-xs text-amber-300">
          Note: Local currency preview unavailable. Prices will be accurately calculated at checkout.
        </div>
      )}

      {/* Pricing Tiers Grid */}
      <div className="mt-12 grid gap-8 lg:grid-cols-3 lg:items-stretch">
        {PricingTier.map((tier) => {
          const currentPriceId = tier.priceId[frequency];
          const hasPriceId = Boolean(currentPriceId && currentPriceId.trim().length > 0);
          const rawPrice = hasPriceId ? prices[currentPriceId] : null;
          const isFeatured = tier.featured || tier.name === "Pro";

          return (
            <div
              key={tier.name}
              className={`relative flex flex-col justify-between rounded-3xl p-8 transition-all ${
                isFeatured
                  ? "border-2 border-[var(--gold)] bg-[var(--canvas-2)] shadow-2xl lg:-translate-y-2 ring-1 ring-[var(--gold)]/50"
                  : "border border-[var(--line)] bg-[var(--canvas)] hover:border-[var(--line-strong)]"
              }`}
            >
              {isFeatured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[var(--gold)] px-4 py-1 text-xs font-bold uppercase tracking-wider text-[var(--gold-ink)] shadow-md">
                  Most Popular
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl font-bold text-[var(--ink)]">{tier.name}</h3>
                  {tier.name === "Pro" && (
                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                      7-day trial
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">{tier.description}</p>

                {/* Price Display */}
                <div className="mt-6 flex items-baseline gap-1.5 border-b border-[var(--line)] pb-6">
                  {hasPriceId ? (
                    pricesLoading && !rawPrice ? (
                      <span className="h-10 w-28 animate-pulse rounded-lg bg-[var(--canvas-2)]" />
                    ) : (
                      <>
                        <span className="font-display text-4xl md:text-5xl font-extrabold text-[var(--ink)] tracking-tight">
                          {rawPrice || (frequency === "month" ? "$4.99" : "$49.99")}
                        </span>
                        <span className="text-sm font-medium text-[var(--muted)]">
                          /{frequency === "month" ? "month" : "year"}
                        </span>
                      </>
                    )
                  ) : (
                    <>
                      <span className="font-display text-4xl md:text-5xl font-extrabold text-[var(--ink)]">
                        {tier.name === "Starter" ? "Free" : "Custom"}
                      </span>
                      <span className="text-sm font-medium text-[var(--muted)]">
                        {tier.name === "Starter" ? "forever" : "patron"}
                      </span>
                    </>
                  )}
                </div>

                {/* Features List */}
                <ul className="mt-6 space-y-3.5 text-sm text-[var(--ink)]/85">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg
                        className="h-5 w-5 shrink-0 text-[var(--gold)]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-4">
                <button
                  type="button"
                  onClick={() => handleSubscribe(tier)}
                  disabled={checkoutLoading === tier.name}
                  className={`min-h-12 w-full rounded-2xl py-3 px-4 text-center font-semibold transition-all ${
                    isFeatured
                      ? "btn btn-primary shadow-lg shadow-[var(--gold)]/20"
                      : hasPriceId
                      ? "border border-[var(--line-strong)] bg-[var(--canvas-2)] text-[var(--ink)] hover:border-[var(--gold)] hover:text-[var(--gold)]"
                      : "border border-[var(--line)] text-[var(--muted)] hover:text-[var(--ink)] hover:border-[var(--line-strong)]"
                  }`}
                >
                  {checkoutLoading === tier.name
                    ? "Opening Checkout…"
                    : hasPriceId
                    ? tier.name === "Pro"
                      ? "Start 7-Day Free Trial"
                      : "Subscribe"
                    : tier.name === "Starter"
                    ? user
                      ? "Current Plan"
                      : "Get Started Free"
                    : "Contact Ministry Team"}
                </button>

                {hasPriceId && (
                  <p className="mt-2 text-center text-xs text-[var(--muted)]">
                    Cancel anytime · Instant activation
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust & Guarantee Section */}
      <div className="mt-16 rounded-3xl border border-[var(--line)] bg-[var(--canvas-2)]/60 p-8 text-center backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h4 className="font-display text-lg font-semibold text-[var(--ink)]">
            Guaranteed Secure Billing via Paddle
          </h4>
          <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
            Paddle acts as our Merchant of Record. Your payment details are tokenized securely with industry-standard
            encryption. Local taxes, EU VAT, and automatic receipts are managed seamlessly without storing credit card
            data on our servers.
          </p>
          <div className="mt-2 text-xs text-[var(--muted)]">
            Prefer to donate once instead?{" "}
            <Link href="/donate" className="text-[var(--gold)] underline underline-offset-4">
              Make a gift
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
