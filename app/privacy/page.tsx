import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Lampstand",
  description: "Privacy Policy and data practices for Lampstand (lampstandbible.com).",
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-8 py-8 text-[var(--ink)] leading-relaxed">
      <header className="border-b border-[var(--line)] pb-6">
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Last updated: September 29, 2026 · Effective Date: September 29, 2026
        </p>
      </header>

      <section className="space-y-4">
        <p className="text-base sm:text-lg text-[var(--muted)]">
          Lampstand on lampstandbible.com is a Scripture quiz desk and illuminated Bible study platform. It is not a church and does not provide pastoral care. We respect your personal privacy and are committed to clear, transparent data practices.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl font-bold">1. Information We Collect</h2>
        <p>We collect only the minimum information necessary to deliver and improve our services:</p>
        <ul className="list-disc pl-6 space-y-1.5 text-sm text-[var(--muted)]">
          <li>
            <strong className="text-[var(--ink)]">Account &amp; Profile Information:</strong> When you register an account, we collect your chosen username, email address, and an encrypted password.
          </li>
          <li>
            <strong className="text-[var(--ink)]">Study Progress &amp; Quiz Activity:</strong> Your quiz scores, series progress, earned coins, and certificates are saved to your account session (currently stored locally in your browser via <code>localStorage</code>).
          </li>
          <li>
            <strong className="text-[var(--ink)]">Technical &amp; Log Data:</strong> Device type, browser user agent, IP address (used for server-side country localization), and basic telemetry.
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
          Free sittings may show ads. Prefer Google AdSense on this quiz host (same publisher id as the approved apex, <code>NEXT_PUBLIC_ADSENSE_CLIENT</code>). Do not load AdSense and Ezoic on the same page. Premium hides the in-page slots. The Ezoic dashboard site is the registrable domain mediareferee.com (subdomains are not separate Ezoic sites). This quiz host still serves{" "}
          <a href="/ads.txt" className="text-[var(--gold)] underline underline-offset-4">
            ads.txt
          </a>{" "}
          (301 to the same Ads.txt Manager file as mediareferee.com). If you still use Ezoic instead, set <code>NEXT_PUBLIC_EZOIC_ADS=true</code> and leave the AdSense client unset.
        </p>
        <p className="text-sm text-[var(--muted)]">
          We use lightweight, privacy-focused analytics (Vercel Analytics and Google Analytics 4) to monitor page views and ensure high platform performance. These services use anonymized identifiers and do not sell personal data.
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
          Because current quiz progress is saved in your browser&apos;s <code>localStorage</code>, clearing your browser cache immediately deletes your client-side data. For account or server data deletion requests, contact us at{" "}
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
