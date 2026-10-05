"use client";

import Link from "next/link";
import { useState } from "react";
import { useApp } from "@/lib/store";
import { SECTIONS, sectionHref, sectionsHome } from "@/lib/nav";
import { MoreSheet } from "./MoreSheet";
import { SECTION_LABELS } from "./SectionIcon";
import { useSectionLink } from "./SectionNav";

/**
 * Header for the four-section layout. Desktop: the sections and More in the
 * middle. Phones: just the logo, Premium and sign-in (sections live in the
 * bottom bar), so it fits a 375px screen without sideways scrolling.
 */
export function SectionHeader() {
  const { user } = useApp();
  const { onHome, current, go } = useSectionLink();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b glass" style={{ borderColor: "var(--line)" }}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href={sectionsHome()} className="flex min-h-11 items-center gap-2 font-display text-xl tracking-wide">
          <span
            className="grid h-9 w-9 place-items-center rounded-full text-sm"
            style={{ background: "var(--gold)", color: "var(--gold-ink)" }}
            aria-hidden
          >
            L
          </span>
          <span>
            Lamp<span style={{ color: "var(--gold)" }}>stand</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 text-[17px] md:flex" aria-label="Sections">
          {SECTIONS.map((section) => {
            const active = onHome && current === section;
            return (
              <Link
                key={section}
                href={sectionHref(section)}
                onClick={go(section)}
                aria-current={active ? "page" : undefined}
                className={`min-h-11 inline-flex items-center rounded-full px-4 ${
                  active
                    ? "bg-[var(--canvas-2)] text-[var(--gold)] font-semibold"
                    : "text-[var(--muted)] hover:text-[var(--gold)]"
                }`}
              >
                {SECTION_LABELS[section]}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setMoreOpen((v) => !v)}
            aria-expanded={moreOpen}
            className={`min-h-11 inline-flex items-center rounded-full px-4 ${
              moreOpen ? "bg-[var(--canvas-2)] text-[var(--gold)]" : "text-[var(--muted)] hover:text-[var(--gold)]"
            }`}
          >
            More ▾
          </button>
        </nav>

        <div className="flex items-center gap-2 text-[15px]">
          {user?.premium ? null : (
            <Link
              href="/pricing"
              className="min-h-11 inline-flex items-center rounded-full border px-4 font-semibold"
              style={{ borderColor: "var(--gold)", color: "var(--gold)" }}
            >
              Premium
            </Link>
          )}
          {user ? (
            <Link href="/profile" className="min-h-11 inline-flex items-center px-2" aria-label="Your profile">
              <span
                className="grid h-9 w-9 place-items-center rounded-full font-semibold"
                style={{ background: "var(--canvas-2)", color: "var(--gold)", border: "1px solid var(--line)" }}
              >
                {user.username.charAt(0).toUpperCase()}
              </span>
            </Link>
          ) : (
            <Link href="/login" className="min-h-11 inline-flex items-center px-2 font-medium">
              Sign in
            </Link>
          )}
        </div>
      </div>
      <MoreSheet open={moreOpen} onClose={() => setMoreOpen(false)} anchor="top" />
    </header>
  );
}
