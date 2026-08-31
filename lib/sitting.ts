import type { Question } from "./types";

export const SITTING_PREFIX = "quizforge-sitting-v1:";
export const SITTING_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type Sitting = {
  slug: string;
  index: number;
  picked: number | null;
  correctCount: number;
  answered: number;
  streak: number;
  pageBreak: boolean;
  hiddenChoices: number[];
  deck: Question[];
  savedAt: string;
};

export function sittingKey(slug: string) {
  return `${SITTING_PREFIX}${slug}`;
}

export function medalsPlated(answered: number, every: number, total?: number) {
  if (every <= 0 || answered <= 0) return 0;
  if (total && answered >= total) return Math.ceil(total / every);
  return Math.floor(answered / every);
}

export function isFreshSitting(savedAt: string, now = Date.now(), ttl = SITTING_TTL_MS) {
  const t = Date.parse(savedAt);
  if (Number.isNaN(t)) return false;
  return now - t <= ttl;
}

export function sittingIsResumable(
  sitting: Sitting | null,
  slug: string,
  questionCount: number,
  now = Date.now(),
): sitting is Sitting {
  if (!sitting) return false;
  if (sitting.slug !== slug) return false;
  if (sitting.deck.length !== questionCount) return false;
  if (sitting.index < 0 || sitting.index >= questionCount) return false;
  return isFreshSitting(sitting.savedAt, now);
}

type Store = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export function loadSitting(slug: string, storage?: Store | null): Sitting | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(sittingKey(slug));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Sitting;
    if (!parsed || typeof parsed.slug !== "string" || !Array.isArray(parsed.deck)) {
      return null;
    }
    if (!Array.isArray(parsed.hiddenChoices)) parsed.hiddenChoices = [];
    return parsed;
  } catch {
    return null;
  }
}

export function saveSitting(sitting: Sitting, storage?: Store | null) {
  if (!storage) return;
  storage.setItem(sittingKey(sitting.slug), JSON.stringify(sitting));
}

export function clearSitting(slug: string, storage?: Store | null) {
  if (!storage) return;
  storage.removeItem(sittingKey(slug));
}

export function browserStorage(): Store | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}
