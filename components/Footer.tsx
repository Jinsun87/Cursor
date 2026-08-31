import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 border-t" style={{ borderColor: "var(--line)", background: "var(--canvas-2)" }}>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-lg">
            Quiz<span style={{ color: "var(--gold)" }}>Forge</span>
          </p>
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
            An independent recreation of the expert-quiz + mastery + freemium
            model popularized by sites like QuizGriz. Original questions and
            branding. Not affiliated with QG Marketing LLC.
          </p>
        </div>
        <nav className="text-sm" aria-label="Footer">
          <p className="mb-2 font-semibold" style={{ color: "var(--gold)" }}>
            Play
          </p>
          <ul className="space-y-2">
            <li>
              <Link href="/quizzes" className="inline-flex min-h-11 items-center">
                All quizzes
              </Link>
            </li>
            <li>
              <Link href="/daily" className="inline-flex min-h-11 items-center">
                Quiz of the day
              </Link>
            </li>
            <li>
              <Link href="/secret" className="inline-flex min-h-11 items-center">
                Secret quizzes
              </Link>
            </li>
            <li>
              <Link href="/premium" className="inline-flex min-h-11 items-center">
                Go Premium
              </Link>
            </li>
          </ul>
        </nav>
        <div className="text-sm">
          <p className="mb-2 font-semibold" style={{ color: "var(--gold)" }}>
            Mission
          </p>
          <p style={{ color: "var(--muted)" }}>
            Train your mind. Master a topic. Support cognitive-health causes
            with optional donations.
          </p>
          <Link href="/donate" className="mt-3 inline-flex min-h-11 items-center" style={{ color: "var(--gold)" }}>
            Donate →
          </Link>
        </div>
      </div>
    </footer>
  );
}
