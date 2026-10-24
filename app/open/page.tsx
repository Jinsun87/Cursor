import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { SLEEP_CHAPTERS, SLEEP_SECONDS, WALK_SECONDS } from "@/lib/sleep/chapters";
import { SHELF } from "@/lib/sleep/books";
import { FOUNDING_CAP, FOUNDING_LADDER, FOUNDING_PRICE, MEMBERS_PER_LANGUAGE, MEMBERS_PER_MONTH, fetchFoundingSpots } from "@/lib/founding";

// The founding count comes from the database; refresh the page every few minutes.
export const revalidate = 300;

export const metadata = pageMetadata({
  title: "The open book: where Lampstand stands",
  description:
    "Lampstand is honest by design: real prices with no fake discounts, Scripture word for word, and every chapter recorded so far, in the open.",
  path: "/open",
});

/**
 * Building in the open: what has been recorded, what comes next, and what
 * money pays for. Every number here comes from the app's own data, so it
 * stays true as chapters are added.
 */
export default async function OpenBookPage() {
  const spots = await fetchFoundingSpots();
  const taken = spots?.taken ?? null;
  const minutes = (map: Record<string, number>) => Math.round(Object.values(map).reduce((n, x) => n + x, 0) / 60);
  const books = SHELF.map((b) => {
    const recorded = SLEEP_CHAPTERS.filter((c) => c.slug.startsWith(`${b.slug}-`)).map((c) => c.chapter);
    const last = recorded.length ? Math.max(...recorded) : 0;
    return { ...b, recorded: recorded.length, next: last < b.chapters ? `${b.name} ${last + 1}–${Math.min(b.chapters, last + 10)}` : null };
  });

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--gold)]">The open book</p>
      <h1 className="mt-2 font-display text-4xl text-[var(--ink)] sm:text-5xl">Honest by design.</h1>
      <p className="mt-4 text-lg leading-relaxed text-[var(--muted)]">
        Here is exactly where Lampstand stands: what has been recorded, what comes next, and what your money pays for. Every number on
        this page comes straight from the app, so it updates as new chapters arrive.
      </p>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-[var(--ink)]">Recorded so far</h2>
        <ul className="mt-4 grid gap-3">
          {books.map((b) => (
            <li key={b.slug} className="rounded-2xl border border-[var(--line)] bg-[var(--canvas-2)] p-5">
              <p className="text-lg font-semibold text-[var(--ink)]">
                {b.name} · {b.recorded} of {b.chapters} chapters
              </p>
              <p className="mt-1 text-[var(--muted)]">
                {b.recorded
                  ? `Read aloud twice: briskly for Walk and softly for Sleep, each with its own paintings.${b.next ? ` Next: ${b.next}.` : ""}`
                  : b.premium
                    ? "Premium. Coming soon."
                    : "Coming soon."}
              </p>
              {b.recorded ? (
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--line)]">
                  <div className="h-full rounded-full bg-[var(--gold)]" style={{ width: `${(b.recorded / b.chapters) * 100}%` }} />
                </div>
              ) : null}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[var(--muted)]">
          In all: about {minutes(WALK_SECONDS)} minutes of Walk readings and {minutes(SLEEP_SECONDS)} minutes of Sleep readings, from the
          Berean Standard Bible, word for word.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-[var(--ink)]">Real prices</h2>
        <p className="mt-3 text-lg font-semibold text-[var(--ink)]">No fake inflated prices.</p>
        <p className="mt-1 leading-relaxed text-[var(--muted)]">
          No crossed-out prices that never existed, no countdown timers, no &ldquo;today only&rdquo;. The price you see is the price.
        </p>
        <ul className="mt-4 grid gap-2 text-[var(--ink)]">
          <li>Free: Walk and Sleep readings, Breathe, Bible quizzes and Scripture for life&apos;s struggles.</li>
          <li>Pro: $4.99 a month or $39.99 a year, with 7 days free on either.</li>
          <li>
            Founding member: ${FOUNDING_PRICE} once, Pro for life (every book, voice and story as it arrives), limited to the first {FOUNDING_CAP} members.
            {spots ? ` ${spots.left} of ${FOUNDING_CAP} spots left.` : ""}
          </li>
        </ul>
      </section>

      <section id="ladder" className="mt-10 scroll-mt-24">
        <h2 className="font-display text-2xl text-[var(--ink)]">What founding members fund</h2>
        <p className="mt-3 leading-relaxed text-[var(--muted)]">
          Every chapter is read aloud twice and painted, which costs about $0.80, all in. After Paddle&apos;s fee, each founding member
          brings us about $93. Here is what that money builds, in order. Each step lists how many founding members bring it within reach,
          counting the steps before it.
        </p>
        <ol className="mt-5 grid gap-3">
          {FOUNDING_LADDER.map((m, i) => {
            const funded = taken !== null && m.members !== null && taken >= m.members;
            const isNext = m.members !== null && !funded && FOUNDING_LADDER.slice(0, i).every((p) => p.members === null || (taken ?? 0) >= p.members);
            return (
              <li key={m.title} className="rounded-2xl border border-[var(--line)] bg-[var(--canvas-2)] p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-lg font-semibold text-[var(--ink)]">
                    {i + 1}. {m.title}
                  </p>
                  <p className="text-sm font-semibold text-[var(--gold)]">
                    {m.members === null
                      ? m.title === "More languages"
                        ? `${MEMBERS_PER_LANGUAGE} more members each`
                        : m.title === "Keeping it running"
                          ? `About ${MEMBERS_PER_MONTH} members a month`
                          : "Ongoing"
                      : funded
                        ? "Funded"
                        : `${m.members} founding members`}
                  </p>
                </div>
                <p className="mt-1 text-[var(--muted)]">
                  {m.note}
                  {m.cost !== null ? ` About $${Math.round(m.cost / 10) * 10}.` : ""}
                </p>
                {isNext && taken !== null && m.members !== null ? (
                  <div className="mt-3">
                    <div className="h-1.5 overflow-hidden rounded-full bg-[var(--line)]">
                      <div className="h-full rounded-full bg-[var(--gold)]" style={{ width: `${Math.min(100, (taken / m.members) * 100)}%` }} />
                    </div>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {taken} of {m.members} founding members so far
                    </p>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ol>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-[var(--ink)]">What we promise</h2>
        <ul className="mt-3 grid gap-2 leading-relaxed text-[var(--muted)]">
          <li>No ads while you listen: none in Walk, Sleep or Breathe. Premium removes them everywhere.</li>
          <li>Scripture word for word: no edits and no commentary in Walk and Sleep.</li>
          <li>Sign in and your streak, reading place and reading plan follow you to any device. Without an account, they stay in your browser.</li>
        </ul>
      </section>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link href="/?tab=sleep" className="inline-flex min-h-12 items-center rounded-full bg-[var(--gold)] px-6 font-semibold text-[var(--gold-ink)]">
          Listen tonight
        </Link>
        <Link href="/pricing" className="inline-flex min-h-12 items-center rounded-full border border-[var(--line-strong)] px-6 text-[var(--ink)]">
          See prices
        </Link>
      </div>
    </div>
  );
}
