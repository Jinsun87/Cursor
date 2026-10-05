import type { Section } from "@/lib/nav";

/** Simple, bold icons for the four sections and More, readable at a glance. */
export function SectionIcon({ name, active = false }: { name: Section | "more"; active?: boolean }) {
  const common = { width: 26, height: 26, viewBox: "0 0 24 24", "aria-hidden": true } as const;
  const stroke = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: active ? 2 : 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "today":
      // A small oil lamp: the streak lives on Today.
      return (
        <svg {...common}>
          <path
            d="M4 15c0-2.5 3.5-3.5 7-3.5 3 0 4.6.6 5.8 1.6.7.6.7 1.5 0 2-1.7 1.3-4.3 2-5.8 2C7 17.1 4 16.8 4 15Z"
            {...stroke}
          />
          <path d="M8 19.5h8" {...stroke} />
          <path d="M17.6 11.7c-1.2-1.4-1-3.4 0-5.2 1 1.8 1.2 3.8 0 5.2Z" fill="currentColor" />
        </svg>
      );
    case "walk":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4" {...stroke} fill={active ? "currentColor" : "none"} />
          <path
            d="M12 2.8v2.2M12 19v2.2M2.8 12H5M19 12h2.2M5.5 5.5l1.6 1.6M16.9 16.9l1.6 1.6M5.5 18.5l1.6-1.6M16.9 7.1l1.6-1.6"
            {...stroke}
          />
        </svg>
      );
    case "sleep":
      return (
        <svg {...common}>
          <path
            d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"
            {...stroke}
            fill={active ? "currentColor" : "none"}
          />
        </svg>
      );
    case "breathe":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3.5" {...stroke} fill={active ? "currentColor" : "none"} />
          <circle cx="12" cy="12" r="8.5" {...stroke} opacity="0.6" />
        </svg>
      );
    case "more":
      return (
        <svg {...common}>
          <circle cx="5.5" cy="12" r="1.7" fill="currentColor" />
          <circle cx="12" cy="12" r="1.7" fill="currentColor" />
          <circle cx="18.5" cy="12" r="1.7" fill="currentColor" />
        </svg>
      );
  }
}

export const SECTION_LABELS: Record<Section, string> = {
  today: "Today",
  walk: "Walk",
  sleep: "Sleep",
  breathe: "Breathe",
};
