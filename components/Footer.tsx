import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-pine-800 bg-pine-900/60">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-lg">
            Quiz<span className="text-gold-400">Forge</span>
          </p>
          <p className="mt-2 text-sm text-parchment/70">
            An independent recreation of the expert-quiz + mastery + freemium
            model popularized by sites like QuizGriz. Original questions and
            branding. Not affiliated with QG Marketing LLC.
          </p>
        </div>
        <div className="text-sm">
          <p className="mb-2 font-semibold text-gold-400">Play</p>
          <ul className="space-y-1 text-parchment/80">
            <li>
              <Link href="/quizzes">All quizzes</Link>
            </li>
            <li>
              <Link href="/daily">Quiz of the day</Link>
            </li>
            <li>
              <Link href="/secret">Secret quizzes</Link>
            </li>
            <li>
              <Link href="/premium">Go Premium</Link>
            </li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="mb-2 font-semibold text-gold-400">Mission</p>
          <p className="text-parchment/80">
            Train your mind. Master a topic. Support cognitive-health causes
            with optional donations.
          </p>
          <Link href="/donate" className="mt-3 inline-block text-gold-400">
            Donate →
          </Link>
        </div>
      </div>
    </footer>
  );
}
