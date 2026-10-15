"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useSleepAudio } from "@/lib/sleep/sleep-audio";
import { SLEEP_CHAPTERS, SLEEP_SECONDS, WALK_SECONDS } from "@/lib/sleep/chapters";
import { useListening } from "@/components/home2/useListening";
import { readOnboarding, saveOnboarding, startTab, type Intent, type ListenWhen, type OnboardingAnswers } from "@/lib/onboarding";
import { setSection } from "@/lib/section-store";
import { trackEvent } from "@/lib/analytics";
import { FOUNDING_CAP, FOUNDING_PRICE, chaptersFundedPerMember, membersToFundBible } from "@/lib/founding";
import { useFoundingSpots } from "@/components/founding/useFoundingSpots";
import "./onboarding.css";

type Step = "intent" | "when" | "name" | "reader" | "sound" | "moment" | "lamp" | "why" | "offer" | "install";

const INTENTS: { id: Intent; title: string; note: string }[] = [
  { id: "sleep", title: "Trouble sleeping", note: "Quiet a racing mind and drift off" },
  { id: "anxious", title: "An anxious heart", note: "Find peace when worry will not stop" },
  { id: "read", title: "Read the Bible through", note: "A chapter a day, start to finish" },
  { id: "closer", title: "Grow closer to God", note: "Let His word fill your days and nights" },
  { id: "hard", title: "A hard season", note: "Comfort for grief or a heavy time" },
];

const WHEN: { id: ListenWhen; title: string; note: string }[] = [
  { id: "walk", title: "On a walk or a commute", note: "A clear, brisk reading by day" },
  { id: "sleep", title: "In bed at night", note: "Read softly as you fall asleep" },
  { id: "both", title: "Both", note: "Your place is shared between day and night" },
];

// Captured as early as possible: Chrome fires this once, often before onboarding mounts.
type InstallPrompt = Event & { prompt: () => Promise<void> };
let installPrompt: InstallPrompt | null = null;
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    installPrompt = e as InstallPrompt;
  });
}
const isIos = () => typeof navigator !== "undefined" && /iphone|ipad|ipod/i.test(navigator.userAgent);
const isInstalled = () => typeof window !== "undefined" && window.matchMedia?.("(display-mode: standalone)").matches;

/**
 * First visit to the home screen: a few questions, the reader's voice, then a
 * real first moment of Scripture before anything is asked of them. Honest by
 * design: no invented numbers, no fake discounts, and "Continue free" is a
 * real button. Every step can be skipped.
 */
