import Link from "next/link";
import { CATEGORIES, FEATURED_EXPERTS, QUIZZES, SERIES } from "@/lib/catalog";
import { QuizCard } from "@/components/QuizCard";

export default function HomePage() {
  const flagship = QUIZZES.find((q) => q.slug === "get-your-fill-restaurant");
  const featured = [
    ...(flagship ? [flagship] : []),
    ...QUIZZES.filter((q) => q.slug !== flagship?.slug && !q.isSecret && !q.isReview),
  ].slice(0, 6);

  return (
    <div>
      <section
        className="overflow-hidden rounded-3xl border px-6 py-16 md:px-12"
        style={{
          borderColor: "var(--line)",
          background: "linear-gradient(160deg, var(--canvas-2), var(--canvas))",
        }}
      >
        <p className="text-sm uppercase tracking-[0.22em]" style={{ color: "var(--gold)" }}>
          Mind gym · Topic mastery
        </p>
        <h1 className="mt-4 max-w-3xl font-display leading-[1.08]" style={{ fontSize: "clamp(2.1rem, 5vw, 4.25rem)" }}>
          Prove you can master a subject, not just clear a feed.
        </h1>
        <p className="mt-5 max-w-2xl text-lg" style={{ color: "var(--muted)" }}>
          QuizForge is a community of knowledge-seekers who train on
          interest-based packs written like field manuals — then earn a
          Certificate of Mastery when they actually learn the material.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/quizzes/get-your-fill-restaurant" className="btn btn-primary">
            Take your first quiz
          </Link>
          <Link href="/how-it-works" className="btn btn-ghost">
            How packs work
          </Link>
        </div>
        <p className="mt-4 text-sm" style={{ color: "var(--muted)" }}>
          Flagship sitting: 54-question restaurant remix (fast food, family dining, fine dining).
        </p>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-3xl">Featuring quizzes written like industry briefs</h2>
        <div className="bento mt-6">
          {FEATURED_EXPERTS.map((e, i) => (
            <Link
              key={e.category}
              href={`/category/${e.category}`}
              className={`lift rounded-2xl border bg-[var(--canvas-2)] p-6 ${i === 0 ? "md:col-span-6" : "md:col-span-3"}`}
              style={{ borderColor: "var(--line)" }}
            >
              <p className="text-xs uppercase tracking-widest" style={{ color: "var(--muted)" }}>
                {e.category}
              </p>
              <h3 className="mt-2 font-display text-2xl capitalize">{e.category}</h3>
              <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                Featuring quizzes written with {e.name}. {e.line}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl">Start a pack</h2>
          <Link href="/quizzes" className="text-sm" style={{ color: "var(--gold)" }}>
            Browse all
          </Link>
        </div>
        <div className="bento mt-6">
          {SERIES.map((s, i) => (
            <Link
              key={s.slug}
              href={`/series/${s.slug}`}
              className={`lift rounded-2xl border bg-[var(--canvas-2)] p-6 ${i === 0 ? "md:col-span-4 md:row-span-2" : "md:col-span-2"}`}
              style={{ borderColor: "var(--line)" }}
            >
              <h3 className={`font-display ${i === 0 ? "text-3xl" : "text-2xl"}`}>{s.title}</h3>
              <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                {s.description}
              </p>
              <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>
                {s.quizSlugs.length} quizzes + review · 70% to master
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bento mt-14">
        {featured.map((q, i) => (
          <QuizCard key={q.slug} quiz={q} featured={i === 0} />
        ))}
      </section>

      <section
        className="mt-16 rounded-3xl border p-8 md:p-12"
        style={{ borderColor: "var(--line)", background: "var(--canvas-2)" }}
      >
        <h2 className="font-display text-3xl">Our mission</h2>
        <p className="mt-4 max-w-3xl" style={{ color: "var(--muted)" }}>
          Create engaging, educational quizzes that spark curiosity, promote
          lifelong learning, and keep minds active. Entertainment with a
          cognitive-health thesis: learning something new is a workout, and
          communities that stay curious age better.
        </p>
        <p className="mt-4" style={{ color: "var(--muted)" }}>
          Take a stand for healthier minds. Subscribe to Premium, donate to a
          cognitive-health fund, or support the platform directly.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/premium" className="btn btn-primary">
            Go Premium
          </Link>
          <Link href="/donate" className="btn btn-ghost">
            Donate
          </Link>
        </div>
        <ul className="mt-8 grid gap-2 text-sm md:grid-cols-2" style={{ color: "var(--muted)" }}>
          <li>5,000 extra coins when you upgrade</li>
          <li>Ad-free Secret Quizzes</li>
          <li>First notice when new series drop</li>
          <li>Premium badge on your profile</li>
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-2xl">Categories</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="inline-flex min-h-11 items-center rounded-full border px-4 text-sm"
              style={{ borderColor: "var(--line)" }}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
