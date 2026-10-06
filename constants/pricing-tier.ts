export interface Tier {
  name: "Starter" | "Pro";
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
    description: "Free forever: today\'s walk, Breathe, Bible quizzes and Scripture for life\'s struggles.",
    features: [
      "Free forever, no card needed",
      "Today's guided walk and the free Sleep chapters",
      "Breathe: guided breathing exercises",
      "Bible quizzes with a fact after every answer",
      "Scripture for anxiety, grief, anger and more",
    ],
    featured: false,
    priceId: {
      month: process.env.NEXT_PUBLIC_PADDLE_STARTER_MONTHLY_PRICE_ID || "",
      year: process.env.NEXT_PUBLIC_PADDLE_STARTER_ANNUAL_PRICE_ID || "",
    },
  },
  {
    name: "Pro",
    description: "Everything in Lampstand, with no ads, and every new walk and Sleep chapter as it is released.",
    features: [
      "7-day free trial on the monthly plan",
      "$4.99/mo or $39.99/yr (save 33%)",
      "No ads anywhere on Lampstand",
      "Every Walk and Sleep chapter as new ones are released",
      "5,000 bonus coins and a Premium badge",
      "Support independent, Scripture-first work",
    ],
    featured: true,
    priceId: {
      month: process.env.NEXT_PUBLIC_PADDLE_MONTHLY_PRICE_ID || "pri_01m3491eqp91gkse1fmpngdt7h",
      year: process.env.NEXT_PUBLIC_PADDLE_ANNUAL_PRICE_ID || "pri_01m3491f04x6epgafayhm6saty",
    },
  },
];
