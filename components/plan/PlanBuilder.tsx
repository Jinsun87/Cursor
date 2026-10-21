"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  MAX_SPAN_DAYS,
  PRESETS,
  buildPlan,
  describeReadings,
  formatISODate,
  friendlyDate,
  planCaution,
  readingDaysWithin,
  type PlanInput,
  type PlanOrder,
  type PlanScope,
} from "@/lib/plan/build";
import {
  catchUp,
  daysOf,
  emptyPlace,
  missedDays,
  nextUnread,
  readSavedPlan,
  sameInput,
  writeSavedPlan,
  type SavedPlan,
} from "@/lib/plan/storage";
import "./plan.css";

const todayISO = () => formatISODate(new Date());

const DEFAULTS: PlanInput = {
  scope: "bible",
  order: "ot-and-nt",
  spanDays: 365,
  start: "2026-01-01",
  skipWeekdays: [0],
};

export function PlanBuilder() {
  const [input, setInput] = useState<PlanInput>(DEFAULTS);
  const [saved, setSaved] = useState<SavedPlan | null>(null);
  const [ready, setReady] = useState(false);
  const [confirmReplace, setConfirmReplace] = useState(false);

  useEffect(() => {
    const existing = readSavedPlan();
    setSaved(existing);
    setInput(existing?.input ?? { ...DEFAULTS, start: todayISO() });
    setReady(true);
  }, []);

  const savedDays = useMemo(() => (saved ? daysOf(saved) : []), [saved]);
  const unchanged = saved !== null && sameInput(saved.input, input);
  // The saved plan keeps its own dates (after catching up), so show those until something is changed.
  const days = useMemo(() => (unchanged ? savedDays : buildPlan(input)), [unchanged, savedDays, input]);
  const caution = useMemo(() => planCaution(days), [days]);
  const resume = saved ? nextUnread(saved, savedDays) : 0;
  const missed = saved ? missedDays(saved, savedDays, todayISO()) : [];
  const hasProgress = Boolean(saved && (saved.done.length || saved.place.day || saved.place.part));

  function edit(next: Partial<PlanInput>) {
    setInput((current) => ({ ...current, ...next }));
    setConfirmReplace(false);
  }

  function applyPreset(id: string) {
    const preset = PRESETS.find((p) => p.id === id);
    if (preset) edit({ scope: preset.scope, order: preset.order, spanDays: preset.spanDays });
  }

  function save() {
    if (unchanged) return;
    if (hasProgress && !confirmReplace) {
      setConfirmReplace(true);
      return;
    }
    const next: SavedPlan = { input, done: [], place: emptyPlace() };
    writeSavedPlan(next);
    setSaved(next);
    setConfirmReplace(false);
  }

  function catchUpNow() {
    if (!saved) return;
    const next = catchUp(saved, savedDays, todayISO());
    writeSavedPlan(next);
    setSaved(next);
  }

  if (!ready) return <main className="plan" />;

  return (
    <main className="plan">
      <h1>Bible reading plan</h1>
      <p className="plan-lead">
        Choose a pace. Each day opens in the reader, and the text is always free. Genesis can also be heard free in Walk (by day)
        and Sleep (by night); the voices for other books come with Premium as they are recorded.
      </p>

      <div className="plan-presets" role="group" aria-label="Presets">
        {PRESETS.map((preset) => {
          const on = input.scope === preset.scope && input.order === preset.order && input.spanDays === preset.spanDays;
          return (
            <button key={preset.id} type="button" aria-pressed={on} onClick={() => applyPreset(preset.id)}>
              {preset.label}
            </button>
          );
        })}
      </div>

      <form
        className="plan-form"
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <label>
          What to read
          <select value={input.scope} onChange={(e) => edit({ scope: e.target.value as PlanScope })}>
            <option value="bible">Whole Bible</option>
            <option value="ot">Old Testament</option>
            <option value="nt">New Testament</option>
            <option value="gospels">Gospels</option>
            <option value="psalms">Psalms</option>
          </select>
        </label>
        {input.scope === "bible" ? (
          <label>
            Order
            <select value={input.order} onChange={(e) => edit({ order: e.target.value as PlanOrder })}>
              <option value="canonical">Genesis to Revelation</option>
              <option value="gospels-first">Gospels first</option>
              <option value="ot-and-nt">Old and New each day</option>
            </select>
          </label>
        ) : null}
        <label>
          Finish in (days)
          <input
            type="number"
            min={1}
            max={MAX_SPAN_DAYS}
            value={input.spanDays}
            onChange={(e) => edit({ spanDays: Math.min(MAX_SPAN_DAYS, Math.max(1, Number(e.target.value) || 1)) })}
          />
        </label>
        <label>
          Start
          <input type="date" value={input.start} onChange={(e) => e.target.value && edit({ start: e.target.value })} />
        </label>
        <label className="plan-check wide">
          <input
            type="checkbox"
            checked={input.skipWeekdays.includes(0)}
            onChange={(e) =>
              edit({
                skipWeekdays: e.target.checked ? [...new Set([...input.skipWeekdays, 0])] : input.skipWeekdays.filter((d) => d !== 0),
              })
            }
          />
          Sundays off
        </label>
        <div className="wide">
          {confirmReplace ? (
            <div className="plan-confirm" role="alert">
              <p>
                This replaces your current plan. Your progress in it ({saved?.done.length ?? 0} of {savedDays.length} days read) will
                be cleared.
              </p>
              <button className="plan-go" type="submit">
                Replace my plan
              </button>
              <button type="button" className="plan-secondary" onClick={() => {
                  setInput(saved!.input);
                  setConfirmReplace(false);
                }}>
                Keep my current plan
              </button>
            </div>
          ) : (
            <button className="plan-go" type="submit" disabled={unchanged}>
              {unchanged ? "Plan saved" : saved ? "Start this plan instead" : "Save this plan"}
            </button>
          )}
        </div>
      </form>

      <div className="plan-summary">
        <p>
          <strong>
            {days.length} reading {days.length === 1 ? "day" : "days"}
          </strong>
          {days.length ? ` · finishes ${friendlyDate(days.at(-1)!.date)}` : ""}
          {days.length < readingDaysWithin(input.start, input.spanDays, input.skipWeekdays)
            ? " · one chapter a day, so it finishes sooner"
            : ""}
        </p>
        {days[0] ? <p>First day: {describeReadings(days[0])}</p> : null}
        {caution ? <p>{caution}</p> : null}
      </div>

      {saved ? (
        <div className="plan-actions">
          <Link className="plan-go" href={`/plan/read?day=${resume}`}>
            {saved.done.length ? "Continue reading" : "Open the first day"}
          </Link>
          {missed.length ? (
            <div className="plan-catchup">
              <p>
                {missed.length === 1 ? "One day is" : `${missed.length} days are`} behind. Catching up moves the rest of the plan
                forward so your next reading is today. Nothing is marked as read.
              </p>
              <button type="button" className="plan-secondary" onClick={catchUpNow}>
                Catch up
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <p className="plan-lead">Save the plan to keep your place in this browser.</p>
      )}

      {saved ? (
        <ol className="plan-days">
          {savedDays.map((day) => (
            <li key={day.index}>
              <Link className={saved.done.includes(day.index) ? "is-done" : undefined} href={`/plan/read?day=${day.index}`}>
                <time dateTime={day.date}>{friendlyDate(day.date)}</time>
                <span>{describeReadings(day)}</span>
                <span>{saved.done.includes(day.index) ? "Read" : `${day.readings.reduce((n, r) => n + r.verses, 0)} verses`}</span>
              </Link>
            </li>
          ))}
        </ol>
      ) : null}
    </main>
  );
}
