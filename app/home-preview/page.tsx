import type { Metadata } from "next";
import { SectionsHome } from "@/components/home2/SectionsHome";

// Prototype of the four-section home (Today, Walk, Sleep, Breathe). Placeholder voices.
export const metadata: Metadata = {
  title: "Home preview",
  robots: { index: false, follow: false },
};

type Part = "morning" | "afternoon" | "evening" | "night";
type Tab = "walk" | "sleep" | "breathe";
const PARTS: Part[] = ["morning", "afternoon", "evening", "night"];

export default async function HomePreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ time?: string; tab?: string }>;
}) {
  const { time, tab } = await searchParams;
  return (
    <SectionsHome
      forcedPart={PARTS.includes(time as Part) ? (time as Part) : undefined}
      forcedTab={tab === "walk" || tab === "sleep" || tab === "breathe" ? (tab as Tab) : undefined}
    />
  );
}
