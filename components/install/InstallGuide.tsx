"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import {
  currentPlatform,
  getDeferredPrompt,
  onDeferredPromptChange,
  setDeferredPrompt,
  type InstallPlatform,
} from "@/lib/install";

type Guide = "ios" | "android" | "in-app";

/**
 * How to put Lampstand on the home screen, for the phone the visitor is on:
 * a one-tap Install button where Chrome offers one, otherwise drawn
 * step-by-step screens. Shown after sign-up (/install) and after checkout
 * (/welcome).
 */
export function InstallGuide({ next, from }: { next: string; from: string }) {
  const [platform, setPlatform] = useState<InstallPlatform | null>(null);
  const [guide, setGuide] = useState<Guide>("ios");
  const [canPrompt, setCanPrompt] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const p = currentPlatform();
    setPlatform(p);
    setGuide(p === "android" ? "android" : p === "in-app" ? "in-app" : "ios");
    setCanPrompt(Boolean(getDeferredPrompt()));
    trackEvent("install_page_view", { platform: p, from });
    return onDeferredPromptChange(() => setCanPrompt(Boolean(getDeferredPrompt())));
  }, [from]);

  async function installNow() {
    const prompt = getDeferredPrompt();
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    trackEvent("install_prompt", { outcome, from });
    setDeferredPrompt(null);
    if (outcome === "accepted") setInstalled(true);
  }

  if (platform === "installed" || installed) {
    return (
      <section className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
        <h2 className="font-display text-2xl text-[var(--ink)]">Lampstand is on your home screen</h2>
        <p className="mt-2 text-[var(--muted)]">Open it from there tonight, like any other app.</p>
        <Link href={next} className="btn btn-primary mt-5 inline-flex min-h-12 items-center rounded-2xl px-8 font-semibold">
          Continue
        </Link>
      </section>
    );
  }

  return (
    <section className="text-left">
      <div className="text-center">
        <h2 className="font-display text-3xl text-[var(--ink)] sm:text-4xl">Put Lampstand on your phone</h2>
        <p className="mx-auto mt-3 max-w-md text-[var(--muted)]">
          Open it from your home screen like an app: full screen, one tap at bedtime. No app store, about 30 seconds.
        </p>
      </div>

      {canPrompt ? (
        <div className="mt-6 flex flex-col items-center gap-2">
          <button type="button" onClick={() => void installNow()} className="btn btn-primary min-h-12 rounded-2xl px-8 font-semibold">
            Install Lampstand
          </button>
          <span className="text-xs text-[var(--muted)]">One tap, then confirm.</span>
        </div>
      ) : null}

      {platform === "desktop" ? (
        <p className="mx-auto mt-6 max-w-md rounded-2xl border border-[var(--line)] bg-[var(--canvas-2)]/60 p-4 text-center text-sm text-[var(--muted)]">
          On your computer now? Open <strong className="text-[var(--ink)]">lampstandbible.com</strong> on your phone and sign in
          with the same email, then follow these steps.
        </p>
      ) : null}

      <div className="mt-6 flex justify-center gap-2" role="tablist" aria-label="Your phone">
        {(
          [
            ["ios", "iPhone"],
            ["android", "Android"],
            ["in-app", "In Facebook"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={guide === key}
            onClick={() => setGuide(key)}
            className={`rounded-full border px-4 py-1.5 text-sm ${
              guide === key
                ? "border-[var(--gold)] bg-[var(--gold)]/15 text-[var(--gold)]"
                : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--ink)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {guide === "in-app" ? <InAppSteps /> : guide === "android" ? <AndroidSteps /> : <IosSteps />}

      <div className="mt-8 text-center">
        <Link href={next} className="text-sm text-[var(--muted)] underline underline-offset-4 hover:text-[var(--ink)]">
          I&apos;ll do it later, continue
        </Link>
      </div>
    </section>
  );
}

/* ---------- Steps ---------- */

function Steps({ children }: { children: ReactNode }) {
  return <ol className="mt-6 grid gap-6 sm:grid-cols-2">{children}</ol>;
}

function Step({ n, title, note, children }: { n: number; title: string; note?: string; children: ReactNode }) {
  return (
    <li className="rounded-3xl border border-[var(--line)] bg-[var(--canvas-2)]/60 p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-[var(--gold)] text-sm font-bold text-black">{n}</span>
        <div>
          <strong className="block text-[var(--ink)]">{title}</strong>
          {note ? <span className="text-sm text-[var(--muted)]">{note}</span> : null}
        </div>
      </div>
      <div className="mt-4 flex justify-center">{children}</div>
    </li>
  );
}

function IosSteps() {
  return (
    <Steps>
      <Step n={1} title="Tap the Share button" note="In Safari, at the bottom of the screen (in Chrome, at the top right).">
        <Phone>
          <PageStub />
          <div className="mt-auto flex items-center justify-around border-t border-white/10 bg-neutral-900 px-2 py-2 text-white/60">
            <Chevron dir="left" />
            <Chevron dir="right" />
            <Hint>
              <ShareIcon />
            </Hint>
            <BookIcon />
            <TabsIcon />
          </div>
        </Phone>
      </Step>
      <Step n={2} title="Choose “Add to Home Screen”" note="Scroll down the list if you don't see it.">
        <Phone>
          <div className="mt-auto rounded-t-2xl bg-neutral-800 p-2 text-[11px] text-white/80">
            <MenuRow icon="⧉" label="Copy" />
            <MenuRow icon="☆" label="Add to Favourites" />
            <MenuRow icon="▢" label="Add to Home Screen" highlight />
            <MenuRow icon="✎" label="Markup" />
          </div>
        </Phone>
      </Step>
      <Step n={3} title="Tap “Add”" note="At the top right.">
        <Phone>
          <div className="flex items-center justify-between gap-1 bg-neutral-800 px-2 py-2 text-[9px] text-white/70">
            <span>Cancel</span>
            <span className="whitespace-nowrap text-white">Add to Home</span>
            <Hint>
              <span className="font-semibold text-sky-400">Add</span>
            </Hint>
          </div>
          <div className="flex items-center gap-2 p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon-192.png" alt="" className="h-10 w-10 rounded-xl" />
            <span className="text-xs text-white">Lampstand</span>
          </div>
        </Phone>
      </Step>
      <Step n={4} title="Open Lampstand from your home screen" note="The gold lamp icon. Sign in once inside, and you're set.">
        <HomeScreen />
      </Step>
    </Steps>
  );
}

function AndroidSteps() {
  return (
    <Steps>
      <Step n={1} title="Tap the ⋮ menu" note="In Chrome, at the top right.">
        <Phone>
          <div className="flex items-center gap-2 bg-neutral-800 px-2 py-2 text-[11px] text-white/70">
            <span className="flex-1 truncate rounded-full bg-neutral-700 px-3 py-1">lampstandbible.com</span>
            <Hint>
              <span className="px-1 text-base leading-none text-white">⋮</span>
            </Hint>
          </div>
          <PageStub />
        </Phone>
      </Step>
      <Step n={2} title="Choose “Install app”" note="Or “Add to Home screen” if that's what you see.">
        <Phone>
          <div className="ml-auto mt-1 w-[78%] rounded-lg bg-neutral-800 p-1 text-[11px] text-white/80 shadow-xl">
            <MenuRow label="New tab" />
            <MenuRow label="Bookmarks" />
            <MenuRow label="Install app" highlight />
            <MenuRow label="Share…" />
          </div>
        </Phone>
      </Step>
      <Step n={3} title="Tap “Install”" note="Lampstand is added to your home screen and app drawer.">
        <Phone>
          <div className="m-auto w-[85%] rounded-2xl bg-neutral-800 p-3 text-[11px] text-white/80">
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icon-192.png" alt="" className="h-8 w-8 rounded-lg" />
              <span className="text-white">Install Lampstand?</span>
            </div>
            <div className="mt-3 flex justify-end gap-3">
              <span>Cancel</span>
              <Hint>
                <span className="font-semibold text-sky-400">Install</span>
              </Hint>
            </div>
          </div>
        </Phone>
      </Step>
      <Step n={4} title="Open Lampstand from your home screen" note="The gold lamp icon, full screen like an app.">
        <HomeScreen />
      </Step>
    </Steps>
  );
}

function InAppSteps() {
  return (
    <>
      <p className="mx-auto mt-6 max-w-md text-center text-sm text-[var(--muted)]">
        Pages opened from Facebook or Instagram can&apos;t be added to your home screen. Open this page in Safari or Chrome
        first, then follow the iPhone or Android steps.
      </p>
      <Steps>
        <Step n={1} title="Tap ••• at the top right" note="In the Facebook or Instagram browser.">
          <Phone>
            <div className="flex items-center gap-2 bg-neutral-800 px-2 py-2 text-[11px] text-white/70">
              <span className="text-white">✕</span>
              <span className="flex-1 truncate text-center">lampstandbible.com</span>
              <Hint>
                <span className="px-1 font-bold text-white">•••</span>
              </Hint>
            </div>
            <PageStub />
          </Phone>
        </Step>
        <Step n={2} title="Choose “Open in browser”" note="It may say “Open in Safari” or “Open in Chrome”.">
          <Phone>
            <div className="mt-auto rounded-t-2xl bg-neutral-800 p-2 text-[11px] text-white/80">
              <MenuRow label="Copy link" />
              <MenuRow label="Open in browser" highlight />
              <MenuRow label="Share" />
            </div>
          </Phone>
        </Step>
      </Steps>
      <p className="mx-auto mt-6 max-w-md text-center text-sm text-[var(--muted)]">
        Then sign in with the same email. Your account and your Premium come with you.
      </p>
    </>
  );
}

/* ---------- Drawn screens ---------- */

function Phone({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-56 w-36 flex-col overflow-hidden rounded-[1.6rem] border-4 border-neutral-700 bg-neutral-950 shadow-lg" aria-hidden="true">
      <div className="mx-auto mt-1 h-1.5 w-12 flex-none rounded-full bg-neutral-800" />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}

function PageStub() {
  return (
    <div className="flex flex-1 flex-col gap-1.5 p-3">
      <div className="h-2 w-3/4 rounded bg-[var(--gold)]/60" />
      <div className="h-1.5 w-full rounded bg-white/15" />
      <div className="h-1.5 w-5/6 rounded bg-white/15" />
      <div className="mt-2 h-14 w-full rounded-lg bg-gradient-to-br from-amber-900/50 to-neutral-800" />
    </div>
  );
}

function HomeScreen() {
  return (
    <Phone>
      <div className="grid flex-1 grid-cols-3 content-start gap-3 p-3">
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} className="aspect-square rounded-xl bg-white/10" />
        ))}
        <div className="flex flex-col items-center gap-0.5">
          <span className="rounded-xl ring-2 ring-[var(--gold)] ring-offset-2 ring-offset-neutral-950">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon-192.png" alt="" className="aspect-square w-full rounded-xl" />
          </span>
          <span className="text-[8px] text-white/80">Lampstand</span>
        </div>
      </div>
    </Phone>
  );
}

function MenuRow({ label, icon, highlight }: { label: string; icon?: string; highlight?: boolean }) {
  return (
    <div
      className={`flex items-center justify-between rounded-md px-2 py-1.5 ${
        highlight ? "bg-[var(--gold)]/25 font-semibold text-white ring-1 ring-[var(--gold)]" : ""
      }`}
    >
      <span>{label}</span>
      {icon ? <span className="text-white/60">{icon}</span> : null}
    </div>
  );
}

/** A gold ring around the thing to tap. */
function Hint({ children }: { children: ReactNode }) {
  return <span className="rounded-full p-1 ring-2 ring-[var(--gold)] motion-safe:animate-pulse">{children}</span>;
}

function ShareIcon() {
  return (
    <svg className="h-4 w-4 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12M8 7l4-4 4 4M6 11H5a1 1 0 00-1 1v8a1 1 0 001 1h14a1 1 0 001-1v-8a1 1 0 00-1-1h-1" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2V5z" />
    </svg>
  );
}

function TabsIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="4" y="4" width="12" height="12" rx="2" />
      <path d="M8 20h10a2 2 0 002-2V8" />
    </svg>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d={dir === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
    </svg>
  );
}
