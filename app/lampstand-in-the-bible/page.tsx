import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Listen, Verse } from "@/components/study/Scripture";
import { pageMetadata } from "@/lib/seo";
import { CANONICAL_ORIGIN } from "@/lib/site";
import "@/components/plan/plan.css";

const PATH = "/lampstand-in-the-bible";
const TITLE = "The Lampstand in the Bible: Meaning and Verses";
const DESCRIPTION =
  "The golden lampstand in the Bible: what it was, where it appears from Exodus to Revelation, and what it means for God's presence, His word and His people.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

const FAQ = [
  {
    q: "What does the lampstand symbolise in the Bible?",
    a: "Light in the presence of God. In the tabernacle it was the only light in the Holy Place, kept burning before the LORD every night. Later the Bible uses it for God's people: Zechariah sees a lampstand kept burning by God's Spirit, and in Revelation the seven lampstands are seven churches. Jesus calls His followers the light of the world, set on a stand so everyone can see.",
  },
  {
    q: "How many branches did the golden lampstand have?",
    a: "A central shaft with six branches, three on each side, holding seven lamps in all (Exodus 25:32, 37).",
  },
  {
    q: "What was the lampstand made of?",
    a: "Pure gold, about a talent of it, hammered out of a single piece with its base, shaft, branches, and cups shaped like almond blossoms (Exodus 25:31–39).",
  },
  {
    q: "Is the lampstand the same as the menorah?",
    a: "Yes. Menorah is the Hebrew word for lampstand. The seven-branched menorah of the tabernacle is described in Exodus 25 and made in Exodus 37.",
  },
  {
    q: "What are the seven lampstands in Revelation?",
    a: "Revelation 1:20 says so directly: the seven lampstands are the seven churches. In Revelation 2:5 Jesus warns the church in Ephesus that its lampstand could be removed if it does not repent.",
  },
  {
    q: "Where can I hear these passages read aloud?",
    a: "In Lampstand, the daily audio Bible. Exodus 25 and 37 and the Psalms are read aloud in Walk by day and Sleep by night, with the text on screen and a painting for each scene. Genesis is free to hear, every chapter.",
  },
];

/**
 * A study page for "lampstand in the Bible": what it was, where it appears, what it means, and a
 * way into the app. Every verse is quoted from the BSB at build time, so the wording matches what
 * the app reads aloud.
 */
