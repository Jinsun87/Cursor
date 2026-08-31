"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useApp } from "@/lib/store";
import { useTheme } from "@/lib/theme";

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
  const { theme, cycle } = useTheme();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const navLink = (href: string, label: string) => {
    const active = pathname === href || pathname.startsWith(href + "/");
    return (
      <Link
        key={href}
        href={href}
        aria-current={active ? "page" : undefined}
        className={`min-h-11 inline-flex items-center rounded-full px-3 ${
          active ? "bg-[var(--canvas-2)] text-[var(--gold)]" : "text-[var(--muted)] hover:text-[var(--gold)]"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-40 border-b glass" style={{ borderColor: "var(--line)" }}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex min-h-11 items-center gap-2 font-display text-xl tracking-wide">
          <span
            className="grid h-9 w-9 place-items-center rounded-full text-sm"
            style={{ background: "var(--gold)", color: "var(--gold-ink)" }}
            aria-hidden
          >
            QF
          </span>
          <span>
            Quiz<span style={{ color: "var(--gold)" }}>Forge</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 text-sm md:flex" aria-label="Primary">
          {links.map((l) => navLink(l.href, l.label))}
        </nav>
        <div className="flex items-center gap-2 text-sm">
          <button
            type="button"
            className="btn btn-ghost min-h-11 px-3"
            onClick={cycle}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          {user ? (
            <>
              <span
                className="hidden rounded-full border px-3 py-2 sm:inline"
                style={{ borderColor: "var(--line)", color: "var(--gold)" }}
              >
                {user.coins.toLocaleString()} coins
              </span>
              <Link href="/profile" className="min-h-11 inline-flex items-center">
                {user.username}
                {user.premium ? " ★" : ""}
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden min-h-11 items-center sm:inline-flex">
                Log in
              </Link>
              <Link href="/register" className="btn btn-primary">
                Join free
              </Link>
            </>
          )}
          <button
            type="button"
            className="btn btn-ghost min-h-11 px-3 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            Menu
          </button>
        </div>
      </div>
      {open ? (
        <nav
          id="mobile-nav"
          className="border-t px-4 py-4 md:hidden"
          style={{ borderColor: "var(--line)" }}
          aria-label="Mobile"
        >
          <div className="flex flex-col gap-1">
            {links.map((l) => navLink(l.href, l.label))}
            {user ? null : (
              <Link href="/login" className="min-h-11 inline-flex items-center px-3">
                Log in
              </Link>
            )}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
