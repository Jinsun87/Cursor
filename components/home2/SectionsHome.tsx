import { HomePreview } from "./HomePreview";
import { SLEEP_CHAPTERS, SLEEP_SECONDS, WALK_SECONDS } from "@/lib/sleep/chapters";
import { dailyVersePool } from "@/lib/verse-of-day";

type Part = "morning" | "afternoon" | "evening" | "night";
type Tab = "walk" | "sleep" | "breathe";

/**
 * The home page: Today (greeting, verse for today, the lamp), Walk and Sleep
 * (the same chapters, read briskly by day and softly by night) and Breathe.
 */
export function SectionsHome({ forcedPart, forcedTab }: { forcedPart?: Part; forcedTab?: Tab }) {
  return (
    <HomePreview
      walkChapters={SLEEP_CHAPTERS.filter((c) => WALK_SECONDS[c.slug] > 0)}
      walkSeconds={WALK_SECONDS}
      sleepChapters={SLEEP_CHAPTERS}
      sleepSeconds={SLEEP_SECONDS}
      dailyVerses={dailyVersePool()}
      forcedPart={forcedPart}
      forcedTab={forcedTab}
    />
  );
}
