import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { TodayHabitHub } from "@/components/home/TodayHabitHub";
import { DailyListens } from "@/components/home/DailyListens";
import { SectionsHome } from "@/components/home2/SectionsHome";
import { NEW_NAV_ENABLED } from "@/lib/nav";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Lampstand — Know the text.",
    description:
      "Daily Bible reading, Scripture quizzes and short audio reflections, written for steady, unhurried study. Independent and not affiliated with any denomination.",
    path: "/",
  }),
  title: { absolute: "Lampstand — Know the text." },
};

export default function HomePage() {
  // Switched on with NEXT_PUBLIC_NEW_NAV=true: the four-section home replaces this page.
  if (NEW_NAV_ENABLED) return <SectionsHome />;

  return (
    <div className="space-y-12">
      {/* 1. Sacred Rituals Hub (Quote, Passage, Devotional, Prayer) */}
      <TodayHabitHub />

      {/* 2. Daily Listens: 1 min Spark, 2 min Prayer, 4 min Wisdom */}
      <DailyListens />
    </div>
  );
}
