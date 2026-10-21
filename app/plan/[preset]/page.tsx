import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PrintButton } from "@/components/plan/PrintButton";
import { CANONICAL_ORIGIN } from "@/lib/site";
import { PLAN_PAGES, compactReadings, planPage, presetSchedule, scheduleStats } from "@/lib/plan/landing";
import { pageMetadata } from "@/lib/seo";
import "@/components/plan/plan.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return PLAN_PAGES.map((p) => ({ preset: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ preset: string }> }): Promise<Metadata> {
  const page = planPage((await params).preset);
  if (!page) return {};
  return pageMetadata({ title: page.metaTitle, description: page.description, path: `/plan/${page.slug}` });
}

/** One preset plan with its whole day-by-day schedule in the HTML: searchable, printable, and a start button. */
export default async function PlanSchedulePage({ params }: { params: Promise<{ preset: string }> }) {
  const page = planPage((await params).preset);
  if (!page) notFound();
  const days = presetSchedule(page);
  const stats = scheduleStats(days);
  const weeks = Array.from({ length: Math.ceil(days.length / 6) }, (_, w) => days.slice(w * 6, w * 6 + 6));
  const others = PLAN_PAGES.filter((p) => p.slug !== page.slug);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Bible reading plan", item: `${CANONICAL_ORIGIN}/plan` },
      { "@type": "ListItem", position: 2, name: page.heading, item: `${CANONICAL_ORIGIN}/plan/${page.slug}` },
    ],
  };

  return (
    <div className="plan plan-schedule-page">
      <nav className="plan-crumbs plan-noprint" aria-label="Breadcrumb">
        <Link href="/plan">Bible reading plan</Link> <span aria-hidden="true">›</span> {page.heading}
      </nav>
      <h1>{page.heading}</h1>
      <p className="plan-lead">{page.intro}</p>

      <ul className="plan-stats">
        <li>
          <strong>{stats.days}</strong> reading days
        </li>
        <li>
          <strong>{stats.chapters.toLocaleString("en-US")}</strong> chapters
        </li>
        <li>
          about <strong>{stats.minutesPerDay} min</strong> a day read aloud
        </li>
      </ul>

      <div className="plan-actions plan-noprint">
        <Link className="plan-go" href={`/plan?preset=${page.presetId}`}>
          Start this plan
        </Link>
        <PrintButton />
      </div>
      <p className="plan-lead plan-noprint">
        Days are numbered, six a week with Sundays off. Start it online to choose your own start date and rest days; Lampstand keeps
        your place, and Catch up moves the plan forward if you miss a day.
      </p>

      {weeks.map((week, w) => (
        <section key={w} className="plan-week" aria-labelledby={`week-${w + 1}`}>
          <h2 id={`week-${w + 1}`}>Week {w + 1}</h2>
          <ol className="plan-schedule">
            {week.map((day) => (
              <li key={day.index}>
                <span className="plan-schedule-day">Day {day.index + 1}</span>
                <span>{compactReadings(day.readings)}</span>
              </li>
            ))}
          </ol>
        </section>
      ))}

      <p className="plan-credit">Scripture from the Berean Standard Bible (BSB), public domain. Schedule from lampstandbible.com/plan.</p>

      <section className="plan-section plan-noprint" aria-labelledby="more-plans">
        <h2 id="more-plans">More reading plans</h2>
        <ul className="plan-cards">
          {others.map((p) => (
            <li key={p.slug}>
              <Link href={`/plan/${p.slug}`}>
                <strong>{p.heading}</strong>
                <span className="plan-card-more">See the schedule →</span>
              </Link>
            </li>
          ))}
          <li>
            <Link href="/plan">
              <strong>Make your own plan</strong>
              <span className="plan-card-more">Any length, any start date →</span>
            </Link>
          </li>
        </ul>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
