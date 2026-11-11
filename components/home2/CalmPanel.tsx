"use client";

import { useEffect, useRef, useState } from "react";
import { FEELINGS, PRACTICES, getFeeling, type FeelingId, type PracticeId } from "@/lib/calm";
import { readOnboarding } from "@/lib/onboarding";
import { BreathePanel } from "./BreathePanel";

/**
 * Calm me: name how you feel, then take one short practice matched to it.
 * Prayer, box breathing, a wordless tone, or a line to say aloud.
 */
export function CalmPanel() {
  const [feelingId, setFeelingId] = useState<FeelingId | null>(null);
  const [practice, setPractice] = useState<PracticeId | null>(null);
  const [step, setStep] = useState(0);
  const feeling = getFeeling(feelingId);

  useEffect(() => {
    const answers = readOnboarding();
    if (answers.intent === "anxious") setFeelingId("anxious");
    else if (answers.intent === "hard") setFeelingId("sad");
    else if (answers.intent === "sleep") setFeelingId("awake");
  }, []);

  const chooseFeeling = (id: FeelingId) => {
    setFeelingId(id);
    setPractice(null);
    setStep(0);
  };

  return (
    <div className="calm">
      <p className="calm-kicker">Calm me</p>
      {feeling && practice ? (
        <Practice
          feelingId={feeling.id}
          practice={practice}
          step={step}
          onStep={setStep}
          onBack={() => {
            setPractice(null);
            setStep(0);
          }}
        />
      ) : (
        <>
          <h2 className="calm-title">How are you right now?</h2>
          <p className="calm-line">Pick the closest one. You can change it.</p>
          <div className="calm-feelings" role="radiogroup" aria-label="How you feel">
            {FEELINGS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="radio"
                aria-checked={feelingId === item.id}
                onClick={() => chooseFeeling(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          {feeling ? (
            <div className="calm-offer">
              <p className="calm-line">{feeling.line}</p>
              <div className="calm-practices">
                {PRACTICES.map((item) => (
                  <button key={item.id} type="button" onClick={() => setPractice(item.id)}>
                    <strong>{item.title}</strong>
                    <span>{item.note}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="calm-note">A quiet minute. Not medical care, and not a substitute for someone you trust.</p>
          )}
        </>
      )}
    </div>
  );
}

function Practice({
  feelingId,
  practice,
  step,
  onStep,
  onBack,
}: {
  feelingId: FeelingId;
  practice: PracticeId;
  step: number;
  onStep: (step: number) => void;
  onBack: () => void;
}) {
  const feeling = getFeeling(feelingId)!;
  const meta = PRACTICES.find((item) => item.id === practice)!;

  return (
    <div className="calm-practice">
      <button type="button" className="calm-back" onClick={onBack}>
        Other ways through this
      </button>
      <h2 className="calm-title">{meta.title}</h2>
      <p className="calm-line">For when you feel {feeling.label.toLowerCase()}.</p>
      {practice === "prayer" ? <Prayer text={feeling.prayer.text} reference={feeling.prayer.reference} /> : null}
      {practice === "breathe" ? (
        <>
          <p className="calm-line">{feeling.breathe}</p>
          <BreathePanel box />
        </>
      ) : null}
      {practice === "music" ? <Ambient title={feeling.sound} hz={feeling.tone} /> : null}
      {practice === "speak" ? (
        <SpeakTask
          intro={feeling.task.intro}
          steps={feeling.task.steps}
          reference={feeling.task.reference}
          step={step}
          onStep={onStep}
        />
      ) : null}
    </div>
  );
}

function Prayer({ text, reference }: { text: string; reference: string }) {
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  const read = () => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    synth.speak(utterance);
  };

  return (
    <figure className="calm-prayer">
      <blockquote>{text}</blockquote>
      <figcaption>{reference}</figcaption>
      <button type="button" className="calm-secondary" onClick={read} disabled={speaking}>
        {speaking ? "Reading…" : "Read it to me"}
      </button>
    </figure>
  );
}

function SpeakTask({
  intro,
  steps,
  reference,
  step,
  onStep,
}: {
  intro: string;
  steps: string[];
  reference: string;
  step: number;
  onStep: (step: number) => void;
}) {
  const done = step >= steps.length;
  return (
    <div className="calm-task">
      <p className="calm-line">{intro}</p>
      <ol>
        {steps.map((line, index) => (
          <li key={line} className={index === step ? "is-current" : index < step ? "is-done" : undefined}>
            {line}
          </li>
        ))}
      </ol>
      <p className="calm-ref">{reference}</p>
      {done ? (
        <p className="calm-line">That is enough. Stay with the last line if you want, then come back when you are ready.</p>
      ) : (
        <button type="button" className="breathe-start" onClick={() => onStep(step + 1)}>
          {step === 0 ? "Begin" : "Next"}
        </button>
      )}
    </div>
  );
}

/** A quiet two-note bed plus a little air, made in the browser. Nothing is downloaded. */
function Ambient({ title, hz }: { title: string; hz: number }) {
  const [on, setOn] = useState(false);
  const stopRef = useRef<(() => void) | null>(null);

  const stop = () => {
    stopRef.current?.();
    stopRef.current = null;
    setOn(false);
  };

  useEffect(() => () => stopRef.current?.(), []);

  const start = () => {
    stop();
    const Ctor =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    const ctx = new Ctor();
    const master = ctx.createGain();
    master.gain.value = 0.0001;
    master.connect(ctx.destination);
    const now = ctx.currentTime;
    master.gain.exponentialRampToValueAtTime(0.07, now + 1.4);

    const voice = (freq: number, type: OscillatorType, amount: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.value = amount;
      osc.connect(gain).connect(master);
      osc.start();
      return osc;
    };
    const oscs = [voice(hz, "sine", 0.7), voice(hz * 1.498, "sine", 0.18)];

    const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 380;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.045;
    noise.connect(filter).connect(noiseGain).connect(master);
    noise.start();

    stopRef.current = () => {
      const t = ctx.currentTime;
      master.gain.cancelScheduledValues(t);
      master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), t);
      master.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
      window.setTimeout(() => {
        for (const osc of oscs) osc.stop();
        noise.stop();
        void ctx.close();
      }, 500);
    };
    setOn(true);
  };

  return (
    <div className="calm-sound">
      <p className="calm-line">{title} Leave it on while you sit, or stop it whenever you like.</p>
      <button type="button" className={on ? "breathe-stop" : "breathe-start"} onClick={on ? stop : start}>
        {on ? "Stop" : "Play"}
      </button>
    </div>
  );
}
