import { HomePreview } from "./HomePreview";
import { GENESIS_1 } from "@/lib/daily-walk/genesis-1";
import { SLEEP_GENESIS_1 } from "@/lib/sleep/genesis-1";
import walkTiming from "@/public/daily-walk/genesis-1/timing.json";

type Part = "morning" | "afternoon" | "evening" | "night";
type Tab = "walk" | "sleep" | "breathe";

/**
 * The four-section home with today's content. Used by /home-preview now, and by
 * "/" once NEXT_PUBLIC_NEW_NAV is switched on.
 */
export function SectionsHome({ forcedPart, forcedTab }: { forcedPart?: Part; forcedTab?: Tab }) {
  return (
    <HomePreview
      walk={GENESIS_1}
      walkTiming={walkTiming}
      sleep={SLEEP_GENESIS_1}
      forcedPart={forcedPart}
      forcedTab={forcedTab}
    />
  );
}
