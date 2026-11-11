import Link from "next/link";
import { SHELF, STORY_SERIES } from "@/lib/sleep/books";
import { SLEEP_CHAPTERS } from "@/lib/sleep/chapters";
import { STORY_CHAPTERS } from "@/lib/stories/chapters";
import { FREE_PSALMS } from "@/lib/sleep/access";
import { COST_PER_CHAPTER, FOUNDING_CAP, FOUNDING_PRICE, NET_FROM_FOUNDING } from "@/lib/founding";
import { CHECKED_ON, COMPETITORS, ROWS, type Cell } from "@/lib/landing/compare";
import { CalmShowcase, FoundingLeft, HeroPlayer, LandingSync, StartFree } from "./LandingClient";
import "./landing.css";


const FAQ: { q: string; a: string }[] = [
  {
    q: "What is free?",
    a: `Every chapter of Genesis and ten well-loved Psalms (${FREE_PSALMS.join(", ")}), in both voices, plus Calm me, the reading plans with the full text of every chapter, and the Bible quizzes. No card, and no account needed to start listening.`,
  },
  {
    q: "Which translation do you use?",
    a: "The Berean Standard Bible, read word for word, with no commentary added. It is a modern, faithful translation that reads clearly aloud.",
  },
  {
    q: "What are Walk and Sleep?",
    a: "The same chapters, read two ways. Walk is a clear, steady reading for the morning, a walk or a commute. Sleep is the same chapter read softly, with gentle rain and a sleep timer. Your place is shared, so you can start on a walk and finish in bed.",
  },
  {
    q: "What is Calm me?",
    a: "For the moments you need calm now. Choose how you feel (anxious, overwhelmed, sad, angry, afraid or unable to sleep) and Lampstand gives you one short practice: a prayer you can say as it is, five minutes of box breathing, a soft ambient tone, or a line from Scripture to say aloud.",
  },
  {
    q: "How does the sleep timer work?",
    a: "Choose 15, 30 or 60 minutes, or the end of the chapter. When the time comes the voice and the rain fade out gently instead of stopping, so nothing wakes you.",
  },
  {
    q: "Is there an app?",
    a: "Lampstand runs in your browser and can be added to your home screen in about 30 seconds on iPhone or Android, where it opens full screen like an app. No app store, no download.",
  },
  {
    q: "What do I get with Premium?",
    a: "Every recorded book and story in both voices, with new chapters as they are released, and no ads anywhere on Lampstand. Monthly and yearly plans start with 7 days free, and you can cancel any time before the trial ends.",
  },
  {
    q: "What is a founding member?",
    a: `A one-time payment of $${FOUNDING_PRICE} for Premium for life, for the first ${FOUNDING_CAP} people only. Founding members pay for the rest of the Bible to be recorded and painted, so this offer is how Lampstand gets finished.`,
  },
  {
    q: "Can I cancel or get a refund?",
    a: "Yes. Cancel from your profile at any time and keep Premium until the end of the period you paid for. If something is wrong, write to us; the refund policy is on the Refunds page.",
  },
  {
    q: "Who is behind Lampstand?",
    a: "An independent, Scripture-first project, not affiliated with any denomination or church. It is paid for by members, not advertisers.",
  },
];

function CellView({ value }: { value: Cell }) {
  if (value === true) return <span className="lp-yes" aria-label="Yes">✓</span>;
  if (value === false) return <span className="lp-no" aria-label="No">✕</span>;
  if (value === null) return <span className="lp-unknown" aria-label="Not confirmed">—</span>;
  return <span>{value}</span>;
}

