"use client";

import Link from "next/link";

export function EbookRewardBanner({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`relative inline-flex items-center gap-2.5 rounded-full border border-amber-400/40 bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-amber-500/20 ${
        compact ? "px-3 py-1 text-[11px]" : "px-4 py-1.5 text-xs"
      } font-bold text-amber-300 shadow-md backdrop-blur overflow-hidden group animate-pulse`}
      style={{
        boxShadow: "0 0 15px rgba(245, 158, 11, 0.25)",
      }}
    >
      <span className="flex h-2 w-2 relative">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
      </span>

      <span>
        🎁 Get <strong className="text-white underline decoration-amber-400 font-black">70%+ score</strong> to unlock the <strong className="text-amber-200">Bible Foundations eBook</strong> ($29 value) <span className="bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase">FREE</span>!
      </span>

      <Link
        href="/ebooks/bible-foundations"
        className="text-[10px] text-amber-300 hover:text-white underline font-semibold ml-1 hidden sm:inline"
      >
        Preview eBook →
      </Link>
    </div>
  );
}
