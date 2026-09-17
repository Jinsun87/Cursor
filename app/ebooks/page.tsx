import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EBOOKS } from "@/lib/ebooks/catalog";

export const metadata: Metadata = {
  title: "Scripture & Study eBooks — Lampstand Library",
  description:
    "Free, in-depth illustrated Scripture study guides, 100-fact reference handbooks, and biblical geography companions.",
};

export default function EbooksIndexPage() {
  return (
    <div className="space-y-8">
      <div className="border-b pb-6" style={{ borderColor: "var(--line)" }}>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">
          Digital Library
        </span>
        <h1 className="mt-1 font-display text-3xl md:text-4xl">Scripture Study Guides & eBooks</h1>
        <p className="mt-2 text-sm text-[var(--muted)] max-w-2xl">
          Illustrated reference handbooks, 100-fact guides, and study companions designed to help you know the text. Free for all Lampstand readers and completion reward earners.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {EBOOKS.map((ebook) => (
          <div
            key={ebook.slug}
            className="group flex flex-col sm:flex-row gap-5 rounded-2xl border p-6 transition-all shadow-sm hover:shadow-md"
            style={{ borderColor: "var(--line)", background: "var(--canvas-2)" }}
          >
            <div className="relative w-32 h-44 shrink-0 mx-auto sm:mx-0 rounded-xl overflow-hidden shadow-lg border border-amber-500/20">
              <Image
                src={ebook.coverImage}
                alt={ebook.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="flex-1 flex flex-col justify-between text-center sm:text-left">
              <div>
                <span className="inline-block rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  {ebook.chapters.reduce((acc, ch) => acc + ch.facts.length, 0)} Facts • {ebook.readingTimeMinutes} min read
                </span>
                <h2 className="mt-2 font-display text-xl font-bold group-hover:text-emerald-500 transition-colors">
                  {ebook.title}
                </h2>
                <p className="text-xs font-medium text-[var(--muted)] mt-1">{ebook.subtitle}</p>
                <p className="mt-3 text-xs text-[var(--muted)] line-clamp-3 leading-relaxed">
                  {ebook.description}
                </p>
              </div>

              <div className="mt-5">
                <Link
                  href={`/ebooks/${ebook.slug}`}
                  className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-emerald-500 transition-colors"
                >
                  📖 Open Interactive eBook →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
