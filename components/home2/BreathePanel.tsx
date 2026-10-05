"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Phase = { kind: "in" | "hold" | "out"; seconds: number };
type Pattern = { id: string; name: string; note: string; phases: Phase[] };

/** Three simple patterns, named for what they are for rather than their technique. */
export const PATTERNS: Pattern[] = [
  {
    id: "gentle",
    name: "Gentle",
    note: "In 4, out 6. Slows you down.",
    phases: [
      { kind: "in", seconds: 4 },
      { kind: "out", seconds: 6 },
    ],
  },
  {
    id: "steady",
    name: "Steady",
    note: "In 4, hold 4, out 4, hold 4. For stressful moments.",
    phases: [
      { kind: "in", seconds: 4 },
      { kind: "hold", seconds: 4 },
      { kind: "out", seconds: 4 },
      { kind: "hold", seconds: 4 },
    ],
  },
  {
    id: "restful",
    name: "Restful",
    note: "In 4, hold 7, out 8. Before sleep.",
    phases: [
      { kind: "in", seconds: 4 },
      { kind: "hold", seconds: 7 },
      { kind: "out", seconds: 8 },
    ],
  },
];

const LENGTHS = [1, 3, 5] as const;
const WORDS: Record<Phase["kind"], string> = { in: "Breathe in", hold: "Hold", out: "Breathe out" };

/**
 * A visual breathing exercise: one glowing circle that grows on the in-breath
 * and shrinks on the out-breath, large words and a countdown, and an optional
 * soft tone at each change for eyes-closed use.
 */
export function BreathePanel() {
  const [pattern, setPattern] = useState<Pattern>(PATTERNS[0]);
  const [minutes, setMinutes] = useState<(typeof LENGTHS)[number]>(3);
  const [sound, setSound] = useState(true);
  const [running, setRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseLeft, setPhaseLeft] = useState(0);
  const [totalLeft, setTotalLeft] = useState(0);
  const [done, setDone] = useState(false);
  const tone = useSoftTone();
  const clock = useRef<{ phaseEndsAt: number; endsAt: number; index: number } | null>(null);

  const phase = pattern.phases[phaseIndex];

  const cue = useCallback(
    (p: Phase) => {
      if (sound) tone.play(p.kind);
      if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate?.(p.kind === "hold" ? 15 : 30);
    },
    [sound, tone],
  );

  const start = () => {
    tone.unlock();
    const now = performance.now();
    const first = pattern.phases[0];
    clock.current = { index: 0, phaseEndsAt: now + first.seconds * 1000, endsAt: now + minutes * 60_000 };
    setPhaseIndex(0);
    setPhaseLeft(first.seconds);
    setTotalLeft(minutes * 60);
    setDone(false);
    setRunning(true);
    cue(first);
  };

  const stop = () => {
    clock.current = null;
    setRunning(false);
  };

  // A steady 100ms timer (not animation frames) keeps the cues on time even if
  // the page is briefly hidden; the circle itself animates with CSS.
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      const c = clock.current;
      if (!c) return;
      const now = performance.now();
      if (now >= c.endsAt) {
        clock.current = null;
        setRunning(false);
        setDone(true);
        if (sound) tone.play("end");
        return;
      }
      while (now >= c.phaseEndsAt) {
        const next = (c.index + 1) % pattern.phases.length;
        c.index = next;
        c.phaseEndsAt += pattern.phases[next].seconds * 1000;
        setPhaseIndex(next);
        cue(pattern.phases[next]);
      }
      setPhaseLeft(Math.ceil((c.phaseEndsAt - now) / 1000));
      setTotalLeft(Math.ceil((c.endsAt - now) / 1000));
    }, 100);
    return () => window.clearInterval(id);
  }, [running, pattern, cue, sound, tone]);

  // The circle grows on the in-breath, stays on a hold, and shrinks on the out-breath.
  const previous = pattern.phases.at((phaseIndex - 1 + pattern.phases.length) % pattern.phases.length);
  const expanded = !running ? false : phase.kind === "in" || (phase.kind === "hold" && previous?.kind === "in");
  const circleStyle = {
    transform: `scale(${expanded ? 1 : 0.55})`,
    transitionDuration: running && phase.kind !== "hold" ? `${phase.seconds}s` : "0.6s",
  };

  return (
    <div className="breathe">
      <div className="breathe-stage" aria-live="polite">
        <div className="breathe-ring" />
        <div className={`breathe-circle${running ? " is-running" : ""}`} style={circleStyle} />
        <div className="breathe-words">
          {running ? (
            <>
              <p className="breathe-phase">{WORDS[phase.kind]}</p>
              <p className="breathe-count">{phaseLeft}</p>
            </>
          ) : done ? (
            <>
              <p className="breathe-phase">Well done</p>
              <p className="breathe-sub">Take a moment before you carry on.</p>
            </>
          ) : (
            <>
              <p className="breathe-phase">{pattern.name}</p>
              <p className="breathe-sub">{pattern.note}</p>
            </>
          )}
        </div>
      </div>

      {running ? (
        <div className="breathe-running">
          <p className="breathe-left">
            {Math.floor(totalLeft / 60)}:{String(totalLeft % 60).padStart(2, "0")} left
          </p>
          <button type="button" className="breathe-stop" onClick={stop}>
            Stop
          </button>
        </div>
      ) : (
        <div className="breathe-setup">
          <div className="breathe-choices" role="radiogroup" aria-label="Breathing pattern">
            {PATTERNS.map((p) => (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={pattern.id === p.id}
                onClick={() => setPattern(p)}
              >
                <strong>{p.name}</strong>
                <span>{p.note}</span>
              </button>
            ))}
          </div>
          <div className="breathe-row">
            <div className="breathe-lengths" role="radiogroup" aria-label="Length">
              {LENGTHS.map((m) => (
                <button key={m} type="button" role="radio" aria-checked={minutes === m} onClick={() => setMinutes(m)}>
                  {m} min
                </button>
              ))}
            </div>
            <button type="button" className="breathe-sound" aria-pressed={sound} onClick={() => setSound((s) => !s)}>
              {sound ? "Soft tone on" : "Soft tone off"}
            </button>
          </div>
          <button type="button" className="breathe-start" onClick={start}>
            Begin
          </button>
        </div>
      )}
    </div>
  );
}

/** A soft sine tone, rising for "in", falling for "out", made in the browser. */
function useSoftTone() {
  const ctx = useRef<AudioContext | null>(null);

  const unlock = useCallback(() => {
    if (ctx.current) {
      void ctx.current.resume();
      return;
    }
    const Ctor =
      window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (Ctor) ctx.current = new Ctor();
  }, []);

  const play = useCallback((kind: Phase["kind"] | "end") => {
    const ac = ctx.current;
    if (!ac) return;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    const now = ac.currentTime;
    const [from, to] =
      kind === "in" ? [330, 392] : kind === "out" ? [392, 294] : kind === "end" ? [523, 392] : [349, 349];
    osc.type = "sine";
    osc.frequency.setValueAtTime(from, now);
    osc.frequency.linearRampToValueAtTime(to, now + 0.6);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + (kind === "end" ? 1.6 : 0.9));
    osc.connect(gain).connect(ac.destination);
    osc.start(now);
    osc.stop(now + 1.7);
  }, []);

  useEffect(() => () => void ctx.current?.close(), []);
  return useRef({ unlock, play }).current;
}
