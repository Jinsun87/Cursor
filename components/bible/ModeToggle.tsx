"use client";

export type ReaderDisplayMode = "daily" | "story" | "scroll";

interface Props {
  mode: ReaderDisplayMode;
  onChange: (mode: ReaderDisplayMode) => void;
}

export function ModeToggle({ mode, onChange }: Props) {
  return (
    <div className="inline-flex rounded-full border border-[var(--line)] bg-[var(--canvas-2)] p-1 text-xs shadow-inner">
      <button
        type="button"
        onClick={() => onChange("daily")}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium transition-all ${
          mode === "daily"
            ? "bg-[var(--gold)] text-[var(--gold-ink)] font-bold shadow"
            : "text-[var(--muted)] hover:text-white"
        }`}
      >
        <span className="text-sm">🕊️</span>
        <span>Daily Walk</span>
      </button>
      <button
        type="button"
        onClick={() => onChange("story")}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium transition-all ${
          mode === "story"
            ? "bg-[var(--gold)] text-[var(--gold-ink)] font-bold shadow"
            : "text-[var(--muted)] hover:text-white"
        }`}
      >
        <span className="text-sm">⚡</span>
        <span>Reel</span>
      </button>
      <button
        type="button"
        onClick={() => onChange("scroll")}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium transition-all ${
          mode === "scroll"
            ? "bg-[var(--gold)] text-[var(--gold-ink)] font-bold shadow"
            : "text-[var(--muted)] hover:text-white"
        }`}
      >
        <span className="text-sm">📜</span>
        <span>Text</span>
      </button>
    </div>
  );
}

