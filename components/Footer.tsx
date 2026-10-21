import Link from "next/link";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Listen",
    links: [
      { href: "/?tab=walk", label: "Walk: the chapter by day" },
      { href: "/?tab=sleep", label: "Sleep: the chapter by night" },
      { href: "/?tab=breathe", label: "Breathe" },
      { href: "/plan", label: "Bible reading plan" },
      { href: "/read", label: "Bible & life topics" },
    ],
  },
  {
    title: "Lampstand",
    links: [
      { href: "/pricing", label: "Pricing" },
      { href: "/pricing#founding", label: "Founding members" },
      { href: "/open", label: "The open book" },
      { href: "/donate", label: "Donate" },
    ],
  },
  {
    title: "Also",
    links: [
      { href: "/quizzes", label: "Bible quizzes" },
      { href: "/daily", label: "Quiz of the day" },
    ],
  },
];

/** Desktop only: on phones the bottom bar and the More sheet carry these links. */
export function Footer() {
  return (
    <footer className="mt-20 hidden border-t md:block" style={{ borderColor: "var(--line)", background: "var(--canvas-2)" }}>
      <div className="mx-auto grid max-w-6xl grid-cols-[1.4fr_1fr_1fr_1fr] gap-8 px-4 py-12">
        <div>
          <p className="font-display text-lg">
            Lamp<span style={{ color: "var(--gold)" }}>stand</span>
          </p>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            A daily habit of Scripture. Whole chapters read aloud, briskly by day and softly by night, word for word from the Berean
            Standard Bible.
          </p>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Independent: not a church, and not affiliated with any denomination.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <nav key={col.title} className="text-sm" aria-label={col.title}>
            <p className="mb-2 font-semibold" style={{ color: "var(--gold)" }}>
              {col.title}
            </p>
            <ul className="space-y-1">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-flex min-h-9 items-center text-[var(--ink)] transition-colors hover:text-[var(--gold)]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t" style={{ borderColor: "var(--line)" }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5 text-xs" style={{ color: "var(--muted)" }}>
          <p>Scripture from the Berean Standard Bible, public domain.</p>
          <nav aria-label="Legal" className="flex gap-5">
            <Link href="/privacy" className="hover:text-[var(--ink)]">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[var(--ink)]">
              Terms
            </Link>
            <Link href="/refunds" className="hover:text-[var(--ink)]">
              Refunds
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
