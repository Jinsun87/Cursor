import type { Attempt } from "./types";
import { SIGNUP_COINS } from "./economy";

// Per-account progress kept in this browser until server-side progress sync.
// Also migrates the old browser-only accounts (which stored plain-text
// passwords) into the signed-in account, and scrubs those passwords.

export type LocalProgress = {
  coins: number;
  attempts: Attempt[];
  masteredSeries: string[];
  donatedCents: number;
  /** Premium's one-time coin grant has been added. */
  premiumGrantClaimed: boolean;
};

type KeyValueStore = Pick<Storage, "getItem" | "setItem" | "removeItem">;

const PROGRESS_PREFIX = "lampstand-progress-v2:";
export const LEGACY_USERS_KEY = "lampstand-users-v1";
export const LEGACY_SESSION_KEY = "lampstand-session-v1";

type LegacyUser = {
  email?: string;
  password?: string;
  coins?: number;
  attempts?: Attempt[];
  masteredSeries?: string[];
  donatedCents?: number;
};

export function emptyProgress(): LocalProgress {
  return { coins: SIGNUP_COINS, attempts: [], masteredSeries: [], donatedCents: 0, premiumGrantClaimed: false };
}

function readJson<T>(store: KeyValueStore, key: string): T | null {
  try {
    const raw = store.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

/**
 * Load progress for an account. On first load for that account, carry over a
 * matching legacy browser account (same email) if there is one.
 */
export function loadProgress(store: KeyValueStore, userId: string, email: string): LocalProgress {
  const saved = readJson<LocalProgress>(store, PROGRESS_PREFIX + userId);
  if (saved) return { ...emptyProgress(), ...saved };

  const legacy = takeLegacyUser(store, email);
  const progress: LocalProgress = legacy
    ? {
        ...emptyProgress(),
        coins: legacy.coins ?? SIGNUP_COINS,
        attempts: legacy.attempts ?? [],
        masteredSeries: legacy.masteredSeries ?? [],
        donatedCents: legacy.donatedCents ?? 0,
      }
    : emptyProgress();
  saveProgress(store, userId, progress);
  return progress;
}

export function saveProgress(store: KeyValueStore, userId: string, progress: LocalProgress): void {
  try {
    store.setItem(PROGRESS_PREFIX + userId, JSON.stringify(progress));
  } catch {
    // Storage full or blocked: progress for this session stays in memory.
  }
}

/** Remove and return the legacy account for this email; drop demo accounts and the old session. */
function takeLegacyUser(store: KeyValueStore, email: string): LegacyUser | null {
  const users = readJson<LegacyUser[]>(store, LEGACY_USERS_KEY);
  store.removeItem(LEGACY_SESSION_KEY);
  if (!Array.isArray(users)) return null;

  const wanted = email.trim().toLowerCase();
  const match = users.find((u) => u.email?.trim().toLowerCase() === wanted) ?? null;
  const rest = users.filter((u) => u !== match && !u.email?.endsWith("@lampstand.demo"));
  if (rest.length) store.setItem(LEGACY_USERS_KEY, JSON.stringify(rest));
  else store.removeItem(LEGACY_USERS_KEY);
  return match;
}

/** Strip plain-text passwords left by the old browser-only accounts. */
export function scrubLegacyPasswords(store: KeyValueStore): void {
  const users = readJson<LegacyUser[]>(store, LEGACY_USERS_KEY);
  if (!Array.isArray(users) || !users.some((u) => "password" in u)) return;
  const scrubbed = users
    .filter((u) => !u.email?.endsWith("@lampstand.demo"))
    .map(({ password: _password, ...rest }) => rest);
  if (scrubbed.length) store.setItem(LEGACY_USERS_KEY, JSON.stringify(scrubbed));
  else store.removeItem(LEGACY_USERS_KEY);
}