export function Onboarding({ onDone }: { onDone: () => void }) {
  const s = useSleepAudio();
  const listening = useListening();
  const [a, setA] = useState<OnboardingAnswers>(() => readOnboarding());
  const [stepIndex, setStepIndex] = useState(0);
  const [nameDraft, setNameDraft] = useState(a.name ?? "");
  const genesis1 = SLEEP_CHAPTERS[0];

  const steps = useMemo<Step[]>(() => {
    const list: Step[] = ["intent", "when", "name", "reader"];
    if (a.when !== "walk") list.push("sound");
    list.push("moment", "lamp", "why", "offer");
    if (!isInstalled() && (installPrompt || isIos())) list.push("install");
    return list;
  }, [a.when]);
  const step = steps[stepIndex];

  useEffect(() => {
    trackEvent("onboarding_step", { step, index: stepIndex });
  }, [step, stepIndex]);

  // The page behind stays still while onboarding is open.
  useEffect(() => {
    const html = document.documentElement;
    const before = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = before;
    };
  }, []);

  const update = (patch: Partial<OnboardingAnswers>) => {
    setA((x) => ({ ...x, ...patch }));
    saveOnboarding(patch);
  };
  const next = () => (stepIndex + 1 < steps.length ? setStepIndex(stepIndex + 1) : finish());
  const back = () => setStepIndex(Math.max(0, stepIndex - 1));
  const finish = (skipped = false) => {
    saveOnboarding({ done: true });
    trackEvent(skipped ? "onboarding_skipped" : "onboarding_complete", { step, intent: a.intent, when: a.when });
    setSection(startTab(a));
    onDone();
  };
  const hello = a.name ? `, ${a.name}` : "";
  const mode = a.when === "walk" ? "walk" : "sleep";

  // Rendered at the page root, so no parent's overflow or transform can clip the full screen.
  return createPortal(
    <div className="ob" role="dialog" aria-modal="true" aria-label="Welcome to Lampstand">
      <div className="ob-stars" aria-hidden="true" />
      <header className="ob-top">
        {stepIndex > 0 ? (
          <button type="button" className="ob-link" onClick={back}>
            ← Back
          </button>
        ) : (
          <span />
        )}
        <ol className="ob-dots" aria-label={`Step ${stepIndex + 1} of ${steps.length}`}>
          {steps.map((x, i) => (
            <li key={x} className={i === stepIndex ? "is-on" : i < stepIndex ? "is-done" : ""} />
          ))}
        </ol>
        <button type="button" className="ob-link" onClick={() => finish(true)}>
          Skip
        </button>
      </header>

      <main className="ob-body" key={step}>
        {step === "intent" ? (
          <>
            <p className="ob-eyebrow">Psalm 119:105</p>
            <h1>A lamp to my feet, a light to my path.</h1>
            <p className="ob-sub">Welcome to Lampstand. What brings you here?</p>
            <Choices
              items={INTENTS}
              value={a.intent}
              onPick={(id) => {
                update({ intent: id as Intent });
                setTimeout(next, 250);
              }}
            />
            <button type="button" className="ob-quiet" onClick={() => (update({ intent: "looking" }), next())}>
              Just looking around
            </button>
          </>
        ) : null}

        {step === "when" ? (
          <>
            <h1>When will you listen?</h1>
            <p className="ob-sub">The same chapters, read two ways. You can switch any time.</p>
            <Choices
              items={WHEN}
              value={a.when}
              onPick={(id) => {
                update({ when: id as ListenWhen });
                setTimeout(next, 250);
              }}
            />
          </>
        ) : null}

        {step === "name" ? (
          <>
            <h1>What should we call you?</h1>
            <p className="ob-sub">Optional. Your first name stays on this device.</p>
            <form
              className="ob-form"
              onSubmit={(e) => {
                e.preventDefault();
                update({ name: nameDraft.trim().slice(0, 40) || undefined });
                next();
              }}
            >
              <input
                type="text"
                autoComplete="given-name"
                placeholder="First name"
                aria-label="First name"
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
              />
              <button type="submit" className="ob-primary">
                {nameDraft.trim() ? "Continue" : "Skip this"}
              </button>
            </form>
          </>
        ) : null}

        {step === "reader" ? <ReaderStep when={a.when ?? "both"} onNext={next} /> : null}

        {step === "sound" ? (
          <>
            <h1>A sound to rest beneath</h1>
            <p className="ob-sub">For Sleep. You can change this any time in Options.</p>
            <Choices
              items={[
                { id: "rain", title: "Soft rain", note: "A quiet rain under the voice" },
                { id: "silence", title: "Silence", note: "Only the voice" },
              ]}
              value={a.rain === undefined ? undefined : a.rain ? "rain" : "silence"}
              onPick={(id) => {
                const rain = id === "rain";
                update({ rain });
                s.setRain(rain ? 0.5 : 0);
                setTimeout(next, 250);
              }}
            />
          </>
        ) : null}

        {step === "moment" ? (
          <FirstMoment
            hello={hello}
            mode={mode}
            onNext={next}
            start={() => s.open(genesis1, { mode, expand: false })}
          />
        ) : null}

        {step === "lamp" ? (
          <>
            <LampGlow lit={listening.secondsToday > 0} />
            <h1>Your lamp is lit{hello}.</h1>
            <p className="ob-sub">
              Listen for 10 minutes a day, by day or by night, and your lamp stays lit. The minutes you just heard already count.
            </p>
            <p className="ob-stat">
              {Math.floor(listening.secondsToday / 60)} of 10 minutes today
            </p>
            <button type="button" className="ob-primary" onClick={next}>
              Continue
            </button>
          </>
        ) : null}

        {step === "why" ? (
          <>
            <p className="ob-eyebrow">Why Lampstand</p>
            <h1>Honest by design.</h1>
            <ul className="ob-honest">
              <li>
                <strong>Scripture, word for word.</strong> The Berean Standard Bible, with no edits and no commentary in Walk and Sleep.
              </li>
              <li>
                <strong>No ads while you listen.</strong> None in Walk, Sleep or Breathe. Premium removes them everywhere.
              </li>
              <li>
                <strong>No fake inflated prices.</strong> No crossed-out prices that never existed, and no countdown timers.
              </li>
              <li>
                <strong>Progress you can see.</strong> {SLEEP_CHAPTERS.length} chapters of Genesis recorded so far, about{" "}
                {Math.round(
                  SLEEP_CHAPTERS.reduce((n, c) => n + (SLEEP_SECONDS[c.slug] ?? 0) + (WALK_SECONDS[c.slug] ?? 0), 0) / 60,
                )}{" "}
                minutes of readings so far, with more on the way.
              </li>
            </ul>
            <button type="button" className="ob-primary" onClick={next}>
              Continue
            </button>
          </>
        ) : null}

        {step === "offer" ? <OfferStep hello={hello} onFree={next} onLeave={() => finish()} /> : null}

        {step === "install" ? <InstallStep onNext={() => finish()} /> : null}
      </main>
    </div>,
    document.body,
  );
}

