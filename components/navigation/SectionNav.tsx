"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type MouseEvent } from "react";
import { triggerHaptic } from "@/lib/haptics";
import { SECTIONS, sectionHref, sectionsHome, type Section } from "@/lib/nav";
import { setSection, useSection } from "@/lib/section-store";
import { MoreSheet } from "./MoreSheet";
import { SECTION_LABELS, SectionIcon } from "./SectionIcon";

/**
 * Clicking a section while already on the home screen switches it in place
 * (no page load); from any other page it goes to the home screen at that
 * section.
 */
export function useSectionLink() {
  const pathname = usePathname();
  const onHome = pathname === sectionsHome();
  const current = useSection();
  const go = (section: Section) => (e: MouseEvent) => {
    triggerHaptic("selection");
    if (!onHome) return; // let the link navigate
    e.preventDefault();
    setSection(section);
    const target = section === "today" ? null : document.getElementById("sections");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return { onHome, current, go };
}

/** Phone bottom bar: Today · Walk · Sleep · Breathe · More. */
export function SectionBottomBar() {
  const { onHome, current, go } = useSectionLink();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      <nav
        aria-label="Sections"
        // Solid, not translucent: light pages behind a see-through bar made the labels unreadable.
        style={{ background: "var(--canvas-2)", boxShadow: "0 -8px 24px -12px rgba(0, 0, 0, 0.45)" }}
        className="section-bar fixed inset-x-0 bottom-0 z-50 block md:hidden border-t border-[var(--line)] pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-2"
      >
        <div className="mx-auto flex max-w-md items-stretch justify-around px-1">
          {SECTIONS.map((section) => {
            const active = onHome && current === section && !moreOpen;
            return (
              <Link
                key={section}
                href={sectionHref(section)}
                onClick={go(section)}
                aria-current={active ? "page" : undefined}
                className={`relative flex flex-1 flex-col items-center justify-center gap-1 min-h-[60px] rounded-2xl text-center ${
                  active ? "text-[var(--gold)]" : "text-[var(--muted)]"
                }`}
              >
                <SectionIcon name={section} active={active} />
                <span className={`text-[13px] ${active ? "font-bold" : "font-medium"}`}>{SECTION_LABELS[section]}</span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => {
              triggerHaptic("selection");
              setMoreOpen((v) => !v);
            }}
            aria-expanded={moreOpen}
            className={`relative flex flex-1 flex-col items-center justify-center gap-1 min-h-[60px] rounded-2xl ${
              moreOpen ? "text-[var(--gold)]" : "text-[var(--muted)]"
            }`}
          >
            <SectionIcon name="more" />
            <span className={`text-[13px] ${moreOpen ? "font-bold" : "font-medium"}`}>More</span>
          </button>
        </div>
      </nav>
      <MoreSheet open={moreOpen} onClose={() => setMoreOpen(false)} anchor="bottom" />
    </>
  );
}
