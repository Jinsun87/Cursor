"use client";

import { medalsPlated } from "@/lib/sitting";
import { LONGFORM_AD_EVERY } from "@/lib/economy";

export function CourseMedals({
  answered,
  total,
}: {
  answered: number;
  total: number;
}) {
  const courses = Math.ceil(total / LONGFORM_AD_EVERY);
  const plated = medalsPlated(answered, LONGFORM_AD_EVERY, total);
  const current = Math.min(Math.floor(answered / LONGFORM_AD_EVERY) + 1, courses);

  return (
    <div data-testid="course-medals" className="mb-4" aria-label="Course plates">
      <p className="mb-2 text-xs uppercase tracking-widest" style={{ color: "var(--muted)" }}>
        {plated === 0 ? "No plates yet" : `${plated} plated`}
        {plated < courses ? ` · now course ${current}` : " · kitchen closed"}
      </p>
      <ol className="flex flex-wrap gap-2">
        {Array.from({ length: courses }, (_, i) => {
          const n = i + 1;
          const done = n <= plated;
          return (
            <li key={n}>
              <span
                data-testid={`course-medal-${n}`}
                data-plated={done ? "true" : "false"}
                className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-full border px-2 text-xs"
                style={{
                  borderColor: done ? "var(--gold)" : "var(--line)",
                  background: done ? "var(--gold)" : "transparent",
                  color: done ? "var(--gold-ink)" : "var(--muted)",
                }}
              >
                {n}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
