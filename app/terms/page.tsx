import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service",
  description: "The terms for using Lampstand (lampstandbible.com) and Lampstand Premium.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-8 py-8 text-[var(--ink)] leading-relaxed">
      <header className="border-b border-[var(--line)] pb-6">
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Last updated: September 29, 2026 · Effective Date: September 29, 2026
        </p>
      </header>

      <section className="space-y-4">
        <p className="text-base sm:text-lg text-[var(--muted)]">
          Welcome to <strong className="text-[var(--ink)]">Lampstand</strong> (lampstandbible.com). By visiting our website, creating an account, or purchasing a subscription, you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;). If you do not agree, please do not use the service.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl font-bold">1. Description of Service</h2>
        <p className="text-sm text-[var(--muted)]">
          Lampstand is an independent digital study desk featuring Scripture quizzes, active recall practice, illuminated Bible reading, and daily audio reflections. 
        </p>
        <p className="text-sm text-[var(--muted)]">
          <strong className="text-[var(--ink)]">Independence Disclaimer:</strong> Lampstand is not a church, theological seminary, or formal religious authority, and does not provide pastoral counseling or spiritual care. The materials provided are for personal study, reflection, and educational enjoyment.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl font-bold">2. Subscriptions, Trials &amp; Merchant of Record</h2>
        <div className="space-y-2 text-sm text-[var(--muted)]">
          <p>
            We offer both free access and premium paid subscriptions:
          </p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>
              <strong className="text-[var(--ink)]">Starter Plan (Free):</strong> Includes access to daily quizzes, standard reading mode, and community leaderboards at no charge.
            </li>
            <li>
              <strong className="text-[var(--ink)]">Lampstand Pro:</strong> Provides full access to ad-free Quiet room quizzes, Daily Audio Companions, Certificates of Mastery, and bonus coins. Available as a monthly plan ($4.99/mo) or annual plan ($39.99/yr).
            </li>
            <li>
              <strong className="text-[var(--ink)]">7-Day Free Trial:</strong> The monthly Pro plan includes a 7-day free trial. You will not be charged during the trial. If you do not cancel before the trial period ends, your subscription will automatically renew at the standard monthly rate until canceled.
            </li>
          </ul>
          <p className="mt-3">
            <strong className="text-[var(--ink)]">Merchant of Record (Paddle):</strong> Our order process is conducted by our online reseller and Merchant of Record, <strong className="text-[var(--ink)]">Paddle.com</strong> (Paddle.com Market Ltd or Paddle Payments Ltd). Paddle securely processes transactions, collects applicable sales tax/VAT, manages customer invoices, and issues receipts.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl font-bold">3. Cancellation &amp; Refund Policy</h2>
        <p className="text-sm text-[var(--muted)]">
          You may cancel your subscription at any time. When you cancel, you will continue to enjoy Lampstand Pro benefits through the conclusion of your current prepaid billing cycle, with no future renewal charges.
        </p>
        <p className="text-sm text-[var(--muted)]">
          We honor a <strong className="text-[var(--ink)]">14-day money-back guarantee</strong> for any initial subscription payment. For complete details on how to cancel or request a refund, please view our dedicated{" "}
          <Link href="/refunds" className="text-[var(--gold)] underline underline-offset-4">
            Refund Policy
          </Link>.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl font-bold">4. User Accounts &amp; Data</h2>
        <p className="text-sm text-[var(--muted)]">
          You are responsible for maintaining the confidentiality of your account credentials. You agree not to share accounts or impersonate other individuals on public leaderboards.
        </p>
        <p className="text-sm text-[var(--muted)]">
          Currently, user session data and quiz history are saved locally in your browser storage. You acknowledge that clearing local browser cache or private browsing sessions may reset local progress unless synchronized with our future cloud database.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl font-bold">5. Intellectual Property Rights</h2>
        <p className="text-sm text-[var(--muted)]">
          All original quiz content, commentary, user interface graphics, audio companion recordings, software code, and logos are the proprietary property of Lampstand. You may not scrape, reproduce, sell, or redistribute our proprietary content or audio without prior written permission.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl font-bold">6. Acceptable Use</h2>
        <p className="text-sm text-[var(--muted)]">You agree not to:</p>
        <ul className="list-disc pl-6 space-y-1 text-sm text-[var(--muted)]">
          <li>Use automated scrapers, bots, or crawlers that place excessive load on our infrastructure.</li>
          <li>Attempt to reverse-engineer, decompile, or breach security features of the platform.</li>
          <li>Manipulate quiz scores, coins, or leaderboards using automated scripts or hacks.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl font-bold">7. Disclaimer of Warranties &amp; Limitation of Liability</h2>
        <p className="text-sm text-[var(--muted)]">
          Lampstand is provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis without warranties of any kind, whether express or implied. To the fullest extent permitted by law, Lampstand and its creators shall not be liable for any indirect, incidental, or consequential damages resulting from your use of or inability to use the service.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl font-bold">8. Changes to Terms</h2>
        <p className="text-sm text-[var(--muted)]">
          We reserve the right to modify these Terms at any time. When we make material updates, we will update the &ldquo;Last updated&rdquo; date at the top of this document. Continued use of Lampstand after changes constitutes acceptance of the new Terms.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl font-bold">9. Contact Information</h2>
        <p className="text-sm text-[var(--muted)]">
          For any inquiries regarding these Terms of Service, please contact:
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
