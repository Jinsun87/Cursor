"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { WalkEpisode } from "@/lib/daily-walk/types";
import type { ClipTiming } from "@/lib/daily-walk/timeline";
import type { SleepChapter } from "@/lib/sleep/types";
import { Lamp } from "./Lamp";
import { BreathePanel } from "./BreathePanel";
import { SleepPlayer } from "./SleepPlayer";
import { WalkPanel } from "./WalkPanel";
import { useListening } from "./useListening";
import { sectionFromUrl, setSection, useSection } from "@/lib/section-store";
import "./home2.css";

type Tab = "walk" | "sleep" | "breathe";
type Part = "morning" | "afternoon" | "evening" | "night";

function partOfDay(hour: number): Part {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

const COPY: Record<Part, { greeting: string; line: string }> = {
  morning: { greeting: "Good morning", line: "Begin the day with God's word." },
  afternoon: { greeting: "Good afternoon", line: "Pause for a few quiet minutes in Scripture." },
  evening: { greeting: "Good evening", line: "Let the day settle. Rest in God's word tonight." },
  night: { greeting: "Peace to you tonight", line: "Lie down, close your eyes, and let Scripture be read over you." },
};

/**
 * The four-section home: Today (greeting, lamp, and the panels below), Walk,
 * Sleep and Breathe. The page follows the time of day: light with Walk first in
 * the day, dark with Sleep first at night. The lamp is the single streak. The
 * chosen section is shared with the bottom bar and kept in the address (?tab=).
 */
export function HomePreview({
  walk,
  walkTiming,
  sleep,
  forcedPart,
  forcedTab,
}: {
  walk: WalkEpisode;
  walkTiming: ClipTiming;
  sleep: SleepChapter;
  forcedPart?: Part;
  forcedTab?: Tab;
}) {
  const [part, setPart] = useState<Part>(forcedPart ?? "evening");
  const [tab, setTab] = useState<Tab>(forcedTab ?? "walk");
  const [ready, setReady] = useState(false);
  const listening = useListening();
  const section = useSection();

  // Decide on the client so the page matches the reader's own clock.
  useEffect(() => {
    const p = forcedPart ?? partOfDay(new Date().getHours());
    const fromUrl = sectionFromUrl();
    const wanted = forcedTab ?? (fromUrl && fromUrl !== "today" ? fromUrl : null);
    setPart(p);
    setTab(wanted ?? (p === "evening" || p === "night" ? "sleep" : "walk"));
    setSection(wanted ?? "today", { updateUrl: false });
    setReady(true);
  }, [forcedPart, forcedTab]);

  // The bottom bar or header picked a section: show it here.
  useEffect(() => {
    if (section !== "today") setTab(section);
  }, [section]);

  const choose = (next: Tab) => {
    setTab(next);
    setSection(next);
  };

  const dark = part === "evening" || part === "night";
  const copy = COPY[part];

  return (
    <section className={`h2 ${dark ? "h2-night" : "h2-day"}${ready ? " is-ready" : ""}`}>
      <div className="h2-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="h2-hero-art"
          src={dark ? "/images/stories/genesis-1/s1.jpg" : "/images/stories/genesis-1/s2.jpg"}
          alt=""
        />
        <div className="h2-hero-veil" />
        {dark ? <Stars /> : null}
        <div className="h2-hero-inner">
          <div className="h2-hello">
            <p className="h2-greeting">{copy.greeting}</p>
            <h1 className="h2-headline">{copy.line}</h1>
            <p className="h2-sub">Walk with Scripture by day. Rest in it by night.</p>
          </div>
          <Lamp
            progress={listening.progress}
            streak={listening.streak}
            minutesToday={listening.secondsToday / 60}
            goalMinutes={listening.goalSeconds / 60}
          />
        </div>
      </div>

      <div className="h2-tabs" id="sections" role="tablist" aria-label="Sections">
        <button type="button" role="tab" aria-selected={tab === "walk"} onClick={() => choose("walk")}>
          <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
            <circle cx="12" cy="12" r="4.5" fill="currentColor" />
            <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" />
            </g>
          </svg>
          <span>
            <strong>Walk</strong>
            <small>Guided · 10 or 20 min</small>
          </span>
        </button>
        <button type="button" role="tab" aria-selected={tab === "sleep"} onClick={() => choose("sleep")}>
          <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
            <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" fill="currentColor" />
          </svg>
          <span>
            <strong>Sleep</strong>
            <small>Whole chapters, read softly</small>
          </span>
        </button>
        <button type="button" role="tab" aria-selected={tab === "breathe"} onClick={() => choose("breathe")}>
          <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
            <circle cx="12" cy="12" r="4" fill="currentColor" />
            <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.6" opacity="0.6" />
          </svg>
          <span>
            <strong>Breathe</strong>
            <small>1 to 5 minutes</small>
          </span>
        </button>
      </div>

      <div className="h2-panel" role="tabpanel">
        {tab === "walk" ? (
          <WalkPanel
            episode={walk}
            timing={walkTiming}
            title="The Creation of the Cosmos"
            reference="Genesis 1"
            cover="/images/stories/genesis-1/s2.jpg"
            onContinueToChapter={() => choose("sleep")}
          />
        ) : tab === "sleep" ? (
          <SleepPlayer chapter={sleep} />
        ) : (
          <BreathePanel />
        )}
      </div>

      <div className="h2-foot">
        <Link href="/daily" className="h2-quiz">
          Prefer a quick quiz? Try today&apos;s ten Bible questions →
        </Link>
        <div className="h2-preview-switch" aria-label="Preview the time of day">
          <span>Preview:</span>
          {(["morning", "evening"] as const).map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={p === "morning" ? !dark : dark}
              onClick={() => {
                setPart(p);
                choose(p === "evening" ? "sleep" : "walk");
              }}
            >
              {p === "morning" ? "Daytime" : "Night"}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/** A few slow-twinkling stars for the night sky. Positions are fixed so they never jump. */
function Stars() {
  const stars = [
    [8, 14, 1.2],
    [18, 32, 0.8],
    [27, 9, 1],
    [36, 24, 0.7],
    [44, 6, 1.1],
    [52, 30, 0.9],
    [61, 12, 1.3],
    [70, 26, 0.8],
    [79, 8, 1],
    [88, 20, 1.2],
    [93, 36, 0.7],
    [14, 44, 0.9],
    [66, 40, 0.8],
    [40, 46, 1],
  ];
  return (
    <svg className="h2-stars" viewBox="0 0 100 50" preserveAspectRatio="none" aria-hidden="true">
      {stars.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r * 0.22} style={{ animationDelay: `${(i % 7) * 0.9}s` }} />
      ))}
    </svg>
  );
}
