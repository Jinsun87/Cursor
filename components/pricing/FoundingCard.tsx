"use client";

import { useEffect, useRef, useState } from "react";
import type { Paddle } from "@paddle/paddle-js";
import type { User } from "@/lib/types";
import { FOUNDING_CAP, FOUNDING_PRICE, chaptersFundedPerMember, membersToFundBible } from "@/lib/founding";
import { useFoundingSpots } from "@/components/founding/useFoundingSpots";

/**
 * The founding membership: Pro for life for one payment, limited to the first
 * FOUNDING_CAP members, with the real number of spots left. Opens Paddle's
 * one-time checkout; the webhook records it against the account.
 */
export function FoundingCard({ paddle, user }: { paddle: Paddle | null; user: User | null }) {
  const priceId = process.env.NEXT_PUBLIC_PADDLE_LIFETIME_PRICE_ID?.trim();
  const spots = useFoundingSpots();
  const card = useRef<HTMLDivElement | null>(null);
  const [focused, setFocused] = useState(false);

  // /pricing?plan=lifetime (from onboarding) brings this card into view.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("plan") === "lifetime") {
      card.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      setFocused(true);
    }
  }, []);

  const soldOut = spots !== null && spots.left === 0;
  const isMember = user?.premiumPlan === "lifetime";

  const buy = () => {
    if (!priceId || soldOut) return;
    // Checkout must be tied to an account so the webhook can grant lifetime Premium.
    if (!user) {
      window.location.href = "/register?next=/pricing?plan=lifetime";
      return;
    }
    if (!paddle) {
      alert("Payment gateway is initializing. Please try again in a moment.");
      return;
    }
    paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customer: { email: user.email },
      customData: { plan: "lifetime", userId: user.id, userEmail: user.email },
      settings: {
        displayMode: "overlay",
        theme: "dark",
        variant: "one-page",
        successUrl: `${window.location.origin}/welcome`,
        allowLogout: false,
      },
    });
  };

  return (
    <div
      ref={card}
      id="founding"
      className={`mx-auto mt-10 max-w-4xl rounded-3xl border-2 p-8 transition-shadow ${
        focused ? "border-[var(--gold)] shadow-2xl ring-2 ring-[var(--gold)]/40" : "border-[var(--gold)]/60"
      } bg-[var(--canvas-2)]`}
    >
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--gold)]">
            Founding member · first {FOUNDING_CAP} only
          </p>
          <h3 className="mt-2 font-display text-3xl font-bold text-[var(--ink)]">Pro for life, one payment</h3>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
            Everything in Pro, forever: every book, every voice and every sound as it is added. Less than 2½ years of the yearly plan,
            then never pay again. One founding member funds about {chaptersFundedPerMember()} chapters; about{" "}
            {membersToFundBible()} founding members fund the whole Bible.
          </p>
          <p className="mt-3 text-sm font-semibold text-[var(--ink)]">
            {spots ? `${spots.left} of ${FOUNDING_CAP} founding spots left.` : `Limited to the first ${FOUNDING_CAP} members.`} The
            offer closes when they are gone.
          </p>
        </div>
        <div className="min-w-[220px] text-left sm:text-right">
          <p className="font-display text-5xl font-extrabold text-[var(--ink)]">${FOUNDING_PRICE}</p>
          <p className="text-sm text-[var(--muted)]">once, no renewals</p>
          <button
            type="button"
            onClick={buy}
            disabled={!priceId || soldOut || isMember}
            className="btn btn-primary mt-4 min-h-12 w-full rounded-2xl px-5 font-semibold disabled:opacity-60"
          >
            {isMember
              ? "You are a founding member"
              : soldOut
                ? "All founding spots are taken"
                : priceId
                  ? "Become a founding member"
                  : "Opening soon"}
          </button>
        </div>
      </div>
    </div>
  );
}
