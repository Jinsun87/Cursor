"use client";

/**
 * First-visit onboarding answers, kept on this device. Nothing here is
 * required: every step can be skipped, and the app works the same without it.
 */
export type Intent = "sleep" | "anxious" | "read" | "closer" | "hard" | "looking";
export type ListenWhen = "walk" | "sleep" | "both";

export type OnboardingAnswers = {
  done: boolean;
  intent?: Intent;
  when?: ListenWhen;
  name?: string;
  rain?: boolean;
};

const KEY = "lampstand-onboarding";

export function readOnboarding(): OnboardingAnswers {
  try {
    return { done: false, ...(JSON.parse(localStorage.getItem(KEY) ?? "{}") as Partial<OnboardingAnswers>) };
  } catch {
    // Storage blocked (private mode): treat as done so nobody is stuck in onboarding.
    return { done: true };
  }
}

export function saveOnboarding(patch: Partial<OnboardingAnswers>) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...readOnboarding(), ...patch }));
  } catch {
    // A convenience only.
  }
}

/** Which tab to open after onboarding. */
export function startTab(a: OnboardingAnswers): "walk" | "sleep" | "breathe" {
  if (a.intent === "anxious" && a.when !== "sleep") return "breathe";
  if (a.when === "walk") return "walk";
  if (a.when === "sleep" || a.intent === "sleep") return "sleep";
  return new Date().getHours() >= 18 || new Date().getHours() < 5 ? "sleep" : "walk";
}
