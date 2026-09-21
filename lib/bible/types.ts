export type Testament = "OT" | "NT";

export interface WordSpark {
  id: string;
  term: string;
  language: "Hebrew" | "Greek" | "Aramaic";
  originalScript: string;
  transliteration: string;
  rootMeaning: string;
  culturalInsight: string;
}

export interface Verse {
  number: number;
  text: string;
  sparkIds?: string[];
}

export interface CheckInQuestion {
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
}

export interface StorySlide {
  id: string;
  type: "hook" | "verse" | "insight" | "question";
  artworkUrl: string;
  badge?: string;
  title?: string;
  scriptureRef?: string;
  text: string;
  spark?: WordSpark;
  question?: CheckInQuestion;
}

export interface Chapter {
  bookSlug: string;
  bookTitle: string;
  chapterNumber: number;
  title: string;
  subtitle: string;
  thematicHook: string;
  artworkUrl: string;
  verses: Verse[];
  sparks: Record<string, WordSpark>;
  checkInQuestions: CheckInQuestion[];
  storySlides: StorySlide[];
  coinsReward: number;
}

export interface Book {
  slug: string;
  title: string;
  testament: Testament;
  totalChapters: number;
  summary: string;
  featuredChapterNumbers: number[];
}

export interface ReadingPlan {
  slug: string;
  title: string;
  subtitle: string;
  days: number;
  description: string;
  badge: string;
  chapters: { bookSlug: string; chapterNumber: number; day: number }[];
}

export interface ReadingProgress {
  completedChapters: string[]; // "genesis-1", etc.
  completedStories: string[];
  streakDays: number;
  lastReadDate: string | null;
  totalCoinsEarned: number;
}
