import Link from "next/link";
import { CATEGORIES, FEATURED_EXPERTS, QUIZZES, SERIES } from "@/lib/catalog";
import { QuizCard } from "@/components/QuizCard";

export default function HomePage() {
  const featured = QUIZZES.filter((q) => !q.isSecret && !q.isReview).slice(0, 6);

  return (
    <div>
      <section className="overflow-hidden rounded-3xl border border-pine-700 bg-gradient-to-br from-pine-800 to-pine-950 px-6 py-16 md:px-12">
        <p className="text-sm uppercase tracking-[0.3em] text-gold-400">Mind gym · Topic mastery</p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl leading-tight md:text-6xl">
          Prove you can master a subject, not just clear a feed.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-parchment/80">
          QuizForge is a community of knowledge-seekers who train on
          interest-based packs written like field manuals — then earn a
          Certificate of Mastery when they actually learn the material.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/quizzes"
            className="rounded-full bg-gold-400 px-6 py-3 font-medium text-pine-950"
          >
            Take your first quiz
          </Link>
          <Link href="/how-it-works" className="rounded-full border border-pine-500 px-6 py-3">
            How packs work
          </Link>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-3xl">Featuring quizzes written like industry briefs</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {FEATURED_EXPERTS.map((e) => (
            <Link
              key={e.category}
              href={`/category/${e.category}`}
              className="rounded-2xl border border-pine-700 bg-pine-900/50 p-6 hover:border-gold-400/50"
            >
              <p className="text-xs uppercase tracking-widest text-pine-400">{e.category}</p>
              <h3 className="mt-2 font-display text-2xl capitalize">{e.category}</h3>
              <p className="mt-2 text-sm text-parchment/70">
                Featuring quizzes written with {e.name}. {e.line}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl">Start a pack</h2>
          <Link href="/quizzes" className="text-sm text-gold-400">
            Browse all
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {SERIES.map((s) => (
            <Link
              key={s.slug}
              href={`/series/${s.slug}`}
              className="rounded-2xl border border-pine-700 p-6 hover:border-gold-400/50"
            >
              <h3 className="font-display text-2xl">{s.title}</h3>
              <p className="mt-2 text-sm text-parchment/70">{s.description}</p>
              <p className="mt-3 text-xs text-pine-400">
                {s.quizSlugs.length} quizzes + review · 70% to master
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14 grid gap-4 md:grid-cols-3">
        {featured.map((q) => (
          <QuizCard key={q.slug} quiz={q} />
        ))}
      </section>

      <section className="mt-16 rounded-3xl border border-gold-500/30 bg-pine-900/60 p-8 md:p-12">
        <h2 className="font-display text-3xl">Our mission</h2>
        <p className="mt-4 max-w-3xl text-parchment/80">
          Create engaging, educational quizzes that spark curiosity, promote
          lifelong learning, and keep minds active. Entertainment with a
          cognitive-health thesis: learning something new is a workout, and
          communities that stay curious age better.
        </p>
        <p className="mt-4 text-parchment/80">
          Take a stand for healthier minds. Subscribe to Premium, donate to a
          cognitive-health fund, or support the platform directly.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/premium" className="rounded-full bg-gold-400 px-5 py-2 text-pine-950">
            Go Premium
          </Link>
          <Link href="/donate" className="rounded-full border border-gold-400 px-5 py-2 text-gold-400">
            Donate
          </Link>
        </div>
        <ul className="mt-8 grid gap-2 text-sm text-parchment/80 md:grid-cols-2">
          <li>· 5,000 extra coins when you upgrade</li>
          <li>· Ad-free Secret Quizzes</li>
          <li>· First notice when new series drop</li>
          <li>· Premium badge on your profile</li>
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-2xl">Categories</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="rounded-full border border-pine-600 px-4 py-2 text-sm hover:border-gold-400"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
