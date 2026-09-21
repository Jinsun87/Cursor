import Link from "next/link";
import Image from "next/image";
import { VISIBLE_QUIZZES, SERIES } from "@/lib/catalog";
import { BOOKS } from "@/lib/bible/catalog";
import { QuizCard } from "@/components/QuizCard";
import { TodayHabitHub } from "@/components/home/TodayHabitHub";

export default function HomePage() {
  const bibleQuizzes = VISIBLE_QUIZZES;
  const flagship = bibleQuizzes.find((q) => q.slug === "open-the-book");
  const pictureQuiz = bibleQuizzes.find((q) => q.slug === "look-at-the-picture-bible");

  const otherQuizzes = bibleQuizzes.filter(
    (q) => q.slug !== "open-the-book" && q.slug !== "look-at-the-picture-bible",
  );

  return (
    <div className="space-y-16">
      {/* 1. Glorify-Style Today Sacred Rhythm & Habit Hub */}
      <TodayHabitHub />

      {/* 2. Illuminated Bible Reader Showcase */}
      <section className="rounded-3xl border border-[var(--line)] bg-[var(--canvas-2)] p-6 sm:p-10 shadow-2xl glass-sanctuary">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--gold)]">
              The Living Word · Two Reading Modes
            </span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-[var(--ink)]">
              The Illuminated Scripture Reader
            </h2>
            <p className="mt-3 text-[var(--muted)] leading-relaxed text-sm sm:text-base">
              Experience the Bible in two complementary ways: **WhatsApp-style visual Story Mode** with museum-grade classical paintings and Greek/Hebrew WordSparks, or **Editorial Scroll Mode** for quiet, uninterrupted personal meditation.
            </p>
          </div>

          <Link href="/read" className="btn btn-primary shrink-0 text-sm">
            📖 Open Bible Index
          </Link>
        </div>

        {/* Featured Chapter Cards Grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              book: "Genesis",
              chapter: 1,
              title: "The Birth of the Cosmos",
              subtitle: "The Spirit hovers over the deep waters and God speaks light into the void.",
              art: "/images/stories/genesis-1/s1.jpg",
              slug: "genesis",
            },
            {
              book: "Psalms",
              chapter: 23,
              title: "The Shepherd Psalm",
              subtitle: "David's timeless meditation on quiet waters, dark valleys, and overflowing grace.",
              art: "/images/stories/psalms-23/s1.jpg",
              slug: "psalms",
            },
            {
              book: "John",
              chapter: 1,
              title: "The Word Made Flesh",
              subtitle: "The cosmic Logos that shone before time enters human dust and tabernacles among us.",
              art: "/images/stories/john-1/s1.jpg",
              slug: "john",
            },
            {
              book: "Exodus",
              chapter: 3,
              title: "The Burning Bush",
              subtitle: "At Mount Horeb, God speaks from an unconsumed flame and declares: 'I AM WHO I AM.'",
              art: "/images/stories/exodus-3/s1.jpg",
              slug: "exodus",
            },
            {
              book: "Matthew",
              chapter: 5,
              title: "The Sermon on the Mount",
              subtitle: "Jesus delivers the manifesto of the Kingdom: the Beatitudes and the city on a hill.",
              art: "/images/stories/matthew-5/s1.jpg",
              slug: "matthew",
            },
            {
              book: "Genesis",
              chapter: 12,
              title: "The Call of Abram",
              subtitle: "Leaving comfort into the unknown, trusting the promise of a starry sky.",
              art: "/images/stories/genesis-12/s1.jpg",
              slug: "genesis",
            },
          ].map((item) => (
            <Link
              key={`${item.slug}-${item.chapter}`}
              href={`/read/${item.slug}/${item.chapter}`}
              className="group relative flex overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--canvas)] hover:border-[var(--gold)]/50 transition-all shadow-md"
            >
              <div className="relative h-32 w-24 shrink-0 overflow-hidden bg-black">
                <Image
                  src={item.art}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-1 flex-col justify-between p-3.5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--gold)]">
                    {item.book} {item.chapter}
                  </span>
                  <h3 className="font-display text-base font-bold text-[var(--ink)] leading-tight group-hover:text-[var(--gold)] transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-[var(--muted)]">
                    {item.subtitle}
                  </p>
                </div>

                <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-[var(--gold)]">
                  <span>✨ Read Story</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Scripture Sittings & Quiz Desk (Flagships) */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--gold)]">
              Active Recall · Daily Retention
            </span>
            <h2 className="mt-1 font-display text-3xl sm:text-4xl text-[var(--ink)] font-bold">
              Scripture Sittings & Master Quizzes
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)] max-w-2xl">
              Original questions on the text—patriarchs, prophets, Gospels, and epistles. Score 70%+ to master each sitting, earn coins, and claim Certificates of Mastery.
            </p>
          </div>

          <Link href="/quizzes" className="text-sm font-semibold text-[var(--gold)] hover:underline shrink-0">
            View All Scripture Sittings →
          </Link>
        </div>

        {/* 2 Flagship Hero Cards */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {pictureQuiz ? (
            <div className="overflow-hidden rounded-3xl border border-[var(--gold)]/40 bg-[var(--canvas-2)] p-6 sm:p-8 shadow-xl flex flex-col justify-between glass-sanctuary">
              <div>
                <span className="rounded-full bg-[var(--gold)]/15 px-3 py-1 text-xs font-semibold text-[var(--gold)] uppercase tracking-wider">
                  🎨 Visual Recognition Quiz
                </span>
                <h3 className="mt-3 font-display text-2xl sm:text-3xl font-bold text-[var(--ink)]">
                  {pictureQuiz.title}
                </h3>
                <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">
                  Identify holy events, prophets, and biblical milestones through 30 museum-grade classical paintings. High engagement visual recall.
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[var(--line)] pt-4">
                <span className="text-xs text-[var(--gold)] font-medium">
                  🪙 +{pictureQuiz.coinsOnComplete} Coins Reward
                </span>
                <Link href={`/quizzes/${pictureQuiz.slug}`} className="btn btn-primary text-xs py-2 px-5">
                  Start Picture Quiz
                </Link>
              </div>
            </div>
          ) : null}

          {flagship ? (
            <div className="overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--canvas-2)] p-6 sm:p-8 shadow-xl flex flex-col justify-between glass-sanctuary">
              <div>
                <span className="rounded-full bg-black/5 dark:bg-white/10 px-3 py-1 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                  📜 54-Question Flagship Sitting
                </span>
                <h3 className="mt-3 font-display text-2xl sm:text-3xl font-bold text-[var(--ink)]">
                  {flagship.title}
                </h3>
                <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">
                  Fifty-four original questions across four epochs: patriarchs, prophets, Gospels, and letters. Score 70%+ to claim the $29 Bible Foundations eBook free.
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[var(--line)] pt-4">
                <span className="text-xs text-[var(--gold)] font-medium">
                  🪙 +{flagship.coinsOnComplete} Coins · Certificate
                </span>
                <Link href={`/quizzes/${flagship.slug}`} className="btn btn-primary text-xs py-2 px-5">
                  Begin Flagship Sitting
                </Link>
              </div>
            </div>
          ) : null}
        </div>

        {/* Other Scripture Sittings Grid */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {otherQuizzes.slice(0, 6).map((q) => (
            <QuizCard key={q.slug} quiz={q} />
          ))}
        </div>
      </section>

      {/* 4. Bible Foundations Series Track */}
      <section className="mt-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--gold)]">
              Curated Curriculum
            </span>
            <h2 className="mt-1 font-display text-3xl text-[var(--ink)] font-bold">Structured Study Tracks</h2>
          </div>
          <Link href="/series/bible-foundations" className="text-sm text-[var(--gold)] hover:underline">
            View Track →
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {SERIES.filter((s) => s.category === "bible").map((s) => (
            <Link
              key={s.slug}
              href={`/series/${s.slug}`}
              className="group rounded-2xl border border-[var(--gold)]/30 bg-[var(--canvas-2)] p-6 sm:p-8 hover:border-[var(--gold)] transition-all shadow-lg flex flex-col justify-between glass-sanctuary"
            >
              <div>
                <span className="text-xs uppercase tracking-wider text-[var(--gold)] font-bold">
                  Certified Mastery Track
                </span>
                <h3 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-[var(--ink)] group-hover:text-[var(--gold)] transition-colors">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">
                  {s.description}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[var(--line)] pt-4 text-xs">
                <span className="text-[var(--muted)]">
                  {s.quizSlugs.length} sittings + Comprehensive Review
                </span>
                <span className="font-semibold text-[var(--gold)] group-hover:translate-x-1 transition-transform">
                  Enter Track →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Sanctuary Mission & Purpose Statement */}
      <section className="rounded-3xl border border-[var(--line)] bg-[var(--canvas-2)] p-8 md:p-12 shadow-xl glass-sanctuary">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--gold)]">
            Our Purpose
          </span>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl text-[var(--ink)] font-bold">
            Stay with Scripture long enough to remember it.
          </h2>
          <p className="mt-4 text-base text-[var(--muted)] leading-relaxed">
            In an era of fleeting feeds and superficial skimming, Lampstand builds a quiet, sacred harbor for God&apos;s Word. Through visual story illumination, original Greek & Hebrew root discoveries, active recall questions, and structured mastery tracks, we help you internalize the text deeply.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/pricing" className="btn btn-primary text-xs py-2.5 px-6">
              👑 Join Lampstand Plus
            </Link>
            <Link href="/ebooks" className="btn btn-ghost text-xs py-2.5 px-6">
              📚 Browse Study E-Books
            </Link>
            <Link href="/how-it-works" className="btn btn-ghost text-xs py-2.5 px-6">
              How Mastery Works
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
