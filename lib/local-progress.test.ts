import { beforeEach, describe, expect, it } from "vitest";
import {
  LEGACY_SESSION_KEY,
  LEGACY_USERS_KEY,
  loadProgress,
  saveProgress,
  scrubLegacyPasswords,
} from "./local-progress";
import { SIGNUP_COINS } from "./economy";

function memoryStorage() {
  const map = new Map<string, string>();
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
    map,
  };
}

const legacyUsers = [
  { email: "Reader@Example.com", password: "hunter2", coins: 740, attempts: [], masteredSeries: ["bible-foundations"], donatedCents: 500 },
  { email: "other@example.com", password: "pw", coins: 10, attempts: [], masteredSeries: [], donatedCents: 0 },
  { email: "maple@lampstand.demo", password: "demo", coins: 1840, attempts: [], masteredSeries: [], donatedCents: 0 },
];

describe("loadProgress", () => {
  let store: ReturnType<typeof memoryStorage>;
  beforeEach(() => {
    store = memoryStorage();
  });

  it("starts a new account at the sign-up coin balance", () => {
    const progress = loadProgress(store, "u1", "new@example.com");
    expect(progress.coins).toBe(SIGNUP_COINS);
    expect(progress.premiumGrantClaimed).toBe(false);
  });

  it("carries over a legacy browser account with the same email, then removes it", () => {
    store.setItem(LEGACY_USERS_KEY, JSON.stringify(legacyUsers));
    store.setItem(LEGACY_SESSION_KEY, "Reader@Example.com");

    const progress = loadProgress(store, "u1", "reader@example.com");
    expect(progress).toMatchObject({ coins: 740, masteredSeries: ["bible-foundations"], donatedCents: 500 });

    const remaining = JSON.parse(store.getItem(LEGACY_USERS_KEY)!);
    expect(remaining.map((u: { email: string }) => u.email)).toEqual(["other@example.com"]);
    expect(store.getItem(LEGACY_SESSION_KEY)).toBeNull();
  });

  it("returns saved progress on later loads", () => {
    saveProgress(store, "u1", { coins: 5, attempts: [], masteredSeries: [], donatedCents: 0, premiumGrantClaimed: true });
    expect(loadProgress(store, "u1", "x@example.com")).toMatchObject({ coins: 5, premiumGrantClaimed: true });
  });
});

describe("scrubLegacyPasswords", () => {
  it("removes plain-text passwords and demo accounts", () => {
    const store = memoryStorage();
    store.setItem(LEGACY_USERS_KEY, JSON.stringify(legacyUsers));
    scrubLegacyPasswords(store);
    const users = JSON.parse(store.getItem(LEGACY_USERS_KEY)!);
    expect(users).toHaveLength(2);
    expect(users.every((u: object) => !("password" in u))).toBe(true);
  });
});
