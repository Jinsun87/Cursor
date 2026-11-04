# Lampstand

Christian Scripture quizzes with the promise **Know the text.** Long sittings, Certificates of Mastery, coins, Premium, ads on secret quizzes, and optional gifts.

Independent — not a church, not pastoral care, not affiliated with any denomination. Questions and branding are original.

Read [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) for the complete architecture, technical stack, directory map, and feature documentation.
Read [BUSINESS_MODEL.md](./BUSINESS_MODEL.md) for the niche, monetization models, and business loops.

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

Accounts and Premium need a Supabase project and Paddle keys: see [docs/accounts-setup.md](./docs/accounts-setup.md). Without them the site runs with sign-in disabled.

## Stack

Next.js 15 (App Router), React 19, Tailwind CSS. Accounts and Premium status live in Supabase (Premium is written by the Paddle webhook). Coins, quiz history, and reading progress are still kept in `localStorage` per account.

## Product map

| Path | Loop |
| --- | --- |
| `/` | Acquisition: Open the Book, Bible packs, Premium |
| `/quizzes`, `/category/[slug]` | SEO-style inventory (Bible first; secular packs remain) |
| `/series/[slug]` | Pack → 70% review → certificate |
| `/quizzes/[slug]` | Play + coins |
| `/daily` | Ten-question Scripture sitting (UTC) |
| `/secret` | Quiet room: ad wall / Premium wedge |
| `/premium`, `/donate` | Revenue |
| `/register`, `/login`, `/profile` | Account |
| `/leaderboard` | Social proof |
| `/how-it-works` | Onboarding copy |
| `/privacy` | What this build stores |

## Go live (quiz.mediareferee.com)

Keep **mediareferee.com** on the existing site. Point a **subdomain** at this app so you can test sittings and, later, real ads without moving the apex.

1. Create a Vercel account and **import this GitHub repo** (that is the durable live site, not a 60-minute demo).
2. Production branch: `cursor/quizforge-business-model-94c3` until merged to `main`.
3. Env: `NEXT_PUBLIC_SITE_URL=https://quiz.mediareferee.com`.
4. Project → Settings → Domains → add `quiz.mediareferee.com`.
5. At the mediareferee.com DNS host: `quiz` CNAME to the target Vercel shows.

A CLI anonymous deploy expires in an hour unless you claim it. Git import is what you want for going live.

## Ads (AdSense on apex and quiz)

**Yes — implement AdSense** for the approved apex. Ezoic was removed from this app in November 2026.

**WordPress `mediareferee.com` (not this repo):** In AdSense, enable the site and Auto ads (or paste the official snippet once). Remove any second `adsbygoogle.js` if Auto ads already injects one. Purge cache.

**This quiz app:** In Vercel Config set `NEXT_PUBLIC_ADSENSE_CLIENT` to `ca-pub-3795330167795048`. Optional: `NEXT_PUBLIC_ADSENSE_SLOT` for a display unit (without a slot, Auto ads / page-level ads must be on in the AdSense UI). AdSense does not take `quiz.mediareferee.com` as its own site; approval of **mediareferee.com** covers this host. Open the Book shows an in-quiz unit from question 1, then between-course and post-quiz units. Empty units until Google crawls the quiz URLs are still possible.

`/ads.txt` is served by `app/ads.txt/route.ts` with the Google line for `NEXT_PUBLIC_ADSENSE_CLIENT`, and is a 404 when AdSense is off.