export function Landing() {
  const recorded = SLEEP_CHAPTERS.length;
  const books = SHELF.filter((b) => !b.comingSoon);
  const stories = STORY_CHAPTERS.length;
  const chaptersPerFounder = Math.floor(NET_FROM_FOUNDING / COST_PER_CHAPTER);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };

  return (
    <div className="landing">
      <LandingSync />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="lp-hero">
        <div className="lp-hero-text">
          <p className="lp-kicker">The Bible, read aloud</p>
          <h1>
            For your morning, your night, and the moments you <em>need calm.</em>
          </h1>
          <p className="lp-lead">
            Every chapter read word for word, with a painting for every passage. A clear voice by day, a soft one at night, and Calm me
            for when your heart is racing.
          </p>
          <div className="lp-actions">
            <StartFree where="hero" />
            <a href="#pricing" className="lp-btn lp-btn-ghost">
              See plans
            </a>
          </div>
          <p className="lp-fine">Genesis and 10 Psalms free · no card · no app store</p>
        </div>
        <HeroPlayer />
      </section>

      {/* The problem */}
      <section className="lp-band lp-problem">
        <p>You pick up your phone to wind down, and it winds you up.</p>
        <p>You mean to read the Bible every day, and the days slip by.</p>
        <p>Your mind is racing, and you don&apos;t know where to start.</p>
        <p className="lp-problem-turn">Lampstand was made for all three.</p>
      </section>

      {/* Three modes */}
      <section className="lp-section" id="features">
        <p className="lp-kicker">Three ways in, one Bible</p>
        <h2>Walk by day. Sleep at night. Calm me, any time.</h2>
        <div className="lp-modes">
          <article className="lp-mode">
            <Phone src="/images/landing/walk-player.webp" alt="The Walk player reading Genesis 1" />
            <h3>
              <span aria-hidden="true">☀</span> Walk
            </h3>
            <p>The chapter read clearly and steadily, for your morning, a walk or a commute. Text on screen, verse by verse.</p>
          </article>
          <article className="lp-mode">
            <Phone src="/images/landing/sleep-player.webp" alt="The Sleep player reading Psalm 23 over a painting" />
            <h3>
              <span aria-hidden="true">☾</span> Sleep
            </h3>
            <p>The same chapter read softly, with gentle rain and a sleep timer that fades out as you drift off.</p>
          </article>
          <article className="lp-mode">
            <Phone src="/images/landing/calm.webp" alt="Calm me: choose how you feel, then a prayer, breathing, a tone or a line to say" />
            <h3>
              <span aria-hidden="true">◉</span> Calm me
            </h3>
            <p>Pick how you feel. Get one short practice: a prayer, five minutes of box breathing, a soft tone, or a line to say aloud.</p>
          </article>
        </div>
      </section>

      {/* Features explained */}
      <section className="lp-section">
        <p className="lp-kicker">Made for listening</p>
        <h2>Everything a night with Scripture needs, and nothing it doesn&apos;t.</h2>
        <div className="lp-features">
          <Feature title="A painting for every passage" text="Each part of the chapter has its own classical painting, so the story unfolds as you listen. No stock photos, no ads." />
          <Feature title="Text that follows the voice" text="The verse being read is highlighted as it is spoken. Read along, or close your eyes and just listen." />
          <Feature title="One bookmark, two voices" text="Stop halfway through a chapter on your walk and finish it in bed. Walk and Sleep share your place." />
          <Feature title="A sleep timer that fades" text="15, 30 or 60 minutes, or the end of the chapter. The voice and the rain fade out gently instead of stopping." />
          <Feature title="Free reading plans" text="The Bible in a year, the New Testament in 90 days, the Gospels in 30 days or the Psalms in a month, with the full text free." />
          <Feature title="Bible stories in two voices" text="Women of the Bible and Bedtime Bible Stories: gentle retellings for the end of the day." />
          <Feature title="Word for word, nothing added" text="The Berean Standard Bible, read as it is written. No commentary, no music over the Word." />
          <Feature title="On your home screen" text="Add Lampstand to your home screen in about 30 seconds. It opens full screen, like an app, with no app store." />
        </div>
        <div className="lp-shots">
          <Phone src="/images/landing/sleep-options.webp" alt="Sleep timer, speed, voice and rain settings" />
          <Phone src="/images/landing/plan.webp" alt="Today's reading in a Bible-in-a-year plan" />
        </div>
      </section>

      {/* Calm me */}
      <section className="lp-section lp-calm-section">
        <p className="lp-kicker">New · Calm me</p>
        <h2>How are you right now?</h2>
        <p className="lp-sub">Tap a feeling. This is the prayer Calm me would give you.</p>
        <CalmShowcase />
      </section>

      {/* Comparison */}
      <section className="lp-section" id="compare">
        <p className="lp-kicker">Why Lampstand</p>
        <h2>How Lampstand compares</h2>
        <p className="lp-sub">Half the price of the sleep apps, and the only one that reads by day, by night and calms you in between.</p>
        <div className="lp-table-wrap" tabIndex={0} role="region" aria-label="Comparison with other apps">
          <table className="lp-table">
            <thead>
              <tr>
                <th scope="col">
                  <span className="sr-only">Feature</span>
                </th>
                {COMPETITORS.map((c) => (
                  <th key={c.id} scope="col" className={c.id === "lampstand" ? "is-us" : ""}>
                    {c.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.label}>
                  <th scope="row">
                    {r.label}
                    {r.hint ? <small>{r.hint}</small> : null}
                  </th>
                  {COMPETITORS.map((c) => (
                    <td key={c.id} className={c.id === "lampstand" ? "is-us" : ""}>
                      <CellView value={r.cells[c.id] ?? null} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="lp-fine">
          US prices and features from each product&apos;s own site or app store listing, checked {CHECKED_ON}. — means we could not confirm
          it. Prices and features change; tell us if something here is out of date.
        </p>
      </section>

      {/* Library */}
      <section className="lp-band lp-library">
        <div>
          <strong>{recorded.toLocaleString("en-US")}</strong>
          <span>chapters recorded in both voices</span>
        </div>
        <div>
          <strong>{books.length}</strong>
          <span>books so far: {books.map((b) => b.name).join(", ")}</span>
        </div>
        <div>
          <strong>{stories}</strong>
          <span>Bible stories in {STORY_SERIES.length} series</span>
        </div>
        <div>
          <strong>Every month</strong>
          <span>new chapters, until the whole Bible is read</span>
        </div>
      </section>

      {/* Pricing */}
      <section className="lp-section" id="pricing">
        <p className="lp-kicker">Plans</p>
        <h2>Start free. Upgrade when Lampstand becomes part of your day.</h2>
        <div className="lp-free">
          <strong>Free, always</strong>
          <span>
            Genesis and 10 Psalms in both voices · Calm me · reading plans with every chapter&apos;s text · Bible quizzes. No card.
          </span>
          <StartFree label="Start free" where="pricing-free" className="lp-btn lp-btn-ghost" />
        </div>
        <div className="lp-plans">
          <article className="lp-plan">
            <h3>Monthly</h3>
            <p className="lp-price">
              $4.99<span>/month</span>
            </p>
            <p className="lp-plan-note">Try it for a week, then month by month.</p>
            <ul>
              <li>7 days free, then $4.99 a month</li>
              <li>Every book and story in both voices</li>
              <li>New chapters as they are released</li>
              <li>No ads anywhere on Lampstand</li>
              <li>Cancel any time, from your profile</li>
            </ul>
            <Link href="/pricing?plan=month" className="lp-btn lp-btn-ghost">
              Start 7 days free
            </Link>
          </article>
          <article className="lp-plan is-best">
            <p className="lp-badge">Best value · save 33%</p>
            <h3>Yearly</h3>
            <p className="lp-price">
              $39.99<span>/year</span>
            </p>
            <p className="lp-plan-note">About $3.33 a month, billed once a year.</p>
            <ul>
              <li>7 days free, then $39.99 a year</li>
              <li>Everything in Monthly</li>
              <li>Four months free compared with paying monthly</li>
              <li>One payment a year, nothing to keep track of</li>
              <li>Cancel any time, from your profile</li>
            </ul>
            <Link href="/pricing?plan=year" className="lp-btn lp-btn-gold">
              Start 7 days free
            </Link>
          </article>
          <article className="lp-plan is-founding">
            <p className="lp-badge lp-badge-ghost">
              <FoundingLeft />
            </p>
            <h3>Founding member</h3>
            <p className="lp-price">
              ${FOUNDING_PRICE}
              <span>once, for life</span>
            </p>
            <p className="lp-plan-note">One payment. Premium forever, and the rest of the Bible gets made.</p>
            <ul>
              <li>Premium for life: every book, story and future chapter</li>
              <li>A founding member badge on your profile</li>
              <li>
                Each membership pays for about {chaptersPerFounder} more chapters to be recorded and painted (about $
                {COST_PER_CHAPTER.toFixed(2)} each)
              </li>
              <li>Only {FOUNDING_CAP} places, ever. When they are gone, the offer closes</li>
            </ul>
            <Link href="/pricing?plan=lifetime" className="lp-btn lp-btn-ghost">
              Become a founding member
            </Link>
          </article>
        </div>
        <p className="lp-fine">Prices in US dollars. Secure checkout by Paddle. Trials need a card and can be cancelled before you are charged.</p>
      </section>

      {/* FAQ */}
      <section className="lp-section lp-faq" id="faq">
        <p className="lp-kicker">Questions</p>
        <h2>Before your first night</h2>
        {FAQ.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </section>

      {/* Closing */}
      <section className="lp-close">
        <h2>Tonight, rest in the Word.</h2>
        <p>Genesis and 10 Psalms are free. No card, no download.</p>
        <StartFree where="closing" />
      </section>

      <div className="lp-sticky">
        <StartFree label="Start free" where="sticky" />
      </div>
    </div>
  );
}

function Phone({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="lp-phone">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" width={300} height={649} />
    </div>
  );
}

function Feature({ title, text }: { title: string; text: string }) {
  return (
    <div className="lp-feature">
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