export default function LampstandInTheBible() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: TITLE,
      description: DESCRIPTION,
      image: `${CANONICAL_ORIGIN}/images/sleep/exodus-25/s4.jpg`,
      mainEntityOfPage: `${CANONICAL_ORIGIN}${PATH}`,
      publisher: { "@type": "Organization", name: "Lampstand" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    },
  ];

  return (
    <article className="plan ls">
      <h1>The lampstand in the Bible</h1>
      <p className="plan-lead">
        A golden lampstand stood in the tabernacle, its seven lamps burning before God through the night. From Exodus to Revelation it
        becomes one of Scripture&apos;s clearest pictures: God&apos;s presence, His word as a lamp, and His people as light in the dark.
      </p>

      <figure className="ls-hero">
        <Image
          src="/images/sleep/exodus-25/s4.jpg"
          alt="A golden seven-branched lampstand with almond-blossom cups, its seven lamps burning in the dark tabernacle"
          width={768}
          height={1376}
          priority
        />
        <figcaption>The golden lampstand of Exodus 25, as painted for Lampstand&apos;s reading of the chapter.</figcaption>
      </figure>

      <nav className="ls-toc" aria-label="On this page">
        <a href="#what">What it was</a>
        <a href="#burning">Kept burning</a>
        <a href="#zechariah">Zechariah&apos;s vision</a>
        <a href="#revelation">Revelation</a>
        <a href="#jesus">A lamp on a stand</a>
        <a href="#meaning">What it means</a>
        <a href="#questions">Questions</a>
      </nav>

      <section className="plan-section" aria-labelledby="what">
        <h2 id="what">What the lampstand was</h2>
        <p>
          On Mount Sinai, God gave Moses the pattern for the tabernacle, the tent where He would dwell among His people. Inside, in the
          Holy Place, stood three pieces of furniture: the table for the bread of the Presence, the altar of incense, and the lampstand.
          The Hebrew word is <em>menorah</em>.
        </p>
        <Listen book="Exodus" chapter={25} from={31} to={37} />
        <p>
          It was hammered from a single piece of pure gold, about a talent of it, with cups shaped like almond blossoms, buds and
          petals, like a flowering tree. Seven lamps sat on top and lit the space in front of it. It was the only light in the Holy
          Place.
        </p>
        <p>
          Moses was told to make it exactly as he had been shown: &ldquo;See to it that you make everything according to the pattern
          shown you on the mountain&rdquo; (Exodus 25:40). In Exodus 37 Bezalel, the craftsman, makes it just as described.
        </p>
      </section>

      <section className="plan-section" aria-labelledby="burning">
        <h2 id="burning">Kept burning through the night</h2>
        <p>
          The people brought pure oil of pressed olives, and the priests tended the lamps every evening so they burned until morning.
          It was a permanent statute, a light that was never to go out before the LORD.
        </p>
        <Verse book="Leviticus" chapter={24} from={2} to={3} />
        <p>
          When Solomon built the temple in Jerusalem, he made ten lampstands of pure gold, five on each side before the inner
          sanctuary (1 Kings 7:49).
        </p>
      </section>

      <section className="plan-section" aria-labelledby="zechariah">
        <h2 id="zechariah">Zechariah&apos;s vision: by My Spirit</h2>
        <p>
          After the exile, while the temple lay unfinished, the prophet Zechariah saw a solid gold lampstand with a bowl on top and
          seven lamps, fed by two olive trees standing beside it. Nobody had to carry oil to it.
        </p>
        <Verse book="Zechariah" chapter={4} from={2} to={3} />
        <p>The angel&apos;s explanation became one of the best-known lines in the prophets:</p>
        <Verse book="Zechariah" chapter={4} from={6} />
      </section>

      <section className="plan-section" aria-labelledby="revelation">
        <h2 id="revelation">The seven lampstands of Revelation</h2>
        <p>
          On the island of Patmos, John turned to see who was speaking to him and saw seven golden lampstands, with the risen Christ
          walking among them.
        </p>
        <Verse book="Revelation" chapter={1} from={12} to={13} />
        <p>Jesus Himself explains what they are:</p>
        <Verse book="Revelation" chapter={1} from={20} />
        <p>
          A church is meant to hold up the light. That is why the warning to Ephesus is so sharp: if it does not return to its first
          love, &ldquo;I will come to you and remove your lampstand from its place&rdquo; (Revelation 2:5).
        </p>
      </section>

      <section className="plan-section" aria-labelledby="jesus">
        <h2 id="jesus">A lamp on a stand</h2>
        <p>Jesus used the same picture for the people who follow Him:</p>
        <Verse book="Matthew" chapter={5} from={14} to={16} />
        <p>And He said it of Himself first:</p>
        <Verse book="John" chapter={8} from={12} />
      </section>

      <section className="plan-section" aria-labelledby="meaning">
        <h2 id="meaning">What the lampstand means</h2>
        <ul className="ls-points">
          <li>
            <strong>God with His people.</strong> The light burned in the tent where God dwelt, before the veil, through every night of
            the wilderness journey.
          </li>
          <li>
            <strong>Light that God supplies.</strong> The oil came from olives the people brought, and in Zechariah&apos;s vision it
            flows from the trees themselves: not by might nor by power, but by His Spirit.
          </li>
          <li>
            <strong>His people as light.</strong> In Revelation the lampstands are churches, and in Matthew the lamp is put on a stand
            so everyone in the house can see.
          </li>
          <li>
            <strong>His word as a lamp.</strong> &ldquo;Your word is a lamp to my feet and a light to my path&rdquo; (Psalm 119:105).
          </li>
        </ul>
        <Listen book="Psalm" chapter={119} from={105} to={112} />
      </section>

      <section className="plan-section" aria-labelledby="questions">
        <h2 id="questions">Questions</h2>
        <dl className="plan-faq">
          {FAQ.map(({ q, a }) => (
            <div key={q}>
              <dt>{q}</dt>
              <dd>{a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <aside className="ls-cta" aria-labelledby="cta">
        <h2 id="cta">Hear the Bible, day and night</h2>
        <p>
          Lampstand reads the Bible aloud, chapter by chapter: in <strong>Walk</strong>, a clear voice for your day, and in{" "}
          <strong>Sleep</strong>, a slow, quiet reading for the night, with the words on screen and a painting for every scene. Exodus 25,
          where the lampstand is first described, is waiting for you, and so are the Psalms.
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
