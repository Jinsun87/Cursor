"use client";

interface Props {
  mode: "story" | "scroll";
  onChange: (mode: "story" | "scroll") => void;
}

export function ModeToggle({ mode, onChange }: Props) {
  return (
    <div className="inline-flex rounded-full border border-[var(--line)] bg-[var(--canvas-2)] p-1 text-xs shadow-inner">
      <button
        type="button"
        onClick={() => onChange("story")}
        className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-medium transition-all ${
          mode === "story"
            ? "bg-[var(--gold)] text-[var(--gold-ink)] shadow"
            : "text-[var(--muted)] hover:text-white"
        }`}
      >
        <span className="text-sm">⚡</span>
        <span>Story Reel</span>
      </button>
      <button
        type="button"
        onClick={() => onChange("scroll")}
        className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-medium transition-all ${
          mode === "scroll"
            ? "bg-[var(--gold)] text-[var(--gold-ink)] shadow"
            : "text-[var(--muted)] hover:text-white"
        }`}
      >
        <span className="text-sm">📜</span>
        <span>Full Chapter</span>
      </button>
    </div>
  );
}
