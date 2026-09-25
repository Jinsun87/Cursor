"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { triggerHaptic } from "@/lib/haptics";

interface TabItem {
  label: string;
  href: string;
  badge?: string;
  icon: (active: boolean) => React.ReactNode;
}

const TABS: TabItem[] = [
  {
    label: "Today",
    href: "/",
    icon: (active) => (
      <svg
        className={`h-6 w-6 transition-transform duration-200 ${active ? "scale-110" : ""}`}
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={active ? "0" : "1.8"}
      >
        <path d="M12 2c.4 0 .8.2 1 .5l1.6 2.3c.7 1 1.7 1.8 2.8 2.3l2.6 1.1c.9.4 1.3 1.4 1 2.3l-.8 2.7c-.3 1.2-.2 2.5.3 3.6l1.3 2.5c.4.8.1 1.9-.7 2.4l-2.4 1.5c-1 .6-1.8 1.6-2.2 2.7l-.9 2.7c-.3.9-1.2 1.5-2.1 1.4l-2.8-.4c-1.2-.2-2.4.2-3.4.9l-2.3 1.6c-.8.5-1.9.3-2.4-.5l-1.5-2.4c-.6-1-1.6-1.8-2.7-2.2l-2.7-.9c-.9-.3-1.5-1.2-1.4-2.1l.4-2.8c.2-1.2-.2-2.4-.9-3.4L.5 13.9c-.5-.8-.3-1.9.5-2.4l2.4-1.5c1-.6 1.8-1.6 2.2-2.7l.9-2.7c.3-.9 1.2-1.5 2.1-1.4l2.8.4c1.2.2 2.4-.2 3.4-.9L11 3.5c.3-.3.6-.5 1-.5z" />
        <circle cx="12" cy="12" r="3.5" fill={active ? "#0d0f12" : "currentColor"} />
      </svg>
    ),
  },
  {
    label: "Bible",
    href: "/read",
    icon: (active) => (
      <svg
        className={`h-6 w-6 transition-transform duration-200 ${active ? "scale-110" : ""}`}
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={active ? "0" : "1.8"}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
  },
  {
    label: "Quizzes",
    href: "/quizzes",
    icon: (active) => (
      <svg
        className={`h-6 w-6 transition-transform duration-200 ${active ? "scale-110" : ""}`}
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={active ? "0" : "1.8"}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.003 0H9.497m5.003 0a7.5 7.5 0 10-5.003 0M12 3v1.5m6.364 1.636l-1.06 1.06M21 12h-1.5m-1.636 6.364l-1.06-1.06M3 12h1.5m1.636-6.364l1.06 1.06"
        />
      </svg>
    ),
  },
  {
    label: "Library",
    href: "/ebooks",
    icon: (active) => (
      <svg
        className={`h-6 w-6 transition-transform duration-200 ${active ? "scale-110" : ""}`}
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={active ? "0" : "1.8"}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
        />
      </svg>
    ),
  },
  {
    label: "Plus",
    href: "/pricing",
    badge: "PRO",
    icon: (active) => (
      <svg
        className={`h-6 w-6 transition-transform duration-200 ${active ? "scale-110" : ""}`}
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={active ? "0" : "1.8"}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
        />
      </svg>
    ),
  },
];

export function BottomTabBar() {
  const pathname = usePathname();

  // If in story reader full-screen view (e.g. /read/genesis/1?mode=story or reading),
  // keep tabs accessible or cleanly positioned
  const isExactRoot = pathname === "/";

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed inset-x-0 bottom-0 z-50 block md:hidden border-t border-[var(--line)] bg-[var(--canvas-2)]/95 backdrop-blur-xl shadow-2xl transition-all pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-2.5 glass-specular"
    >
      <div className="mx-auto flex max-w-md items-center justify-around px-2">
        {TABS.map((tab) => {
          const isActive =
            tab.href === "/" ? isExactRoot : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.label}
              href={tab.href}
              onClick={() => triggerHaptic("selection")}
              className={`pressable relative flex flex-1 flex-col items-center justify-center py-2 text-center transition-all min-h-[56px] ${
                isActive
                  ? "text-[var(--gold)] font-bold"
                  : "text-[var(--muted)] hover:text-[var(--ink)]"
              }`}
            >
              {/* Tab Icon */}
              <div className="relative">
                {tab.icon(isActive)}

                {/* Badge if any */}
                {tab.badge ? (
                  <span className="absolute -top-1.5 -right-3.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 px-1.5 py-0.2 text-[10px] font-black text-black uppercase tracking-wider shadow-sm">
                    {tab.badge}
                  </span>
                ) : null}
              </div>

              {/* Label */}
              <span className="mt-1 text-xs tracking-tight font-medium">{tab.label}</span>

              {/* Active Indicator Bar */}
              {isActive ? (
                <span className="absolute -bottom-1 h-0.5 w-7 rounded-full bg-[var(--gold)] shadow-[0_0_8px_var(--gold)]" />
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
