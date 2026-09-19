export type Category = {
  slug: string;
  name: string;
  description: string;
  expert?: string;
};

export type ImageAspectRatio = "16:9" | "4:3" | "1:1" | "9:16" | "3:4";

export type QuestionImageInstruction = {
  /** Detailed scene or subject description for Imagen */
  subject: string;
  /** Camera angle or shot composition (e.g., 'wide establishing shot', 'low angle', 'dramatic close-up') */
  composition?: string;
  /** Lighting atmosphere (e.g., 'chiaroscuro candle light', 'golden hour sunrise', 'harsh desert sun') */
  lighting?: string;
  /** Optional question-specific style override */
  styleOverride?: string;
  /** Optional negative prompt override */
  negativePromptOverride?: string;
  /** Optional aspect ratio override */
  aspectRatio?: ImageAspectRatio;
};

export type QuizImageConfig = {
  /** Category or custom art style preset */
  stylePreset?: string;
  /** Custom style directive appended to every prompt in this quiz */
  stylePrompt?: string;
  /** Default negative prompt for this quiz (what to avoid) */
  negativePrompt?: string;
  /** Image aspect ratio (default: "16:9") */
  aspectRatio?: ImageAspectRatio;
};

export type Question = {
  prompt: string;
  choices: string[];
  answerIndex: number;
  explanation: string;
  image?: string;
  /** Detailed image generation instructions for this question */
  imageInstruction?: QuestionImageInstruction | string;
};

export type QuizChapter = {
  title: string;
  subtitle?: string;
  startIndex: number;
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
  /** Long sitting (50+ items). Mid-roll ads for free users, modeled on paginated quiz pages. */
  isLongform?: boolean;
  /** Epoch chapters for structural chunking of long sittings. */
  chapters?: QuizChapter[];
  /** Quiz-wide image generation settings and art direction */
  imageConfig?: QuizImageConfig;
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