function Choices({
  items,
  value,
  onPick,
}: {
  items: { id: string; title: string; note: string }[];
  value?: string;
  onPick: (id: string) => void;
}) {
  return (
    <ul className="ob-choices">
      {items.map((it) => (
        <li key={it.id}>
          <button type="button" aria-pressed={value === it.id} onClick={() => onPick(it.id)}>
            <span>
              <strong>{it.title}</strong>
              <small>{it.note}</small>
            </span>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </li>
      ))}
    </ul>
  );
}

/** Hear each reader say the opening of Genesis. */
function ReaderStep({ when, onNext }: { when: ListenWhen; onNext: () => void }) {
  const [playing, setPlaying] = useState<"walk" | "sleep" | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const readers = [
    { id: "walk" as const, title: "Iapetus · by day", note: "Clear and warm, for a walk or a commute", src: "/walk/genesis-1/chapter.mp3" },
    { id: "sleep" as const, title: "Theo · by night", note: "Deep and calm, for falling asleep", src: "/sleep/genesis-1/chapter.mp3" },
  ].filter((r) => when === "both" || r.id === when);

  const stop = () => {
    audio.current?.pause();
    window.clearTimeout(timer.current);
    setPlaying(null);
  };
  useEffect(() => stop, []);

  const play = (r: (typeof readers)[number]) => {
    if (playing === r.id) return stop();
    stop();
    const el = new Audio(r.src);
    el.currentTime = 1.8; // the chapter opens with two seconds of quiet
    void el.play();
    audio.current = el;
    setPlaying(r.id);
    timer.current = window.setTimeout(stop, 14000);
  };

  return (
    <>
      <h1>{readers.length > 1 ? "Meet your readers" : "Meet your reader"}</h1>
      <p className="ob-sub">Tap to hear the first words of Genesis.</p>
      <ul className="ob-choices">
        {readers.map((r) => (
          <li key={r.id}>
            <button type="button" aria-pressed={playing === r.id} onClick={() => play(r)}>
              <span className="ob-play" aria-hidden="true">
                {playing === r.id ? "❚❚" : "▶"}
              </span>
              <span>
                <strong>{r.title}</strong>
                <small>{r.note}</small>
              </span>
              {playing === r.id ? <span className="ob-bars" aria-hidden="true"><i /><i /><i /></span> : null}
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="ob-primary"
        onClick={() => {
          stop();
          onNext();
        }}
      >
        Continue
      </button>
    </>
  );
}

/** Genesis 1 starts for real; the first verses highlight as they are read. */
function FirstMoment({ hello, mode, start, onNext }: { hello: string; mode: "walk" | "sleep"; start: () => void; onNext: () => void }) {
  const s = useSleepAudio();
  const [ready, setReady] = useState(false);
  const started = useRef(false);
  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 1600);
    return () => window.clearTimeout(t);
  }, []);
  const onGenesis1 = s.chapter?.slug === "genesis-1";
  const verses = SLEEP_CHAPTERS[0].verses.slice(0, 5);

  if (!ready) {
    return (
      <div className="ob-preparing">
        <LampGlow lit />
        <h1>Let this verse settle over you.</h1>
        <p className="ob-sub">Preparing your first moment…</p>
      </div>
    );
  }
  return (
    <>
      <h1>Here is your first moment{hello}.</h1>
      <p className="ob-sub">Genesis 1, read {mode === "walk" ? "clearly, for the day" : "softly, for the night"}.</p>
      <div className="ob-verses">
        {verses.map((v, k) => (
          <p key={v.n} className={onGenesis1 && s.index === k ? "is-now" : onGenesis1 && s.index > k ? "is-past" : ""}>
            <sup>{v.n}</sup> {v.text}
          </p>
        ))}
      </div>
      <div className="ob-row">
        <button
          type="button"
          className="ob-primary"
          onClick={() => {
            if (!started.current || !onGenesis1) {
              started.current = true;
              start();
            } else s.toggle();
          }}
        >
          {onGenesis1 && s.playing ? "Pause" : onGenesis1 ? "Play" : "Listen"}
        </button>
        <button type="button" className="ob-secondary" onClick={onNext}>
          Continue
        </button>
      </div>
      <p className="ob-note">It keeps playing while you finish. The player waits at the bottom of the screen.</p>
    </>
  );
}

