# QuizForge

Original recreation of the **QuizGriz (grizly.com)** business model: expert-style quiz packs, Certificates of Mastery, coins, Premium, ads on secret quizzes, and a cognitive-health donation story.

Not affiliated with QG Marketing LLC. Questions and branding are original.

Read [BUSINESS_MODEL.md](./BUSINESS_MODEL.md) for the analysis and the build plan.

## Run locally

```bash
npm install
npx playwright install chromium
npm test
npm run test:e2e
npm run dev
```

CI runs lint, unit tests, Playwright, and production build on every PR (`.github/workflows/test.yml`).

Open [http://localhost:3000](http://localhost:3000). Use **Light / Dark** in the header to switch theme (defaults to your OS preference).

Demo login after first page load: `maple@quizforge.demo` / `demo`.

## Stack

Next.js 15 (App Router), React 19, Tailwind CSS. Progress lives in `localStorage` so the gym runs without a database.

## Product map

| Path | Loop |
| --- | --- |
| `/` | Acquisition: mission, experts, Premium |
| `/quizzes`, `/category/[slug]` | SEO-style inventory |
| `/series/[slug]` | Pack → 70% review → certificate |
| `/quizzes/[slug]` | Play + coins |
| `/daily` | Habit |
| `/secret` | Ad wall / Premium wedge |
| `/premium`, `/donate` | Revenue |
| `/register`, `/login`, `/profile` | Account |
| `/leaderboard` | Social proof |
| `/how-it-works` | Onboarding copy |
