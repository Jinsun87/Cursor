import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How Lampstand (lampstandbible.com) collects, uses and protects your information.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-8 py-8 text-[var(--ink)] leading-relaxed">
      <header className="border-b border-[var(--line)] pb-6">
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Last updated: October 5, 2026 · Effective Date: September 29, 2026
        </p>
      </header>

      <section className="space-y-4">
        <p className="text-base sm:text-lg text-[var(--muted)]">
          Lampstand on lampstandbible.com offers guided Scripture walks, whole Bible chapters read aloud for sleep, breathing exercises and Bible quizzes. It is not a church and does not provide pastoral care. We collect as little as we can and explain all of it here.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl font-bold">1. Information We Collect</h2>
        <p>We collect only what we need to run Lampstand:</p>
        <ul className="list-disc pl-6 space-y-1.5 text-sm text-[var(--muted)]">
          <li>
            <strong className="text-[var(--ink)]">Your account:</strong> if you create one, your email address, chosen username and newsletter preference, and (only if you set one) a password, which is stored securely hashed. Accounts are stored with our database provider Supabase (servers in Mumbai, India).
          </li>
          <li>
            <strong className="text-[var(--ink)]">Your subscription:</strong> if you subscribe, Paddle tells us your subscription status, plan and renewal date so we can switch Premium on. We never receive your card details.
          </li>
          <li>
            <strong className="text-[var(--ink)]">On your device only:</strong> your listening streak and minutes, quiz progress, coins and display settings are kept in your browser (localStorage) and are not sent to us.
          </li>
          <li>
            <strong className="text-[var(--ink)]">Technical data:</strong> device and browser type, IP address and basic logs from our hosting provider (Vercel), used to keep the site running and secure.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl font-bold">2. Payment Processing via Paddle (Merchant of Record)</h2>
        <p className="text-sm text-[var(--muted)]">
          Our order and subscription process is conducted by our online Merchant of Record,{" "}
          <strong className="text-[var(--ink)]">Paddle</strong> (Paddle.com Market Ltd or Paddle Payments Ltd).
        </p>
        <p className="text-sm text-[var(--muted)]">
          When you purchase a Lampstand Pro subscription or make a gift, Paddle directly captures and tokenizes your payment card or PayPal details. <strong className="text-[var(--ink)]">Lampstand never sees, stores, or transmits credit card numbers or banking credentials.</strong> Paddle processes transactions in compliance with PCI-DSS Level 1 standards, manages sales tax/VAT compliance, and handles customer service receipts. You can inspect Paddle&apos;s privacy commitments at{" "}
          <a
            href="https://www.paddle.com/legal/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--gold)] underline underline-offset-4"
          >
            paddle.com/legal/privacy
          </a>.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl font-bold">3. Advertising &amp; Analytics</h2>
        <p className="text-sm text-[var(--muted)]">
          Some pages show ads from Google AdSense to readers without Premium. Google may use cookies to show and measure ads, including personalised ads where you have allowed them; you can manage this at{" "}
          <a
            href="https://adssettings.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--gold)] underline underline-offset-4"
          >
            adssettings.google.com
          </a>
          . The Walk, Sleep and Breathe sessions never show ads, and Premium members see no ads anywhere.
        </p>
        <p className="text-sm text-[var(--muted)]">
          We use Vercel Analytics and Google Analytics 4 to count visits and keep the site working well. Google Analytics uses cookies. We do not sell your personal data.
        </p>
        <p className="text-sm text-[var(--muted)]">
          <strong className="text-[var(--ink)]">Cookies we set ourselves</strong> are only the ones needed to keep you signed in.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl font-bold">4. Data Retention &amp; Your Rights (GDPR &amp; CCPA)</h2>
        <p className="text-sm text-[var(--muted)]">
          Under applicable data protection laws (including the EU GDPR and California CCPA), you have the right to:
        </p>
        <ul className="list-disc pl-6 space-y-1 text-sm text-[var(--muted)]">
          <li>Access the personal data we hold about you.</li>
          <li>Request correction or deletion of your account and study records.</li>
          <li>Opt out of marketing communications or newsletter updates at any time.</li>
        </ul>
        <p className="text-sm text-[var(--muted)]">
          Data kept on your device (your streak, quiz progress and settings) is removed when you clear your browser's site data. To see or delete your account and subscription records, email{" "}
          <a href="mailto:support@lampstandbible.com" className="text-[var(--gold)] underline underline-offset-4">
            support@lampstandbible.com
          </a>.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl font-bold">5. Children&apos;s Online Privacy (COPPA)</h2>
        <p className="text-sm text-[var(--muted)]">
          The site is meant for adults and general audiences. Do not use it to collect personal information from children under 13. If you believe a child under 13 has submitted personal information to us, please notify us immediately so we can remove it.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl font-bold">6. Contact Us</h2>
        <p className="text-sm text-[var(--muted)]">
          If you have questions about this Privacy Policy or our data practices, please reach out to:
        </p>
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--canvas-2)] p-4 text-sm">
          <p className="font-semibold text-[var(--ink)]">Lampstand Bible Study</p>
          <p className="text-[var(--muted)]">Email: <a href="mailto:support@lampstandbible.com" className="text-[var(--gold)] underline underline-offset-4">support@lampstandbible.com</a></p>
          <p className="text-[var(--muted)]">Website: <Link href="/" className="text-[var(--gold)] underline underline-offset-4">lampstandbible.com</Link></p>
        </div>
      </section>
    </article>
  );
}
