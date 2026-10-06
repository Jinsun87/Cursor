import { HomePreview } from "./HomePreview";
import { GENESIS_1 } from "@/lib/daily-walk/genesis-1";
import { SLEEP_GENESIS_1 } from "@/lib/sleep/genesis-1";
import walkTiming from "@/public/daily-walk/genesis-1/timing.json";
import { dailyVersePool } from "@/lib/verse-of-day";

type Part = "morning" | "afternoon" | "evening" | "night";
type Tab = "walk" | "sleep" | "breathe";

/**
 * The home page: Today (greeting, verse for today, the lamp), Walk, Sleep and
 * Breathe, with today's content.
 */
export function SectionsHome({ forcedPart, forcedTab }: { forcedPart?: Part; forcedTab?: Tab }) {
  return (
    <HomePreview
      walk={GENESIS_1}
      walkTiming={walkTiming}
      sleep={SLEEP_GENESIS_1}
      dailyVerses={dailyVersePool()}
      forcedPart={forcedPart}
      forcedTab={forcedTab}
    />
  );
}
