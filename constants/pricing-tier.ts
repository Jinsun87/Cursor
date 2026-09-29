export interface Tier {
  name: "Starter" | "Pro" | "Advanced";
  description: string;
  features: string[];
  featured?: boolean;
  priceId: {
    month: string;
    year: string;
  };
}

export const PricingTier: Tier[] = [
  {
    name: "Starter",
    description: "Free forever access to daily Scripture quizzes and personal recall progress.",
    features: [
      "100% Free forever (no card required)",
      "Access to all daily Scripture quizzes",
      "Standard reading mode & progress tracking",
      "Earn coins on every correct answer",
      "Public quiz catalog & global leaderboard",
    ],
    featured: false,
    priceId: {
      month: process.env.NEXT_PUBLIC_PADDLE_STARTER_MONTHLY_PRICE_ID || "",
      year: process.env.NEXT_PUBLIC_PADDLE_STARTER_ANNUAL_PRICE_ID || "",
    },
  },
  {
    name: "Pro",
    description: "The complete illuminated Scripture experience: ad-free reading, Quiet room, and certificates.",
    features: [
      "7-day free trial on monthly plan",
      "$4.99/mo or $39.99/yr (Save 33%)",
      "Ad-free secret quizzes & Quiet room",
      "Full access to Daily Audio Companions",
      "Official Certificates of Mastery at 70%+",
      "5,000 bonus coins on upgrade",
      "Exclusive Lampstand Pro profile badge",
    ],
    featured: true,
    priceId: {
      month: process.env.NEXT_PUBLIC_PADDLE_MONTHLY_PRICE_ID || "pri_01m3491eqp91gkse1fmpngdt7h",
      year: process.env.NEXT_PUBLIC_PADDLE_ANNUAL_PRICE_ID || "pri_01m3491f04x6epgafayhm6saty",
    },
  },
  {
    name: "Advanced",
    description: "Designed for study groups, Bible ministries, and dedicated platform benefactors.",
    features: [
      "Everything included in Lampstand Pro",
      "Shared study group progress tracking",
      "Custom pack assignments for small groups",
      "Benefactor patron recognition on platform",
      "Direct priority feature requests & support",
    ],
    featured: false,
    priceId: {
      month: process.env.NEXT_PUBLIC_PADDLE_ADVANCED_MONTHLY_PRICE_ID || "",
      year: process.env.NEXT_PUBLIC_PADDLE_ADVANCED_ANNUAL_PRICE_ID || "",
    },
  },
];

