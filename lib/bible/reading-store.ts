"use client";

import { useEffect, useState, useCallback } from "react";
import type { ReadingProgress } from "./types";

const STORAGE_KEY = "lampstand-reading-progress-v1";
const PREFS_KEY = "lampstand-reader-prefs-v1";

export interface ReaderPreferences {
  fontSize: "normal" | "large" | "xlarge";
  showVerseNumbers: boolean;
  preferredMode: "story" | "scroll";
}

const DEFAULT_PROGRESS: ReadingProgress = {
  completedChapters: [],
  completedStories: [],
  currentCourseDay: 1,
  completedCourseDays: [],
  streakDays: 0,
  lastReadDate: null,
  totalCoinsEarned: 0,
};

const DEFAULT_PREFS: ReaderPreferences = {
  fontSize: "normal",
  showVerseNumbers: true,
  preferredMode: "story",
};

export function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0];
}

export function calculateStreak(lastReadDate: string | null, currentStreak: number): number {
  if (!lastReadDate) return 1;
  const today = getTodayDateString();
  if (lastReadDate === today) return currentStreak; // already read today

  const lastDate = new Date(lastReadDate);
  const now = new Date(today);
  const diffTime = Math.abs(now.getTime() - lastDate.getTime());
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return currentStreak + 1; // Consecutive day!
  }
  return 1; // Streak broken, restart at 1
}

export function useReadingTracker() {
  const [progress, setProgress] = useState<ReadingProgress>(DEFAULT_PROGRESS);
  const [prefs, setPrefs] = useState<ReaderPreferences>(DEFAULT_PREFS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const savedProg = localStorage.getItem(STORAGE_KEY);
      if (savedProg) {
        const parsed = JSON.parse(savedProg);
        setProgress({
          ...DEFAULT_PROGRESS,
          ...parsed,
          completedCourseDays: parsed.completedCourseDays || [],
          currentCourseDay: parsed.currentCourseDay || 1,
        });
      }
      const savedPrefs = localStorage.getItem(PREFS_KEY);
      if (savedPrefs) {
        setPrefs(JSON.parse(savedPrefs));
      }
    } catch (e) {
      console.error("Failed to load reading state", e);
    }
    setReady(true);
  }, []);

  const saveProgress = useCallback((next: ReadingProgress) => {
    setProgress(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  }, []);

  const updatePrefs = useCallback((next: Partial<ReaderPreferences>) => {
    setPrefs((prev) => {
      const updated = { ...prev, ...next };
      if (typeof window !== "undefined") {
        localStorage.setItem(PREFS_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const recordChapterCompletion = useCallback(
    (chapterKey: string, coins = 50, dayNumber?: number) => {
      const today = getTodayDateString();
      const alreadyCompleted = progress.completedChapters.includes(chapterKey);
      const newCompleted = alreadyCompleted
        ? progress.completedChapters
        : [...progress.completedChapters, chapterKey];

      const currentDays = progress.completedCourseDays || [];
      const newDays =
        dayNumber && !currentDays.includes(dayNumber)
          ? [...currentDays, dayNumber].sort((a, b) => a - b)
          : currentDays;

      const newStreak = calculateStreak(progress.lastReadDate, progress.streakDays);

      const nextState: ReadingProgress = {
        completedChapters: newCompleted,
        completedStories: progress.completedStories,
        completedCourseDays: newDays,
        currentCourseDay: dayNumber ? Math.min(30, Math.max(progress.currentCourseDay || 1, dayNumber + 1)) : progress.currentCourseDay || 1,
        streakDays: newStreak,
        lastReadDate: today,
        totalCoinsEarned: progress.totalCoinsEarned + (alreadyCompleted ? 10 : coins),
      };

      saveProgress(nextState);
      return { earned: alreadyCompleted ? 10 : coins, streak: newStreak };
    },
    [progress, saveProgress],
  );

  const recordStoryCompletion = useCallback(
    (chapterKey: string, coins = 25, dayNumber?: number) => {
      const today = getTodayDateString();
      const alreadyCompleted = progress.completedStories.includes(chapterKey);
      const newStories = alreadyCompleted
        ? progress.completedStories
        : [...progress.completedStories, chapterKey];

      const currentDays = progress.completedCourseDays || [];
      const newDays =
        dayNumber && !currentDays.includes(dayNumber)
          ? [...currentDays, dayNumber].sort((a, b) => a - b)
          : currentDays;

      const newStreak = calculateStreak(progress.lastReadDate, progress.streakDays);

      const nextState: ReadingProgress = {
        completedChapters: progress.completedChapters,
        completedStories: newStories,
        completedCourseDays: newDays,
        currentCourseDay: dayNumber ? Math.min(30, Math.max(progress.currentCourseDay || 1, dayNumber + 1)) : progress.currentCourseDay || 1,
        streakDays: newStreak,
        lastReadDate: today,
        totalCoinsEarned: progress.totalCoinsEarned + (alreadyCompleted ? 5 : coins),
      };

      saveProgress(nextState);
      return { earned: alreadyCompleted ? 5 : coins, streak: newStreak };
    },
    [progress, saveProgress],
  );

  return {
    progress,
    prefs,
    ready,
    updatePrefs,
    recordChapterCompletion,
    recordStoryCompletion,
  };
}
