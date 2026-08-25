"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/lib/store";

const links = [
  { href: "/quizzes", label: "Quizzes" },
  { href: "/daily", label: "Daily" },
  { href: "/secret", label: "Secret" },
  { href: "/leaderboard", label: "Board" },
  { href: "/how-it-works", label: "How to play" },
];

export function Header() {
  const pathname = usePathname();
  const { user } = useApp();

  return (
    <header className="sticky top-0 z-40 border-b border-pine-700/60 bg-pine-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-display text-xl tracking-wide">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gold-400 text-pine-950">
            🐻
          </span>
          <span>
            Quiz<span className="text-gold-400">Forge</span>
          </span>
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={
                pathname === l.href || pathname.startsWith(l.href + "/")
                  ? "text-gold-400"
                  : "text-parchment/80 hover:text-gold-400"
              }
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              <span className="hidden rounded-full border border-gold-500/40 px-3 py-1 text-gold-400 sm:inline">
                {user.coins.toLocaleString()} coins
              </span>
              <Link href="/profile" className="hover:text-gold-400">
                {user.username}
                {user.premium ? " ★" : ""}
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-gold-400">
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-gold-400 px-3 py-1 font-medium text-pine-950 hover:bg-gold-500"
              >
                Join free
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
