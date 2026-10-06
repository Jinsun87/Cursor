"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useApp } from "@/lib/store";
import { useTheme } from "@/lib/theme";
import "./nav.css";

const ITEMS = [
  { href: "/read", label: "Bible & life topics", note: "Chapters, and Scripture for anxiety, grief and more" },
  { href: "/quizzes", label: "Bible quizzes", note: "Test what you know, with a fact after each answer" },
  { href: "/daily", label: "Quiz of the day", note: "Ten new questions every day" },
];

/**
 * Everything that is not one of the four sections, one tap away: a sheet from
 * the bottom on phones, a panel under the header on larger screens.
 */
export function MoreSheet({ open, onClose, anchor }: { open: boolean; onClose: () => void; anchor: "bottom" | "top" }) {
  const { user } = useApp();
  const { theme, cycle } = useTheme();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    if (anchor === "bottom") document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, anchor]);

  if (!open) return null;

  return (
    <div className={`more-layer more-${anchor}`} onClick={onClose}>
      <div
        className="more-sheet"
        role="dialog"
        aria-modal={anchor === "bottom"}
        aria-label="More"
        onClick={(e) => e.stopPropagation()}
      >
        {anchor === "bottom" ? <div className="more-grip" aria-hidden="true" /> : null}
        <ul className="more-list">
          {ITEMS.map((item) => (
            <li key={item.href}>
              <Link href={item.href} onClick={onClose}>
                <strong>{item.label}</strong>
                <span>{item.note}</span>
              </Link>
            </li>
          ))}
          <li>
            <Link href={user?.premium ? "/profile" : "/pricing"} onClick={onClose} className="more-premium">
              <strong>{user?.premium ? "Your Premium" : "Premium"}</strong>
              <span>{user?.premium ? "Manage your subscription" : "The full Walk and Sleep libraries, no ads"}</span>
            </Link>
          </li>
          <li>
            <Link href={user ? "/profile" : "/login"} onClick={onClose}>
              <strong>{user ? "Your profile" : "Sign in"}</strong>
              <span>{user ? user.email : "Keep your streak and Premium on every device"}</span>
            </Link>
          </li>
          <li>
            <button type="button" onClick={cycle}>
              <strong>{theme === "dark" ? "Switch to light" : "Switch to dark"}</strong>
              <span>Change how the pages look</span>
            </button>
          </li>
        </ul>
        {anchor === "bottom" ? (
          <button type="button" className="more-close" onClick={onClose}>
            Close
          </button>
        ) : null}
      </div>
    </div>
  );
}
