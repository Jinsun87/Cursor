import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata: Metadata = pageMetadata({
  title: "Refund & Cancellation Policy",
  description: "Lampstand's 14-day money-back guarantee and how to cancel Premium.",
  path: "/refunds",
});

export default function RefundPolicyPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-8 py-8 text-[var(--ink)] leading-relaxed">
      <header className="border-b border-[var(--line)] pb-6">
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
          Refund &amp; Cancellation Policy
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Last updated: September 29, 2026 · Effective Date: September 29, 2026
        </p>
      </header>

      <section className="space-y-4">
        <p className="text-base sm:text-lg text-[var(--muted)]">
          At <strong className="text-[var(--ink)]">Lampstand</strong> (lampstandbible.com), we want you to be fully satisfied with your Scripture study companion. We believe in clear, fair, and straightforward policies with zero hidden renewal traps.
        </p>
      </section>

      {/* 7-Day Free Trial Section */}
      <section className="space-y-3 rounded-2xl border border-emerald-500/30 bg-emerald-950/15 p-6">
        <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-xs">
          <span>✨</span>
          <span>7-Day Free Trial Protection</span>
        </div>
        <h2 className="font-display text-2xl font-bold text-[var(--ink)]">
          Zero-Risk Trial Period
        </h2>
        <p className="text-sm text-[var(--muted)]">
          Our Lampstand Pro monthly plan comes with a <strong className="text-[var(--ink)]">7-day free trial</strong>. You can explore all Quiet room quizzes, audio companions, and study features completely free of charge.
        </p>
        <p className="text-sm text-[var(--muted)]">
          If you decide Lampstand isn&apos;t right for you, simply cancel before the 7 days elapse and you will <strong className="text-[var(--ink)]">not be charged a single penny ($0.00)</strong>.
        </p>
      </section>

      {/* 14-Day Money-Back Guarantee */}
      <section className="space-y-3">
        <h2 className="font-display text-2xl font-bold">14-Day Money-Back Guarantee</h2>
        <p className="text-sm text-[var(--muted)]">
          In addition to the 7-day trial, we offer a <strong className="text-[var(--ink)]">14-day 100% money-back guarantee</strong> on all first-time subscription charges (both monthly and annual plans).
        </p>
        <p className="text-sm text-[var(--muted)]">
          If you were billed for an initial subscription and are dissatisfied for any reason within 14 days of the charge, email us at{" "}
          <a href="mailto:support@lampstandbible.com" className="text-[var(--gold)] underline underline-offset-4">
            support@lampstandbible.com
          </a>{" "}
          with your order email, and we will issue a full refund—no questions asked.
        </p>
      </section>

      {/* How to Cancel */}
      <section className="space-y-3">
        <h2 className="font-display text-2xl font-bold">How to Cancel Your Subscription</h2>
        <p className="text-sm text-[var(--muted)]">
          You can cancel your Lampstand Pro subscription at any moment using either method:
        </p>
        <ol className="list-decimal pl-6 space-y-2 text-sm text-[var(--muted)]">
          <li>
            <strong className="text-[var(--ink)]">Instant Self-Service via Email Receipt:</strong> Every billing email sent by Paddle contains a direct &ldquo;Manage Subscription&rdquo; link. Click it to view your subscription details, update your card, or cancel with a single click.
          </li>
          <li>
            <strong className="text-[var(--ink)]">Paddle Buyer Portal:</strong> Visit{" "}
            <a
              href="https://paddle.net"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--gold)] underline underline-offset-4"
            >
              paddle.net
            </a>{" "}
            or{" "}
            <a
              href="https://help.paddle.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--gold)] underline underline-offset-4"
            >
              help.paddle.com
            </a>{" "}
            to look up your receipt and cancel your recurring billing instantly.
          </li>
          <li>
            <strong className="text-[var(--ink)]">Email Support:</strong> Send a quick email to{" "}
            <a href="mailto:support@lampstandbible.com" className="text-[var(--gold)] underline underline-offset-4">
              support@lampstandbible.com
            </a>{" "}
            with the subject &ldquo;Cancel Subscription&rdquo; and your account email, and our team will handle it for you.
          </li>
        </ol>
      </section>

      {/* What Happens Upon Cancellation */}
      <section className="space-y-3">
        <h2 className="font-display text-2xl font-bold">What Happens When You Cancel</h2>
        <ul className="list-disc pl-6 space-y-1.5 text-sm text-[var(--muted)]">
          <li>
            <strong className="text-[var(--ink)]">Retain Access Through Your Billing Period:</strong> When you cancel a paid plan, your Pro benefits remain active until the end of the current paid billing cycle.
          </li>
          <li>
            <strong className="text-[var(--ink)]">No Further Charges:</strong> Your recurring billing agreement will be immediately terminated in Paddle. You will never receive an unexpected charge.
          </li>
          <li>
            <strong className="text-[var(--ink)]">Your Study Progress Is Kept:</strong> Your account will smoothly transition to the free Starter tier. All earned coins, quiz scores, and series progress remain intact.
          </li>
        </ul>
      </section>

      {/* Voluntary Gifts & Donations */}
      <section className="space-y-3">
        <h2 className="font-display text-2xl font-bold">Voluntary Platform Gifts</h2>
        <p className="text-sm text-[var(--muted)]">
          Voluntary one-time gifts made on our <Link href="/donate" className="text-[var(--gold)] underline underline-offset-4">Donate</Link> page directly support platform maintenance, content generation, and keeping Scripture open to everyone. If an accidental or unauthorized donation was made, please contact us within 7 days for a prompt refund.
        </p>
      </section>

      {/* Merchant of Record Details */}
      <section className="space-y-3">
        <h2 className="font-display text-2xl font-bold">Merchant of Record Information</h2>
        <p className="text-sm text-[var(--muted)]">
          All financial transactions and orders on Lampstand are handled by our trusted online reseller and Merchant of Record, <strong className="text-[var(--ink)]">Paddle.com</strong> (Paddle.com Market Ltd, Judd House, 18-29 Mora Street, London EC1V 8BT, UK).
        </p>
        <p className="text-sm text-[var(--muted)]">
          Paddle is responsible for charging, card security, and processing refunds back to your original payment method. Approved refunds typically appear on your banking statement within 3 to 5 business days.
        </p>
      </section>

      {/* Contact Box */}
      <section className="space-y-3">
        <h2 className="font-display text-2xl font-bold">Need Help With a Refund or Cancellation?</h2>
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--canvas-2)] p-5 text-sm space-y-2">
          <p className="font-semibold text-[var(--ink)]">Lampstand Support Team</p>
          <p className="text-[var(--muted)]">
            Email:{" "}
            <a href="mailto:support@lampstandbible.com" className="text-[var(--gold)] underline underline-offset-4">
              support@lampstandbible.com
            </a>
          </p>
          <p className="text-[var(--muted)]">
            Paddle Buyer Support:{" "}
            <a href="https://paddle.net" target="_blank" rel="noopener noreferrer" className="text-[var(--gold)] underline underline-offset-4">
              paddle.net
            </a>
          </p>
          <p className="text-[var(--muted)]">
            Response Time: Usually within 24 business hours.
          </p>
        </div>
      </section>
    </article>
  );
}
