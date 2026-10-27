import type { Metadata } from "next";
import Link from "next/link";
import { BIBLE_WORDS } from "@/content/bible-words";
import { pageMetadata } from "@/lib/seo";
import { CANONICAL_ORIGIN } from "@/lib/site";
import "@/components/plan/plan.css";
import "@/components/study/study.css";

const PATH = "/bible-words";
const TITLE = "Bible Words: Meanings, Pronunciation and Verses";
const DESCRIPTION =
  "Bible words explained: what selah, hosanna, maskil, Melchizedek, the ephod and more really mean, how to say them, and where to hear them read in Scripture.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

/** The glossary's front page: every word, with how to say it and a one-line meaning. */
export default function BibleWordsIndex() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": `${CANONICAL_ORIGIN}${PATH}`,
    name: "Bible words",
    description: DESCRIPTION,
    hasDefinedTerm: BIBLE_WORDS.map((w) => ({
      "@type": "DefinedTerm",
      name: w.word,
      description: w.definition,
      url: `${CANONICAL_ORIGIN}${PATH}/${w.slug}`,
    })),
  };

  return (
    <article className="plan ls">
      <p className="ls-kicker">Lampstand</p>
      <h1>Bible words</h1>
      <p className="plan-lead">
        The Bible is full of words that stop readers in their tracks: Hebrew left untranslated, names that are hard to say, objects
        no one has seen for three thousand years. Here is what they mean, how to say them, and where to hear them read in their
        place.
      </p>

      <ul className="ls-words">
        {BIBLE_WORDS.map((w) => (
          <li key={w.slug}>
            <Link href={`${PATH}/${w.slug}`}>
              <span className="ls-words-name">{w.word}</span>
              {w.say && <span className="ls-words-say">{w.say.join(" or ")}</span>}
              <span className="ls-words-def">{w.definition}</span>
            </Link>
          </li>
        ))}
      </ul>

      <aside className="ls-cta" aria-labelledby="cta">
        <h2 id="cta">Hear the words where they belong</h2>
        <p>
          Lampstand reads the Bible aloud, chapter by chapter: in <strong>Walk</strong>, a clear voice for your day, and in{" "}
          <strong>Sleep</strong>, a slow, quiet reading for the night, with the words on screen and a painting for every scene.
        </p>
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

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </article>
  );
}
