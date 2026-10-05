import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { TodayHabitHub } from "@/components/home/TodayHabitHub";
import { DailyListens } from "@/components/home/DailyListens";

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
  return (
    <div className="space-y-12">
      {/* 1. Sacred Rituals Hub (Quote, Passage, Devotional, Prayer) */}
      <TodayHabitHub />

      {/* 2. Daily Listens: 1 min Spark, 2 min Prayer, 4 min Wisdom */}
      <DailyListens />
    </div>
  );
}
