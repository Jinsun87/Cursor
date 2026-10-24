"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/lib/store";
import { isPaddleConfigured, openPaddleCheckout } from "@/lib/paddle/client";
import { FOUNDING_PRICE } from "@/lib/founding";
import { SLEEP_CHAPTERS, WALK_SECONDS } from "@/lib/sleep/chapters";
import { useSleepAudio, type ReadingMode } from "@/lib/sleep/sleep-audio";
import { chapterSlug, voiceIsFree } from "@/lib/plan/books";
import { describeReadings, friendlyDate, type PlanDay, type Reading } from "@/lib/plan/build";
import { daysOf, readSavedPlan, subscribePlan, writeSavedPlan, type PlanPlace, type SavedPlan } from "@/lib/plan/storage";
import "@/components/sleep/sleep.css";
import "./plan.css";

type Verse = { n: number; text: string };

/** After checkout Paddle sends people back here; its webhook usually lands a few seconds later. */
const POLL_MS = 2000;
const GIVE_UP_MS = 90_000;

/** A whole number from the query string, or null when absent or not a number. */
function intParam(value: string | null): number | null {
  if (value === null || value.trim() === "") return null;
  const n = Number(value);
  return Number.isInteger(n) ? n : null;
}

export function PlanReader() {
  const router = useRouter();
  const params = useSearchParams();
  const { user, ready: accountReady, refreshAccount } = useApp();
  const audio = useSleepAudio();
  const [plan, setPlan] = useState<SavedPlan | null>(null);
  const [days, setDays] = useState<PlanDay[]>([]);
  const [verses, setVerses] = useState<Verse[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [unlock, setUnlock] = useState<ReadingMode | null>(null);
  const [billing, setBilling] = useState<"monthly" | "annual">("annual");
  const [busy, setBusy] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [activationSlow, setActivationSlow] = useState(false);

  useEffect(() => {
    const saved = readSavedPlan();
    if (!saved) {
      router.replace("/plan");
      return;
    }
    setPlan(saved);
    setDays(daysOf(saved));
  }, [router]);

  // A sync from the reader's other device can bring newer progress while this page is open.
  useEffect(
    () =>
      subscribePlan(() => {
        const saved = readSavedPlan();
        if (saved) {
          setPlan(saved);
          setDays(daysOf(saved));
        }
      }),
    [],
  );

  // Out-of-range or garbled links open the nearest real day rather than hanging.
  const lastDay = Math.max(0, days.length - 1);
  const dayIndex = Math.min(lastDay, Math.max(0, intParam(params.get("day")) ?? plan?.place.day ?? 0));
  const day = days[dayIndex];
  const partIndex = Math.min(Math.max(0, (day?.readings.length ?? 1) - 1), Math.max(0, intParam(params.get("part")) ?? 0));
  const reading: Reading | undefined = day?.readings[partIndex];
  const premium = Boolean(user?.premium);
  const paid = params.get("paid") === "1";

  useEffect(() => {
    if (!reading) return;
    let live = true;
    setVerses(null);
    setError(null);
    fetch(`/api/plan/chapter?book=${encodeURIComponent(reading.book)}&chapter=${reading.chapter}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("missing");
        return res.json() as Promise<{ verses: Verse[] }>;
      })
      .then((body) => {
        if (live) setVerses(body.verses);
      })
      .catch(() => {
        if (live) setError("This chapter could not be opened.");
      });
    return () => {
      live = false;
    };
  }, [reading?.book, reading?.chapter]);

  // Back from sign-up with a voice chosen: offer Premium straight away, unless it is already on.
  useEffect(() => {
    const voice = params.get("voice");
    if (!plan || !user || paid || (voice !== "walk" && voice !== "sleep")) return;
    if (!user.premium) setUnlock(voice);
  }, [params, plan, user, paid]);

  // Back from checkout: wait for Premium to switch on.
  useEffect(() => {
    if (!paid || !accountReady || !user || premium) return;
    const started = Date.now();
    const timer = setInterval(() => {
      if (Date.now() - started > GIVE_UP_MS) {
        setActivationSlow(true);
        clearInterval(timer);
        return;
      }
      void refreshAccount();
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [paid, accountReady, user, premium, refreshAccount]);

  function remember(place: PlanPlace, done = plan?.done ?? []) {
    if (!plan) return;
    const next = { ...plan, done, place };
    writeSavedPlan(next);
    setPlan(next);
  }

  function markRead() {
    if (!plan || !day) return;
    if (partIndex < day.readings.length - 1) {
      remember({ day: dayIndex, part: partIndex + 1, verse: 1 });
      router.push(`/plan/read?day=${dayIndex}&part=${partIndex + 1}`);
      return;
    }
    const done = [...new Set([...plan.done, day.index])];
    const nextDay = Math.min(days.length - 1, day.index + 1);
    remember({ day: nextDay, part: 0, verse: 1 }, done);
    router.push(nextDay === day.index ? "/plan" : `/plan/read?day=${nextDay}`);
  }

  const slug = reading ? chapterSlug(reading.book, reading.chapter) : "";
  const recorded = SLEEP_CHAPTERS.find((c) => c.slug === slug);
  const walkReady = Boolean(recorded) && (WALK_SECONDS[slug] ?? 0) > 0;
  const sleepReady = Boolean(recorded);
  // The same rule as the Walk and Sleep tabs: Genesis is free, other books need Premium.
  const free = reading ? voiceIsFree(reading.book) : false;
  const canPlay = free || premium;
  const placeVerse = plan?.place.day === dayIndex && plan.place.part === partIndex ? plan.place.verse : 1;

  function choose(mode: ReadingMode) {
    if (!reading || !recorded) return;
    if (!(mode === "walk" ? walkReady : sleepReady)) return;
    if (canPlay) {
      audio.open(recorded, { mode, verse: placeVerse });
      return;
    }
    const back = `/plan/read?day=${dayIndex}&part=${partIndex}&voice=${mode}`;
    if (!user) {
      router.push(`/register?next=${encodeURIComponent(back)}`);
      return;
    }
    setPayError(null);
    setUnlock(mode);
  }

  async function pay() {
    if (!user) return;
    const priceId =
      billing === "monthly" ? process.env.NEXT_PUBLIC_PADDLE_MONTHLY_PRICE_ID : process.env.NEXT_PUBLIC_PADDLE_ANNUAL_PRICE_ID;
    if (!isPaddleConfigured() || !priceId) {
      setPayError("Payments are not available yet. Please check back soon.");
      return;
    }
    setBusy(true);
    const opened = await openPaddleCheckout({
      priceId,
      customerEmail: user.email,
      customData: { userId: user.id, userEmail: user.email, plan: billing },
      successUrl: `${window.location.origin}/plan/read?day=${dayIndex}&part=${partIndex}&paid=1`,
      onError: () => {
        setPayError("Failed to open Paddle Checkout. Please try again.");
        setBusy(false);
      },
    });
    if (!opened) {
      setBusy(false);
      setPayError("Could not open checkout. Please try again in a moment.");
    }
  }

  if (!day || !reading) {
    return (
      <div className="sf" role="dialog" aria-label="Reading plan">
        <p className="plan-read-note">Opening your plan…</p>
      </div>
    );
  }

  const image = recorded?.verses[0]?.image ?? "/images/stories/genesis-1/s2.jpg";
  const voiceLabel = (mode: ReadingMode, ready: boolean) => {
    const name = mode === "walk" ? "Walk" : "Sleep";
    if (!ready) return `${name} not recorded yet`;
    return canPlay ? `Play ${name}` : `Unlock ${name}`;
  };
  const note = paid
    ? premium
      ? "Premium is on. Tap Walk or Sleep to listen."
      : activationSlow
        ? "Payment received. Premium usually switches on within a minute; check your profile shortly."
        : "Confirming your payment…"
    : !sleepReady
      ? `${reading.book} is not recorded yet. The text is here to read, free.`
      : canPlay
        ? free && !premium
          ? `${reading.book} is free to hear: Walk by day, Sleep by night.`
          : "Your voices are on. Walk is the daytime reading; Sleep is the same chapter at night."
        : `${describeReadings(day)}. The text is free; hearing ${reading.book} read aloud comes with Premium.`;
  const lifetimeReady = Boolean(process.env.NEXT_PUBLIC_PADDLE_LIFETIME_PRICE_ID);

  return (
    <div className="sf" role="dialog" aria-label={`${reading.book} ${reading.chapter}, reading`}>
      <div className="sf-backdrop is-dim" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="" className="is-on" />
        <div className="sf-veil" />
      </div>
      <header className="sf-top">
        <button type="button" className="sf-icon" aria-label="Back to the plan" onClick={() => router.push("/plan")}>
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <div className="sf-modes" role="group" aria-label="Chapters today">
          {day.readings.length > 1 ? (
            <span>
              {partIndex + 1} of {day.readings.length}
            </span>
          ) : (
            <span>{friendlyDate(day.date)}</span>
          )}
        </div>
        {partIndex < day.readings.length - 1 ? (
          <button
            type="button"
            className="sf-icon"
            aria-label="Next chapter today"
            onClick={() => {
              remember({ day: dayIndex, part: partIndex + 1, verse: 1 });
              router.push(`/plan/read?day=${dayIndex}&part=${partIndex + 1}`);
            }}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
              <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        ) : (
          <span />
        )}
      </header>

      <div className="sf-read">
        <article className="sf-page">
          <p className="sf-eyebrow">{reading.book}</p>
          <h2 className="sf-chapter">Chapter {reading.chapter}</h2>
          {error ? <p>{error}</p> : null}
          {(verses ?? []).map((verse) => (
            <span
              key={verse.n}
              role="button"
              tabIndex={0}
              data-verse={verse.n}
              className={`sf-rv${verse.n === placeVerse ? " is-current" : ""}${verse.n < placeVerse ? " is-past" : ""}`}
              onClick={() => remember({ day: dayIndex, part: partIndex, verse: verse.n })}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") remember({ day: dayIndex, part: partIndex, verse: verse.n });
              }}
            >
              <sup>{verse.n}</sup>
              {verse.text}{" "}
            </span>
          ))}
          <p className="sf-credit">Scripture quotations are from the Berean Standard Bible.</p>
        </article>
      </div>

      <footer className="sf-bottom">
        <div className="plan-voices">
          <button type="button" className="plan-voice" disabled={!walkReady} onClick={() => choose("walk")}>
            {voiceLabel("walk", walkReady)}
          </button>
          <button type="button" className="plan-voice sleep" disabled={!sleepReady} onClick={() => choose("sleep")}>
            {voiceLabel("sleep", sleepReady)}
          </button>
        </div>
        <p className="plan-read-note">{note}</p>
        <button type="button" className="plan-mark" onClick={markRead}>
          {partIndex < day.readings.length - 1 ? "Next chapter" : plan?.done.includes(day.index) ? "Read · next day" : "I've read this"}
        </button>
      </footer>

      {unlock ? (
        <div className="sf-sheet-wrap" onClick={() => setUnlock(null)}>
          <div className="sf-sheet" role="dialog" aria-label="Unlock the voice" onClick={(e) => e.stopPropagation()}>
            <div className="sf-sheet-head">
              <h2>
                {unlock === "walk" ? "Walk" : "Sleep"} for {reading.book} {reading.chapter}
              </h2>
              <button type="button" className="sf-icon" aria-label="Close" onClick={() => setUnlock(null)}>
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <p>
              {unlock === "walk" ? "A clear daytime reading of this chapter." : "The same chapter, read slowly for the night."}{" "}
              Genesis is free to hear; other books come with Premium, which includes both voices.
            </p>
            <div className="sf-chips" role="group" aria-label="Billing">
              <button type="button" aria-pressed={billing === "annual"} onClick={() => setBilling("annual")}>
                $39.99/yr
              </button>
              <button type="button" aria-pressed={billing === "monthly"} onClick={() => setBilling("monthly")}>
                $4.99/mo
              </button>
            </div>
            <p className="plan-sheet-note">Both start with 7 days free. Cancel any time before then and you pay nothing.</p>
            {payError ? <p>{payError}</p> : null}
            <button type="button" className="plan-voice" disabled={busy} onClick={() => void pay()}>
              {busy ? "Opening checkout…" : "Start 7 days free"}
            </button>
            {lifetimeReady ? (
              <Link className="plan-sheet-link" href="/pricing?plan=lifetime">
                Or become a founding member: ${FOUNDING_PRICE} once, Pro for life
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
