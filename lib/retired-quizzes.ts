/**
 * Quizzes, series and categories outside the Bible, retired in October 2026 so the site is
 * clearly a Bible site to readers and to search engines. Their old addresses redirect to the
 * Bible quizzes (next.config.ts), so old links and bookmarks still land somewhere useful.
 */
export const RETIRED_QUIZZES = [
  "get-your-fill-restaurant",
  "worlds-largest-cities",
  "us-states",
  "latin-america",
  "us-capitals",
  "european-countries",
  "geography-review",
  "wilderness-essentials",
  "shelter-building",
  "water-and-fire",
  "field-first-aid",
  "navigation-basics",
  "survival-review",
  "ancient-world",
  "us-history-core",
  "world-wars",
  "explorers-and-routes",
  "civilizations",
  "history-review",
  "human-body",
  "earth-science",
  "space-basics",
  "chemistry-kitchen",
  "biology-101",
  "science-review",
  "sports-rules",
  "film-and-story",
  "home-repair",
  "engines-and-roads",
];

export const RETIRED_SERIES = ["geography-1", "survival-essentials", "history-foundations", "science-basics"];

export const RETIRED_CATEGORIES = ["survival", "history", "science", "geography", "food", "sports", "entertainment", "diy", "cars"];

/** Permanent redirects for every retired address. */
export function retiredQuizRedirects() {
  return [
    ...RETIRED_QUIZZES.map((slug) => ({ source: `/quizzes/${slug}`, destination: "/quizzes", permanent: true })),
    ...RETIRED_SERIES.flatMap((slug) => [
      { source: `/series/${slug}`, destination: "/quizzes", permanent: true },
      { source: `/certificate/${slug}`, destination: "/quizzes", permanent: true },
    ]),
    ...RETIRED_CATEGORIES.map((slug) => ({ source: `/category/${slug}`, destination: "/quizzes", permanent: true })),
  ];
}
