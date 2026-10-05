"use client";

import { useState } from "react";

/**
 * The streak, drawn as an oil lamp. The flame grows with today's listening and
 * burns full once the reader reaches 10 minutes; the number beside it is how
 * many days in a row the lamp has been lit.
 */
export function Lamp({
  progress,
  streak,
  minutesToday,
  goalMinutes,
}: {
  progress: number;
  streak: number;
  minutesToday: number;
  goalMinutes: number;
}) {
  const [explain, setExplain] = useState(false);
  const lit = progress >= 1;
  const flame = 0.45 + 0.55 * progress;
  const minutesLeft = Math.max(0, Math.ceil(goalMinutes - minutesToday));

  return (
    <div className="lamp-wrap">
      <button
        type="button"
        className="lamp-button"
        onClick={() => setExplain((v) => !v)}
        aria-label={`Your lamp: ${Math.floor(minutesToday)} of ${goalMinutes} minutes today, ${streak}-day streak. Tap for how it works.`}
        aria-expanded={explain}
      >
        <svg viewBox="0 0 200 170" width="200" height="170" aria-hidden="true">
          <defs>
            <radialGradient id="lamp-glow">
              <stop offset="0%" stopColor="#ffd98a" stopOpacity={0.55 * progress + 0.1} />
              <stop offset="60%" stopColor="#e4a53c" stopOpacity={0.18 * progress} />
              <stop offset="100%" stopColor="#e4a53c" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="lamp-clay" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c99a55" />
              <stop offset="100%" stopColor="#7a5427" />
            </linearGradient>
            <linearGradient id="lamp-flame" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#fff4cf" />
              <stop offset="45%" stopColor="#ffc955" />
              <stop offset="100%" stopColor="#e2731f" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          <circle cx="146" cy="70" r={30 + 46 * progress} fill="url(#lamp-glow)" className="lamp-halo" />
          {/* Flame sits on the nozzle tip and scales from its base */}
          <g transform={`translate(146 96) scale(${flame})`} className="lamp-flame">
            <g className="lamp-flicker">
              <path d="M0 0 C -11 -10 -9 -28 0 -46 C 9 -28 11 -10 0 0 Z" fill="url(#lamp-flame)" />
              <path d="M0 -2 C -4 -8 -3 -16 0 -24 C 3 -16 4 -8 0 -2 Z" fill="#fffbea" opacity="0.9" />
            </g>
          </g>
          {/* Clay oil lamp: body, nozzle, handle, filling hole */}
          <path
            d="M40 112 C 40 92 70 84 100 84 C 124 84 136 88 146 96 C 152 100 152 108 146 112 C 132 122 112 128 100 128 C 66 128 40 126 40 112 Z"
            fill="url(#lamp-clay)"
          />
          <path d="M44 110 C 28 108 24 96 34 92" fill="none" stroke="#9c6d33" strokeWidth="6" strokeLinecap="round" />
          <ellipse cx="96" cy="96" rx="14" ry="5" fill="#4a3216" opacity="0.8" />
          <path d="M60 128 L 140 128 L 132 140 L 68 140 Z" fill="#6b4a22" />
          <rect x="54" y="140" width="92" height="6" rx="3" fill="#5a3d1b" />
        </svg>
      </button>
      <div className="lamp-caption">
        <p className="lamp-streak">{streak > 0 ? `${streak}-day streak` : "Light your lamp today"}</p>
        <p className="lamp-today">
          {lit
            ? "Lit for today. Rest well."
            : `${Math.floor(minutesToday)} of ${goalMinutes} minutes today · ${minutesLeft} to go`}
        </p>
        <div
          className="lamp-bar"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={goalMinutes}
          aria-valuenow={Math.floor(minutesToday)}
        >
          <span style={{ width: `${Math.round(progress * 100)}%` }} />
        </div>
        {explain ? (
          <p className="lamp-explain">
            Listen for 10 minutes a day, in Walk or Sleep, and your lamp stays lit. Each day it is lit adds one to your
            streak.
          </p>
        ) : null}
      </div>
    </div>
  );
}
