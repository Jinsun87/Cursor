# Lampstand

Christian Scripture quizzes with the promise **Know the text.** Long sittings, Certificates of Mastery, coins, Premium, ads on secret quizzes, and optional gifts.

Independent — not a church, not pastoral care, not affiliated with any denomination. Questions and branding are original.

Read [BUSINESS_MODEL.md](./BUSINESS_MODEL.md) for the niche, the paid-click + long sitting loop, and what this repo implements.

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

Demo login after first page load: `maple@lampstand.demo` / `demo`.

## Stack

Next.js 15 (App Router), React 19, Tailwind CSS. Progress lives in `localStorage` so the desk runs without a database.

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

1. Create a Vercel (or similar) project from this GitHub repo, production branch `cursor/quizforge-business-model-94c3` until it is merged to `main`.
2. Set env `NEXT_PUBLIC_SITE_URL=https://quiz.mediareferee.com`.
3. DNS at the mediareferee.com registrar:

   `quiz`  `CNAME`  `cname.vercel-dns.com`  
   (use the exact target Vercel shows if it differs.)

4. Confirm `https://quiz.mediareferee.com` loads Lampstand and `https://quiz.mediareferee.com/ads.txt` is reachable.
5. When an ad account is approved, paste that network’s `ads.txt` lines into `public/ads.txt` and replace the placeholder `AdSlot` with real tags.

Placeholders do not earn RPM. The subdomain is for HTTPS, share URLs, and policy review first.

