export function BibleChapterSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 animate-pulse">
      {/* Top Header Bar Skeleton */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] pb-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-20 rounded-md bg-[var(--line)]" />
          <span className="text-[var(--muted)]">/</span>
          <div className="h-6 w-28 rounded-md bg-[var(--gold)]/20" />
          <div className="h-4 w-32 rounded-md bg-[var(--line)]" />
        </div>

        {/* Mode Toggle Skeleton */}
        <div className="h-10 w-48 rounded-2xl bg-[var(--canvas-2)] border border-[var(--line)]" />
      </div>

      {/* Pastoral Audio Banner Skeleton */}
      <div className="mb-6 rounded-3xl border border-[var(--line)] bg-[var(--canvas-2)] p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[var(--gold)]/10" />
            <div className="space-y-1.5">
              <div className="h-4 w-40 rounded bg-[var(--line)]" />
              <div className="h-3 w-56 rounded bg-[var(--line)]/60" />
            </div>
          </div>
          <div className="h-9 w-28 rounded-xl bg-[var(--gold)]/20" />
        </div>
      </div>

      {/* Main Reader Stage Container Skeleton */}
      <div className="relative mx-auto max-w-xl min-h-[580px] rounded-3xl border border-[var(--line)] bg-[var(--canvas-2)] p-6 sm:p-8 flex flex-col justify-between shadow-xl">
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
          <div className="flex gap-2">
            <div className="h-6 w-16 rounded-full bg-[var(--gold)]/20" />
            <div className="h-6 w-16 rounded-full bg-[var(--line)]" />
            <div className="h-6 w-16 rounded-full bg-[var(--line)]" />
          </div>
          <div className="h-6 w-8 rounded-full bg-[var(--line)]" />
        </div>

        <div className="my-auto py-10 text-center space-y-4 max-w-md mx-auto">
          <div className="h-8 w-8 mx-auto rounded-full bg-[var(--gold)]/20" />
          <div className="h-6 w-3/4 mx-auto rounded bg-[var(--line)]" />
          <div className="h-6 w-1/2 mx-auto rounded bg-[var(--line)]" />
          <div className="h-4 w-1/3 mx-auto rounded bg-[var(--gold)]/30 mt-4" />
        </div>

        <div className="h-12 w-full rounded-2xl bg-[var(--gold)]/30" />
      </div>
    </div>
  );
}
