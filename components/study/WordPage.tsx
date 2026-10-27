import Image from "next/image";
import Link from "next/link";
import type { BibleWord } from "@/content/bible-words/types";
import { CANONICAL_ORIGIN } from "@/lib/site";
import "@/components/plan/plan.css";
import "./study.css";

/**
 * The frame of a Bible-words page: the word and how to say it, a painting from the app, the
 * hand-written sections, questions with FAQ markup, the trial box, and links to the other words.
 */
export function WordPage({ word: w, others }: { word: BibleWord; others: Pick<BibleWord, "slug" | "word">[] }) {
  const path = `/bible-words/${w.slug}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: w.title,
      description: w.description,
      image: `${CANONICAL_ORIGIN}${w.hero.src}`,
      mainEntityOfPage: `${CANONICAL_ORIGIN}${path}`,
      publisher: { "@type": "Organization", name: "Lampstand" },
    },
    {
      "@context": "https://schema.org",
      "@type": "DefinedTerm",
      name: w.word,
      description: w.definition,
      inDefinedTermSet: `${CANONICAL_ORIGIN}/bible-words`,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: w.faq.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    },
  ];

  return (
    <article className="plan ls">
      <p className="ls-kicker">
        <Link href="/bible-words">Bible words</Link>
      </p>
      <h1>{w.word}</h1>
      <p className="ls-say">
        {w.say?.map((s, i) => (
          <span key={s}>
            {i > 0 && <> or </>}
            <b>{s}</b>
          </span>
        ))}
        {w.original.map((o, i) => (
          <span key={o.script}>
            {(i > 0 || w.say) && " · "}
            {o.language} <b lang={o.language === "Hebrew" ? "he" : "grc"}>{o.script}</b>
            {o.transliteration && <i> {o.transliteration}</i>}
          </span>
        ))}
      </p>
      <p className="plan-lead">{w.lead}</p>

      <figure className="ls-hero">
        <Image src={w.hero.src} alt={w.hero.alt} width={768} height={1376} priority />
        <figcaption>{w.hero.caption}</figcaption>
      </figure>

      <nav className="ls-toc" aria-label="On this page">
        {w.sections.map((s) => (
          <a key={s.id} href={`#${s.id}`}>
            {s.nav}
          </a>
        ))}
        <a href="#questions">Questions</a>
      </nav>

      {w.sections.map((s) => (
        <section key={s.id} className="plan-section" aria-labelledby={s.id}>
          <h2 id={s.id}>{s.heading}</h2>
          {s.body}
        </section>
      ))}

      <section className="plan-section" aria-labelledby="questions">
        <h2 id="questions">Questions</h2>
        <dl className="plan-faq">
          {w.faq.map(({ q, a }) => (
            <div key={q}>
              <dt>{q}</dt>
              <dd>{a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <aside className="ls-cta" aria-labelledby="cta">
        <h2 id="cta">{w.cta.heading}</h2>
        <p>{w.cta.body}</p>
        <div className="ls-cta-actions">
          <Link href="/pricing" className="ls-cta-primary">
            Start your 7-day free trial
          </Link>
          <Link href="/?tab=sleep" className="ls-cta-secondary">
            Or listen to Genesis free
          </Link>
        </div>
        <p className="ls-cta-note">7 days free on either plan. Cancel any time.</p>
      </aside>

      <nav className="ls-more" aria-labelledby="more">
        <h2 id="more">More Bible words</h2>
        <div className="ls-toc">
          {others.map((o) => (
            <Link key={o.slug} href={`/bible-words/${o.slug}`}>
              {o.word}
            </Link>
          ))}
        </div>
      </nav>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </article>
  );
}
