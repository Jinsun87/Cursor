export type Category = {
  slug: string;
  name: string;
  description: string;
  expert?: string;
};

export type Question = {
  prompt: string;
  choices: string[];
  answerIndex: number;
  explanation: string;
};

export type Quiz = {
  slug: string;
  title: string;
  blurb: string;
  category: string;
  seriesSlug?: string;
  isReview?: boolean;
  isSecret?: boolean;
  isDaily?: boolean;
  expert?: string;
  coinsOnComplete: number;
  questions: Question[];
};

export type Series = {
  slug: string;
  title: string;
  description: string;
  category: string;
  quizSlugs: string[];
  reviewSlug: string;
  masteryThreshold: number;
};

export type Attempt = {
  quizSlug: string;
  score: number;
  total: number;
  completedAt: string;
};

export type User = {
  email: string;
  username: string;
  password: string;
  coins: number;
  premium: boolean;
  premiumPlan?: "monthly" | "annual";
  createdAt: string;
  attempts: Attempt[];
  masteredSeries: string[];
  donatedCents: number;
  newsletter: boolean;
};

export type AppState = {
  user: User | null;
};
