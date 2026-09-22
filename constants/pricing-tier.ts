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
    description: "Ideal for daily Scripture reading and individual trivia practice.",
    features: [
      "Access to daily Scripture quizzes",
      "Standard reading mode & progress tracking",
      "Earn coins on every correct answer",
      "Public quiz catalog & leaderboards",
    ],
    featured: false,
    priceId: {
      month: process.env.NEXT_PUBLIC_PADDLE_STARTER_MONTHLY_PRICE_ID || "",
      year: process.env.NEXT_PUBLIC_PADDLE_STARTER_ANNUAL_PRICE_ID || "",
    },
  },
  {
    name: "Pro",
    description: "Unrestricted access to all Scripture packs, Quiet room, and certificates.",
    features: [
      "7-day free trial on all plans",
      "Ad-free secret quizzes (Quiet room)",
      "Certificates of Mastery at 70%+ review",
      "5,000 bonus coins on upgrade",
      "Exclusive Lampstand Pro profile badge",
      "Early access to new series and packs",
    ],
    featured: true,
    priceId: {
      month: process.env.NEXT_PUBLIC_PADDLE_MONTHLY_PRICE_ID || "pri_01m3491eqp91gkse1fmpngdt7h",
      year: process.env.NEXT_PUBLIC_PADDLE_ANNUAL_PRICE_ID || "pri_01m3491f04x6epgafayhm6saty",
    },
  },
  {
    name: "Advanced",
    description: "Designed for study groups, ministries, and devoted patrons.",
    features: [
      "Everything included in Lampstand Pro",
      "Shared study group progress tracking",
      "Custom pack assignments for groups",
      "Patron recognition on the platform",
      "Direct priority feature requests & support",
    ],
    featured: false,
    priceId: {
      month: process.env.NEXT_PUBLIC_PADDLE_ADVANCED_MONTHLY_PRICE_ID || "",
      year: process.env.NEXT_PUBLIC_PADDLE_ADVANCED_ANNUAL_PRICE_ID || "",
    },
  },
];
