"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Attempt, User } from "./types";
import { getQuiz, getSeries } from "./catalog";

const STORAGE_KEY = "quizforge-users-v1";
const SESSION_KEY = "quizforge-session-v1";

type Store = {
  user: User | null;
  ready: boolean;
  register: (input: {
    email: string;
    username: string;
    password: string;
    newsletter: boolean;
  }) => string | null;
  login: (email: string, password: string) => string | null;
  logout: () => void;
  recordAttempt: (quizSlug: string, score: number, total: number) => {
    coinsEarned: number;
    mastered?: string;
  };
  upgrade: (plan: "monthly" | "annual") => void;
  donate: (cents: number) => void;
  bestScore: (quizSlug: string) => Attempt | undefined;
  seriesProgress: (seriesSlug: string) => {
    completed: number;
    total: number;
    reviewBest?: number;
    mastered: boolean;
    canTakeReview: boolean;
  };
};

const Ctx = createContext<Store | null>(null);

function loadUsers(): User[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as User[];
  } catch {
    return [];
  }
}

function saveUsers(users: User[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function seedLeaderboard(): User[] {
  const existing = loadUsers();
  if (existing.some((u) => u.email.endsWith("@quizforge.demo"))) return existing;
  const demos: User[] = [
    {
      email: "maple@quizforge.demo",
      username: "MapleMind",
      password: "demo",
      coins: 1840,
      premium: true,
      premiumPlan: "annual",
      createdAt: new Date().toISOString(),
      attempts: [],
      masteredSeries: ["geography-1"],
      donatedCents: 2500,
      newsletter: false,
    },
    {
      email: "ridge@quizforge.demo",
      username: "RidgeRunner",
      password: "demo",
      coins: 920,
      premium: false,
      createdAt: new Date().toISOString(),
      attempts: [],
      masteredSeries: ["survival-essentials"],
      donatedCents: 0,
      newsletter: false,
    },
    {
      email: "atlas@quizforge.demo",
      username: "AtlasQuiz",
      password: "demo",
      coins: 610,
      premium: false,
      createdAt: new Date().toISOString(),
      attempts: [],
      masteredSeries: [],
      donatedCents: 500,
      newsletter: false,
    },
  ];
  const merged = [...existing, ...demos];
  saveUsers(merged);
  return merged;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const users = seedLeaderboard();
    const email = localStorage.getItem(SESSION_KEY);
    if (email) {
      const found = users.find((u) => u.email === email);
      if (found) setUser(found);
    }
    setReady(true);
  }, []);

  const persist = useCallback((next: User | null) => {
    setUser(next);
    const users = loadUsers();
    if (!next) {
      localStorage.removeItem(SESSION_KEY);
      return;
    }
    const idx = users.findIndex((u) => u.email === next.email);
    if (idx >= 0) users[idx] = next;
    else users.push(next);
    saveUsers(users);
    localStorage.setItem(SESSION_KEY, next.email);
  }, []);

  const register: Store["register"] = (input) => {
    const users = loadUsers();
    if (users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
      return "That email already has an account.";
    }
    if (users.some((u) => u.username.toLowerCase() === input.username.toLowerCase())) {
      return "That username is taken.";
    }
    const next: User = {
      email: input.email.trim(),
      username: input.username.trim(),
      password: input.password,
      coins: 100,
      premium: false,
      createdAt: new Date().toISOString(),
      attempts: [],
      masteredSeries: [],
      donatedCents: 0,
      newsletter: input.newsletter,
    };
    persist(next);
    return null;
  };

  const login: Store["login"] = (email, password) => {
    const users = loadUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    );
    if (!found) return "Email or password is incorrect.";
    persist(found);
    return null;
  };

  const logout = () => persist(null);

  const recordAttempt: Store["recordAttempt"] = (quizSlug, score, total) => {
    if (!user) return { coinsEarned: 0 };
    const quiz = getQuiz(quizSlug);
    const pct = total ? Math.round((score / total) * 100) : 0;
    const coinsEarned = (quiz?.coinsOnComplete ?? 50) + score * 10;
    const attempt: Attempt = {
      quizSlug,
      score,
      total,
      completedAt: new Date().toISOString(),
    };
    const attempts = [...user.attempts, attempt];
    let masteredSeries = [...user.masteredSeries];
    let mastered: string | undefined;
    const series = quiz?.seriesSlug ? getSeries(quiz.seriesSlug) : undefined;
    if (series && quiz?.isReview) {
      const packDone = series.quizSlugs.every((slug) =>
        attempts.some((a) => a.quizSlug === slug),
      );
      const reviewOk = pct >= series.masteryThreshold;
      if (packDone && reviewOk && !masteredSeries.includes(series.slug)) {
        masteredSeries = [...masteredSeries, series.slug];
        mastered = series.title;
      }
    }
    persist({
      ...user,
      coins: user.coins + coinsEarned,
      attempts,
      masteredSeries,
    });
    return { coinsEarned, mastered };
  };

  const upgrade: Store["upgrade"] = (plan) => {
    if (!user) return;
    persist({
      ...user,
      premium: true,
      premiumPlan: plan,
      coins: user.coins + 5000,
    });
  };

  const donate: Store["donate"] = (cents) => {
    if (!user) return;
    persist({ ...user, donatedCents: user.donatedCents + cents, coins: user.coins + Math.floor(cents / 10) });
  };

  const bestScore = (quizSlug: string) => {
    if (!user) return undefined;
    return user.attempts
      .filter((a) => a.quizSlug === quizSlug)
      .sort((a, b) => b.score / b.total - a.score / a.total)[0];
  };

  const seriesProgress = (seriesSlug: string) => {
    const series = getSeries(seriesSlug);
    if (!series) {
      return { completed: 0, total: 0, mastered: false, canTakeReview: false };
    }
    const completed = series.quizSlugs.filter((slug) =>
      user?.attempts.some((a) => a.quizSlug === slug),
    ).length;
    const review = user?.attempts
      .filter((a) => a.quizSlug === series.reviewSlug)
      .sort((a, b) => b.score / b.total - a.score / a.total)[0];
    return {
      completed,
      total: series.quizSlugs.length,
      reviewBest: review ? Math.round((review.score / review.total) * 100) : undefined,
      mastered: Boolean(user?.masteredSeries.includes(seriesSlug)),
      canTakeReview: completed === series.quizSlugs.length,
    };
  };

  const value = useMemo(
    () => ({
      user,
      ready,
      register,
      login,
      logout,
      recordAttempt,
      upgrade,
      donate,
      bestScore,
      seriesProgress,
    }),
    [user, ready],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export function listPublicProfiles(): Pick<User, "username" | "coins" | "premium" | "masteredSeries" | "attempts">[] {
  if (typeof window === "undefined") return [];
  return loadUsers().map((u) => ({
    username: u.username,
    coins: u.coins,
    premium: u.premium,
    masteredSeries: u.masteredSeries,
    attempts: u.attempts,
  }));
}
