import type { Metadata } from "next";
import Link from "next/link";
import { PlanBuilder } from "@/components/plan/PlanBuilder";
import { PLAN_PAGES, planFaq, presetSchedule, scheduleStats } from "@/lib/plan/landing";
import { pageMetadata } from "@/lib/seo";
import "@/components/plan/plan.css";

export const metadata: Metadata = pageMetadata({
  title: "Free Bible Reading Plan: Bible in a Year & More",
  description:
    "Make a free Bible reading plan at your own pace: the Bible in a year, the New Testament in 90 days, the Gospels or the Psalms. Read each day free, and hear Genesis read aloud.",
  path: "/plan",
});

/**
 * The reading plan. The heading, the popular plans and the questions are in the page's HTML for
 * search engines and slow phones; the plan builder itself loads in the browser, where the saved
 * plan lives.
 */
export default function PlanPage() {
  const faq = planFaq();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };

  return (
    <div className="plan">
      <h1>Free Bible reading plan</h1>
      <p className="plan-lead">
        Choose how much of the Bible to read and how long to take, and Lampstand lays out each day for you, every chapter whole and in
        order. The text is always free. Genesis can also be heard free in Walk (by day) and Sleep (by night); the voices for other books
        come with Premium as they are recorded.
      </p>

      <PlanBuilder />

      <section className="plan-section" aria-labelledby="popular">
        <h2 id="popular">Popular reading plans</h2>
        <ul className="plan-cards">
          {PLAN_PAGES.map((page) => {
            const stats = scheduleStats(presetSchedule(page));
            return (
              <li key={page.slug}>
                <Link href={`/plan/${page.slug}`}>
                  <strong>{page.heading}</strong>
                  <span>
                    {stats.days} reading days · {stats.chapters.toLocaleString("en-US")} chapters · about {stats.minutesPerDay} min a day
                  </span>
                  <span className="plan-card-more">See the full schedule →</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="plan-section" aria-labelledby="questions">
        <h2 id="questions">Questions</h2>
        <dl className="plan-faq">
          {faq.map(({ q, a }) => (
            <div key={q}>
              <dt>{q}</dt>
              <dd>{a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
