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
import type { User as AuthUser } from "@supabase/supabase-js";
import type { Attempt, User } from "./types";
import { getQuiz, getSeries } from "./catalog";
import {
  PREMIUM_COIN_GRANT,
  coinsForAttempt,
  coinsForDonation,
  DEFAULT_COMPLETE_COINS,
  masteryFromReview,
} from "./economy";
import { hasPremium, planForPrice, primarySubscription, type SubscriptionRow } from "./entitlement";
import { loadProgress, saveProgress, scrubLegacyPasswords, type LocalProgress } from "./local-progress";
import { getBrowserSupabase } from "./supabase/client";

type SignUpInput = {
  email: string;
  username: string;
  newsletter: boolean;
  /** Optional: without one, the account signs in by email link only. */
  password?: string;
  next?: string;
};

type Store = {
  user: User | null;
  ready: boolean;
  /** False when Supabase keys are not configured (local dev / CI). */
  accountsAvailable: boolean;
  sendSignInLink: (email: string, next?: string) => Promise<string | null>;
  signInWithPassword: (email: string, password: string) => Promise<string | null>;
  signInWithGoogle: (next?: string) => Promise<string | null>;
  /** Resolves to an error message, or null when the confirmation email was sent / user is signed in. */
  signUp: (input: SignUpInput) => Promise<{ error: string | null; signedIn: boolean }>;
  logout: () => Promise<void>;
  /** Re-read profile and subscription from the server (e.g. after checkout). */
  refreshAccount: () => Promise<User | null>;
  recordAttempt: (quizSlug: string, score: number, total: number) => {
    coinsEarned: number;
    mastered?: string;
  };
  donate: (cents: number) => void;
  spendCoins: (amount: number) => boolean;
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

const UNAVAILABLE = "Accounts are not available right now. Please try again later.";

const PRICE_IDS = {
  monthly: [
    process.env.NEXT_PUBLIC_PADDLE_MONTHLY_PRICE_ID,
    process.env.NEXT_PUBLIC_PADDLE_STARTER_MONTHLY_PRICE_ID,
    process.env.NEXT_PUBLIC_PADDLE_ADVANCED_MONTHLY_PRICE_ID,
  ].filter((id): id is string => Boolean(id)),
  annual: [
    process.env.NEXT_PUBLIC_PADDLE_ANNUAL_PRICE_ID,
    process.env.NEXT_PUBLIC_PADDLE_STARTER_ANNUAL_PRICE_ID,
    process.env.NEXT_PUBLIC_PADDLE_ADVANCED_ANNUAL_PRICE_ID,
  ].filter((id): id is string => Boolean(id)),
};

function confirmUrl(next = "/profile"): string {
  return `${window.location.origin}/auth/confirm?next=${encodeURIComponent(next)}`;
}

function friendlyAuthError(message: string): string {
  if (/invalid login credentials/i.test(message)) return "Email or password is incorrect.";
  if (/email not confirmed/i.test(message)) return "Please open the confirmation link we emailed you first.";
  if (/rate limit|too many/i.test(message)) return "Too many attempts. Please wait a minute and try again.";
  if (/signups not allowed|user not found/i.test(message)) return "We couldn't find an account with that email.";
  return message;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const supabase = getBrowserSupabase();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  const loadAccount = useCallback(
    async (authUser: AuthUser | null): Promise<User | null> => {
      if (!supabase || !authUser) {
        setUser(null);
        return null;
      }

      const [{ data: profile }, { data: subs }] = await Promise.all([
        supabase.from("profiles").select("username, newsletter, created_at").eq("id", authUser.id).maybeSingle(),
        supabase
          .from("subscriptions")
          .select("status, price_id, current_period_end, scheduled_change, paddle_updated_at"),
      ]);
      const subscriptions = (subs ?? []) as Pick<
        SubscriptionRow,
        "status" | "price_id" | "current_period_end" | "scheduled_change" | "paddle_updated_at"
      >[];
      const premium = hasPremium(subscriptions);
      const primary = primarySubscription(subscriptions);
      const email = authUser.email ?? "";

      let progress = loadProgress(localStorage, authUser.id, email);
      if (premium && !progress.premiumGrantClaimed) {
        progress = { ...progress, coins: progress.coins + PREMIUM_COIN_GRANT, premiumGrantClaimed: true };
        saveProgress(localStorage, authUser.id, progress);
      }

      const next: User = {
        id: authUser.id,
        email,
        username: profile?.username ?? email.split("@")[0],
        newsletter: Boolean(profile?.newsletter),
        createdAt: profile?.created_at ?? authUser.created_at,
        premium,
        premiumPlan: premium ? planForPrice(primary?.price_id, PRICE_IDS) : undefined,
        premiumScheduledChange: premium ? (primary?.scheduled_change ?? undefined) : undefined,
        premiumPeriodEnd: premium ? (primary?.current_period_end ?? undefined) : undefined,
        coins: progress.coins,
        attempts: progress.attempts,
        masteredSeries: progress.masteredSeries,
        donatedCents: progress.donatedCents,
      };
      setUser(next);
      return next;
    },
    [supabase],
  );

  useEffect(() => {
    scrubLegacyPasswords(localStorage);
    if (!supabase) {
      setReady(true);
      return;
    }
    // INITIAL_SESSION fires immediately on subscribe. Supabase calls made inside
    // this callback can deadlock the auth client, so defer the profile load.
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "TOKEN_REFRESHED") return;
      setTimeout(() => {
        void loadAccount(session?.user ?? null).finally(() => setReady(true));
      }, 0);
    });
    return () => data.subscription.unsubscribe();
  }, [supabase, loadAccount]);

  /** Write progress fields of the current user to this browser. */
  const persistProgress = useCallback((next: User) => {
    setUser(next);
    const progress: LocalProgress = {
      coins: next.coins,
      attempts: next.attempts,
      masteredSeries: next.masteredSeries,
      donatedCents: next.donatedCents,
      // Sticky: the grant is paid once per account even if Premium lapses and returns.
      premiumGrantClaimed: loadProgress(localStorage, next.id, next.email).premiumGrantClaimed,
    };
    saveProgress(localStorage, next.id, progress);
  }, []);

  const sendSignInLink: Store["sendSignInLink"] = async (email, next) => {
    if (!supabase) return UNAVAILABLE;
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: false, emailRedirectTo: confirmUrl(next) },
    });
    return error ? friendlyAuthError(error.message) : null;
  };

  const signInWithPassword: Store["signInWithPassword"] = async (email, password) => {
    if (!supabase) return UNAVAILABLE;
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    return error ? friendlyAuthError(error.message) : null;
  };

  const signInWithGoogle: Store["signInWithGoogle"] = async (next) => {
    if (!supabase) return UNAVAILABLE;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: confirmUrl(next) },
    });
    return error ? friendlyAuthError(error.message) : null;
  };

  const signUp: Store["signUp"] = async (input) => {
    if (!supabase) return { error: UNAVAILABLE, signedIn: false };
    const username = input.username.trim();
    const { data: available, error: checkError } = await supabase.rpc("username_available", {
      candidate: username,
    });
    if (checkError) return { error: "Could not check that username. Please try again.", signedIn: false };
    if (!available) return { error: "That username is taken.", signedIn: false };

    const options = {
      emailRedirectTo: confirmUrl(input.next),
      data: { username, newsletter: input.newsletter },
    };
    if (input.password) {
      const { data, error } = await supabase.auth.signUp({ email: input.email.trim(), password: input.password, options });
      if (error) return { error: friendlyAuthError(error.message), signedIn: false };
      return { error: null, signedIn: Boolean(data.session) };
    }
    const { error } = await supabase.auth.signInWithOtp({
      email: input.email.trim(),
      options: { ...options, shouldCreateUser: true },
    });
    return { error: error ? friendlyAuthError(error.message) : null, signedIn: false };
  };

  const logout = async () => {
    await supabase?.auth.signOut();
    setUser(null);
  };

  const refreshAccount = useCallback(async () => {
    if (!supabase) return null;
    const { data } = await supabase.auth.getUser();
    return loadAccount(data.user);
  }, [supabase, loadAccount]);

  const recordAttempt: Store["recordAttempt"] = (quizSlug, score, total) => {
    if (!user) return { coinsEarned: 0 };
    const quiz = getQuiz(quizSlug);
    const coinsEarned = coinsForAttempt(quiz?.coinsOnComplete ?? DEFAULT_COMPLETE_COINS, score);
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
    if (series) {
      const result = masteryFromReview({
        series,
        isReviewQuiz: Boolean(quiz?.isReview),
        attemptsIncludingThis: attempts,
        alreadyMastered: masteredSeries,
        score,
        total,
      });
      if (result.masteredTitle) {
        masteredSeries = [...masteredSeries, series.slug];
        mastered = result.masteredTitle;
      }
    }
    persistProgress({
      ...user,
      coins: user.coins + coinsEarned,
      attempts,
      masteredSeries,
    });
    return { coinsEarned, mastered };
  };

  const donate: Store["donate"] = (cents) => {
    if (!user) return;
    persistProgress({
      ...user,
      donatedCents: user.donatedCents + cents,
      coins: user.coins + coinsForDonation(cents),
    });
  };

  const spendCoins: Store["spendCoins"] = (amount) => {
    if (!user || amount <= 0 || user.coins < amount) return false;
    persistProgress({ ...user, coins: user.coins - amount });
    return true;
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
      accountsAvailable: Boolean(supabase),
      sendSignInLink,
      signInWithPassword,
      signInWithGoogle,
      signUp,
      logout,
      refreshAccount,
      recordAttempt,
      donate,
      spendCoins,
      bestScore,
      seriesProgress,
    }),
    [user, ready, supabase, refreshAccount],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
