"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { getSeries } from "@/lib/catalog";
import { useApp } from "@/lib/store";

export default function CertificatePage() {
  const params = useParams<{ seriesSlug: string }>();
  const series = getSeries(params.seriesSlug);
  const { user, seriesProgress } = useApp();

  if (!series) return <p>Unknown pack.</p>;
  const progress = seriesProgress(series.slug);
  const unlocked = Boolean(user && progress.mastered);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-3xl border-2 border-gold-400/70 bg-pine-900 p-10 text-center shadow-[0_0_80px_rgba(232,197,71,0.12)]">
        <p className="text-xs uppercase tracking-[0.4em] text-gold-400">Certificate of Mastery</p>
        <h1 className="mt-4 font-display text-4xl">{series.title}</h1>
        {unlocked ? (
          <>
            <p className="mt-6 text-lg">This certifies that</p>
            <p className="mt-2 font-display text-3xl text-gold-400">{user!.username}</p>
            <p className="mt-4 text-parchment/75">
              completed every quiz in the pack and scored {progress.reviewBest}% on
              the review (70% required).
            </p>
          </>
        ) : (
          <p className="mt-6 text-parchment/75">
            Complete the pack and pass the review to issue this certificate to your
            profile.
          </p>
        )}
        <p className="mt-8 font-display text-sm text-pine-400">QuizForge Mind Gym</p>
      </div>
      <p className="mt-6 text-center">
        <Link href={`/series/${series.slug}`} className="text-gold-400">
          Return to pack
        </Link>
      </p>
    </div>
  );
}