function OfferStep({ hello, onFree, onLeave }: { hello: string; onFree: () => void; onLeave: () => void }) {
  const spots = useFoundingSpots();
  const soldOut = spots !== null && spots.left === 0;
  const lifetimeReady = Boolean(process.env.NEXT_PUBLIC_PADDLE_LIFETIME_PRICE_ID) && !soldOut;
  return (
    <>
      <p className="ob-eyebrow">Lampstand Pro</p>
      <h1>Stay in the Word{hello}.</h1>
      <p className="ob-sub">Every chapter as it is recorded, every voice and sound, and no ads anywhere.</p>

      <div className="ob-plan is-best">
        <p className="ob-plan-tag">
          Founding member · {spots ? `${spots.left} of ${FOUNDING_CAP} spots left` : `first ${FOUNDING_CAP} only`}
        </p>
        <p className="ob-price">
          ${FOUNDING_PRICE} <span>once</span>
        </p>
        <p className="ob-plan-note">
          Pro for life, including every new voice as it arrives (a gentle female Sleep reader is coming soon). Less than 2½ years of the yearly plan, then never pay again. One founding member funds about{" "}
          {chaptersFundedPerMember()} chapters; about {membersToFundBible()} fund the whole Bible.
        </p>
        {lifetimeReady ? (
          <Link href="/pricing?plan=lifetime" className="ob-primary" onClick={onLeave}>
            Become a founding member
          </Link>
        ) : (
          <button type="button" className="ob-primary" disabled>
            {soldOut ? "All founding spots are taken" : "Opening soon"}
          </button>
        )}
      </div>

      <div className="ob-plan">
        <p className="ob-plan-tag">Monthly or yearly</p>
        <p className="ob-price">
          $4.99 <span>a month</span> · $39.99 <span>a year</span>
        </p>
        <p className="ob-plan-note">7 days free on either plan. Cancel any time.</p>
        <Link href="/pricing" className="ob-secondary" onClick={onLeave}>
          Start the free trial
        </Link>
      </div>

      <p className="ob-honest-line">No fake inflated prices: these are the real prices, with no countdowns.</p>
      <button type="button" className="ob-free" onClick={onFree}>
        Continue free
      </button>
    </>
  );
}

function InstallStep({ onNext }: { onNext: () => void }) {
  const ios = isIos();
  return (
    <>
      <LampGlow lit />
      <h1>Keep Lampstand on your home screen</h1>
      <p className="ob-sub">One tap to tonight&apos;s chapter, full screen, like an app.</p>
      {ios ? (
        <ol className="ob-ios">
          <li>Tap the Share button in Safari.</li>
          <li>Choose &ldquo;Add to Home Screen&rdquo;.</li>
          <li>Tap Add.</li>
        </ol>
      ) : (
        <button
          type="button"
          className="ob-primary"
          onClick={async () => {
            await installPrompt?.prompt();
            trackEvent("app_install_prompt");
            installPrompt = null;
            onNext();
          }}
        >
          Install Lampstand
        </button>
      )}
      <button type="button" className="ob-free" onClick={onNext}>
        {ios ? "Done" : "Not now"}
      </button>
    </>
  );
}

function LampGlow({ lit }: { lit: boolean }) {
  return (
    <svg className={`ob-lamp${lit ? " is-lit" : ""}`} viewBox="20 40 140 110" width="140" height="110" aria-hidden="true">
      <defs>
        <radialGradient id="ob-glow">
          <stop offset="0%" stopColor="#ffd98a" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#e4a53c" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ob-clay" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c99a55" />
          <stop offset="100%" stopColor="#7a5427" />
        </linearGradient>
      </defs>
      {lit ? <circle cx="146" cy="70" r="46" fill="url(#ob-glow)" /> : null}
      {lit ? (
        <g transform="translate(146 96)">
          <path d="M0 0 C -11 -10 -9 -28 0 -46 C 9 -28 11 -10 0 0 Z" fill="#ffc955" />
          <path d="M0 -2 C -4 -8 -3 -16 0 -24 C 3 -16 4 -8 0 -2 Z" fill="#fffbea" />
        </g>
      ) : null}
      <path d="M40 112 C 40 92 70 84 100 84 C 124 84 136 88 146 96 C 152 100 152 108 146 112 C 132 122 112 128 100 128 C 66 128 40 126 40 112 Z" fill="url(#ob-clay)" />
      <path d="M44 110 C 28 108 24 96 34 92" fill="none" stroke="#9c6d33" strokeWidth="6" strokeLinecap="round" />
      <path d="M60 128 L 140 128 L 132 140 L 68 140 Z" fill="#6b4a22" />
    </svg>
  );
}
