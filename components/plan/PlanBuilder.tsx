"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  PRESETS,
  buildPlan,
  describeReadings,
  planCaution,
  type PlanInput,
  type PlanOrder,
  type PlanScope,
} from "@/lib/plan/build";
import { daysOf, nextUnread, readSavedPlan, writeSavedPlan, type SavedPlan } from "@/lib/plan/storage";
import "./plan.css";

function todayISO(): string {
  const now = new Date();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${m}-${d}`;
}

const DEFAULTS: PlanInput = {
  scope: "bible",
  order: "ot-and-nt",
  readingDays: 365,
  start: "2026-01-01",
  skipWeekdays: [0],
};

export function PlanBuilder() {
  const [input, setInput] = useState<PlanInput>(DEFAULTS);
  const [saved, setSaved] = useState<SavedPlan | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const existing = readSavedPlan();
    setSaved(existing);
    setInput(existing?.input ?? { ...DEFAULTS, start: todayISO() });
    setReady(true);
  }, []);

  const days = useMemo(() => buildPlan(input), [input]);
  const caution = useMemo(() => planCaution(days), [days]);
  const savedDays = saved ? daysOf(saved) : [];
  const resume = saved ? nextUnread(saved, savedDays) : 0;

  function applyPreset(id: string) {
    const preset = PRESETS.find((p) => p.id === id);
    if (!preset) return;
    setInput((current) => ({
      ...current,
      scope: preset.scope,
      order: preset.order,
      readingDays: preset.readingDays,
    }));
  }

  function save() {
    const next: SavedPlan = { input, done: [], place: { day: 0, part: 0, verse: 1 } };
    writeSavedPlan(next);
    setSaved(next);
  }

  function skipMissed() {
    if (!saved) return;
    const today = todayISO();
    const missed = savedDays.filter((d) => d.date < today && !saved.done.includes(d.index)).map((d) => d.index);
    const next = { ...saved, done: [...new Set([...saved.done, ...missed])] };
    writeSavedPlan(next);
    setSaved(next);
  }

  if (!ready) return <main className="plan" />;

  return (
    <main className="plan">
      <h1>Bible reading plan</h1>
      <p className="plan-lead">
        Choose a pace. Each day opens in the reader, text only. Walk and Sleep are the voices, and either one is Premium.
      </p>

      <div className="plan-presets" role="group" aria-label="Presets">
        {PRESETS.map((preset) => {
          const on =
            input.scope === preset.scope && input.order === preset.order && input.readingDays === preset.readingDays;
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
          <select
            value={input.scope}
            onChange={(e) => setInput({ ...input, scope: e.target.value as PlanScope })}
          >
            <option value="bible">Whole Bible</option>
            <option value="ot">Old Testament</option>
            <option value="nt">New Testament</option>
            <option value="gospels">Gospels</option>
            <option value="psalms">Psalms</option>
          </select>
        </label>
        <label>
          Order
          <select
            value={input.order}
            onChange={(e) => setInput({ ...input, order: e.target.value as PlanOrder })}
          >
            <option value="canonical">Genesis to Revelation</option>
            <option value="gospels-first">Gospels first</option>
            <option value="ot-and-nt">Old and New each day</option>
          </select>
        </label>
        <label>
          Reading days
          <input
            type="number"
            min={1}
            max={3660}
            value={input.readingDays}
            onChange={(e) => setInput({ ...input, readingDays: Number(e.target.value) })}
          />
        </label>
        <label>
          Start
          <input type="date" value={input.start} onChange={(e) => setInput({ ...input, start: e.target.value })} />
        </label>
        <label className="plan-check wide">
          <input
            type="checkbox"
            checked={input.skipWeekdays.includes(0)}
            onChange={(e) =>
              setInput({
                ...input,
                skipWeekdays: e.target.checked ? [...new Set([...input.skipWeekdays, 0])] : input.skipWeekdays.filter((d) => d !== 0),
              })
            }
          />
          Sundays off
        </label>
        <div className="wide">
          <button className="plan-go" type="submit">
            Save this plan
          </button>
        </div>
      </form>

      <div className="plan-summary">
        <p>
          <strong>
            {days.length} {days.length === 1 ? "day" : "days"}
          </strong>
          {days.length ? ` · finishes ${days.at(-1)!.date}` : ""}
          {input.readingDays > days.length ? " · one chapter a day, so it finishes sooner than the number you typed" : ""}
        </p>
        {days[0] ? <p>First day: {describeReadings(days[0])}</p> : null}
        {caution ? <p>{caution}</p> : null}
      </div>

      {saved ? (
        <div className="plan-actions">
          <Link className="plan-go" href={`/plan/read?day=${resume}`}>
            {saved.done.length ? "Continue reading" : "Open the first day"}
          </Link>
          <button type="button" className="plan-secondary" onClick={skipMissed}>
            Skip missed days
          </button>
        </div>
      ) : (
        <p className="plan-lead">Save the plan to keep your place in this browser.</p>
      )}

      {saved ? (
        <ol className="plan-days">
          {savedDays.map((day) => (
            <li key={day.index}>
              <Link className={saved.done.includes(day.index) ? "is-done" : undefined} href={`/plan/read?day=${day.index}`}>
                <time dateTime={day.date}>{day.date}</time>
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
