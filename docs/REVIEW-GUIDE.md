# Lampstand: a guide for reviewers

Welcome, and thank you for looking over the work. This guide explains what Lampstand is, how the code is laid out, the stack, the rules the UI and content follow, and how to send suggestions. It is kept up to date; where it disagrees with older docs, trust this one (see [Older docs](#older-docs)).

## What Lampstand is

[lampstandbible.com](https://lampstandbible.com) is an audio Bible for listening every day. The Berean Standard Bible (BSB) is read aloud, chapter by chapter, in two modes:

- **Walk**: a clear, brisk voice for the day.
- **Sleep**: a slow, quiet reading for the night.

The verse being read is shown on screen, and every scene has its own oil painting. Genesis is free. Exodus, Ruth, Psalms, Jonah, John and Philippians are Premium (Paddle subscription, 7-day trial, plus a one-off "founding member" lifetime purchase).

The audience skews older, and about a third of paid traffic is desktop. So the product is web-first, installable as a PWA, with native apps planned later.

Around the audio there is:

- a reading plan (`/plan`),
- Bible and life topics (`/read`),
- Bible quizzes (`/quizzes`, `/daily`, where the project started),
- study pages for search traffic: `/lampstand-in-the-bible` and the Bible-words glossary at `/bible-words`.

## Tech stack

| Layer | What we use | Notes |
|---|---|---|
| Framework | Next.js 15 (App Router), React 19, TypeScript 5 | Mostly server components; client components only where there is state or audio. |
| Styling | Tailwind CSS 3, CSS custom properties, plain CSS files per feature | Theme tokens in `app/globals.css`. Feature CSS sits next to its components (`components/sleep/sleep.css`, `components/study/study.css`, …). |
| Accounts | Supabase (auth plus Postgres with row-level security) | `lib/supabase/`, migrations in `supabase/migrations/`. `middleware.ts` only refreshes the session cookie and gates nothing. |
| Billing | Paddle Billing v2 (`@paddle/paddle-js`, `@paddle/paddle-node-sdk`) | Premium is written only by the webhook (`app/api/webhooks/paddle`). Still on the Paddle **sandbox** before launch. |
| Audio hosting | Cloudflare R2, public bucket | MP3s are gitignored. `NEXT_PUBLIC_AUDIO_BASE_URL` points at the bucket; `lib/audio-url.ts` builds URLs. |
| Hosting | Vercel | Production branch is `main`. Pushes build a deployment, which is then promoted to production by hand. |
| Analytics and ads | Vercel Analytics, GA4, AdSense/Ezoic loaders | Ezoic logs 403 errors on localhost. That is expected, not a bug. |
| Tests | Vitest (unit), Playwright (e2e) | CI runs typecheck, unit, e2e and build on every push and PR (`.github/workflows/test.yml`). |

### Content pipeline (offline scripts, paid APIs)

These run on the owner's machine, not on the server. They need keys reviewers won't have, and they cost money, so please don't run them. Reading them is very welcome.

| Step | Tool | Where |
|---|---|---|
| Walk voice | Google Gemini 2.5 Flash TTS, voice "Iapetus" | `scripts/sleep-chapter.ts` |
| Sleep voice | ElevenLabs "Theo Silk", `eleven_flash_v2_5` | `scripts/sleep-chapter.ts` |
| Verse timing and word check | OpenAI Whisper word timestamps, compared with the BSB text | `lib/sleep/align.ts`, `lib/sleep/coverage.ts` |
| Paintings | Vertex AI `gemini-3.1-flash-image`, 9:16 | `lib/ai/vertex-imagen.ts` |
| Character consistency | A character sheet passed as a reference image | `scripts/character-sheet.ts`, `content/sleep/characters/` |
| Quality check | Pace, coverage, loudness and committed-files report | `scripts/qc-sleep.ts` |

One chapter's run, `npx tsx scripts/sleep-chapter.ts "John 1-4"`:

1. Paints the scenes from the plan in `content/sleep/<book>.ts`.
2. Voices both modes.
3. Times every verse with Whisper.
4. Re-voices automatically if words were skipped or added.
5. Uploads the MP3s to R2.
6. Writes `public/{walk,sleep}/<slug>/timing.json` and `lib/sleep/chapters/<slug>.json`.

## Repository map

```
app/                    Next.js routes
  page.tsx              Home (Today / Walk / Sleep / Breathe tabs via ?tab=)
  bible-words/          Glossary index and [slug] word pages
  lampstand-in-the-bible/  Study page
  plan/ read/ quizzes/ daily/ series/ category/   Reading plan, topics, quizzes
  pricing/ premium/ open/ donate/ register/ login/ profile/ welcome/ onboarding/
  api/                  billing portal, founding count, plan chapters, Paddle webhook
  sitemap.ts robots.ts manifest.ts
components/
  sleep/                Bookshelf, mini player, full-screen player, Premium gate
  clip/                 VerseClip: a short listen cut from a chapter recording
  study/                Shared blocks for study and glossary pages (Verse, Listen, WordPage)
  navigation/           Bottom tab bar (phones), More sheet, section nav
  home2/ onboarding/ pricing/ plan/ founding/ auth/ profile/ sync/ bible/
content/
  sleep/<book>.ts       Hand-written chapter plans: titles, headings, painting prompts
  sleep/characters/     Character sheets (Jesus) used as painting references
  bible-words/          One hand-written file per glossary word
lib/
  sleep/                Shelf (books.ts), chapter catalogue (chapters/), player state,
                        access rules (access.ts), timing alignment, progress
  bible/                BSB text access (getChapter)
  clips.ts              Builds listen clips from timing files at build time
  supabase/ paddle/ sync/   Accounts, billing, cross-device progress sync
  founding.ts           Numbers on the public founding ladder (/open)
  seo.ts site.ts        Metadata helper, canonical origin
data/bsb.txt            The Berean Standard Bible (public domain). Never edited.
public/images/sleep/    Paintings, one folder per chapter
public/{walk,sleep}/    timing.json per chapter (MP3s live on R2)
scripts/                Content pipeline and QC (see above)
supabase/migrations/    profiles, subscriptions, lifetime_purchases, listening_days,
                        reading_progress, reading_plans (all with RLS)
video/                  Remotion renderer for long-form YouTube videos of chapters
e2e/                    Playwright specs
docs/                   This guide, accounts setup, future improvements
```

Generated files: don't hand-edit these, since the pipeline rewrites them.

- `lib/sleep/chapters/*.json`
- `lib/sleep/chapters/index.ts`
- `public/{walk,sleep}/*/timing.json`

Changes belong in `content/` or `scripts/`. A timing file is only hand-corrected when Whisper mis-times a verse, and those fixes are noted in the commit.

## UI rules

### Look and feel

- **Dark by default.** Deep pine canvas, warm parchment ink, gold accents. The light theme is a full equivalent, not an afterthought. Colours come from the CSS tokens (`--canvas`, `--canvas-2`, `--ink`, `--muted`, `--line`, `--gold`, `--ring`) in `app/globals.css`. Use the tokens, not new hex values, so both themes keep working.
- **Two typefaces:** Newsreader (`--font-display`, serif) for headings and Scripture, Inter (`--font-sans`) for everything else.
- **Calm.** No flashing, confetti or autoplaying sound. Motion is gentle and respects `prefers-reduced-motion`.
- **Paintings are the imagery.** Classical oil-painting style, dark and warm, chiaroscuro. No stock photos, icons standing in for art, or emoji decoration.

### Readability and access (an older audience)

- Body text is 17px (`1.0625rem`) with a 1.6 line height. Don't go smaller for body copy.
- Tap targets are at least 44–48px tall.
- Every interactive element shows a visible focus ring (`--ring`). A skip link leads to `#main`.
- Text must keep good contrast in **both** themes.
- **Phones first.** Every page has to work at 375px wide with no sideways scrolling. On phones a bottom tab bar (Today, Walk, Sleep, Breathe, More) replaces the footer, which is desktop-only. Pages leave room for the bar and the mini player.

### Copy and tone

- **Plain, warm, honest English.** Say what a thing does; no hype, no "revolutionary". Device claims must be true: no offline listening promised until the apps exist.
- **Scripture is quoted word for word from the BSB.** Pages pull verses from `data/bsb.txt` at build time (`components/study/Scripture.tsx`), so the wording always matches the recording.
- **Facts get checked.** Counts and claims on study pages ("selah appears 74 times") are verified against the BSB text before publishing.
- **Independent and non-denominational.** Present differing views fairly where Christians differ.
- **No dark patterns.** Prices and trial terms are stated plainly. Cancel any time means cancel any time.

### Paintings

- **God is shown only as light,** never as a figure.
- **Jesus is painted consistently from one character sheet** (`content/sleep/characters/jesus.jpg`). He is seen at mid-distance or from behind, without a halo. The crucifixion itself is never painted.
- **No crosses, halos, text, frames or modern objects.** People are few, modestly dressed in simple ancient clothing, and usually seen at a distance.
- **Every painting is reviewed by eye before it ships.** The image model tends to turn robed figures into Jesus or Mary, or to add angels; those get repainted.

### Audio

- **Every recording is checked word for word against the text** (Whisper versus BSB) before it ships. Real errors happen (a looped genealogy, an invented phrase), so this check is never skipped.
- **One clip plays at a time** on any page. Clips (`VerseClip`) highlight the verse being read.
- **Premium is enforced** when a chapter opens in the player (`lib/sleep/access.ts`, `components/sleep/PremiumGate.tsx`), based on the shelf's `premium` flag.

## SEO pages

- **Metadata:** every public page sets its title, description and canonical link through `pageMetadata` (`lib/seo.ts`). Study pages add Article and FAQPage JSON-LD.
- **The Bible-words glossary grows slowly on purpose.** 15 hand-written words for now; more only once Search Console shows the first batch earning impressions. Each page needs real substance, not a template with the word swapped.
- **Sitemap:** new public routes must be added to `app/sitemap.ts`.

## Running it locally

```bash
npm install
npm run dev          # http://localhost:3000
npm run lint         # TypeScript typecheck
npm test             # Vitest
npx playwright install chromium
npm run test:e2e     # Playwright
npm run build
```

What works without any keys:

- The site runs. Sign-in is disabled without Supabase keys, and checkout is disabled without Paddle keys.
- Audio streams from the public R2 bucket only if you set `NEXT_PUBLIC_AUDIO_BASE_URL` to the production value. Ask the owner for it; it is public, not secret.

**Never commit secrets.** Keys live only in `.env.local` (gitignored) and in Vercel. `docs/accounts-setup.md` lists what each service needs.

## How to send suggestions

`main` is protected, so changes reach it only through a pull request with an approving review.

1. **Small notes, questions, ideas:** open a GitHub issue, one topic per issue, with the page URL and a screenshot if it's visual.
2. **Code changes:** make a branch, open a pull request against `main`, and describe what changed and why. Vercel posts a preview link on the PR, which is the easiest way to show a change.
3. **Before opening a PR:** run `npm run lint && npm test`. CI runs those, plus Playwright and a full build.
4. **Keep PRs small and focused.** Please don't reformat files you aren't changing, and match the style of the surrounding code (naming, comment density, idioms).

**Especially useful to review:**

- the player and mini player on phones,
- accessibility in both themes,
- the onboarding and pricing flow,
- performance (audio start time, image sizes),
- the Paddle webhook and Supabase RLS policies,
- the content pipeline's robustness.

## Older docs

`README.md` and `PROJECT_OVERVIEW.md` date from the quiz-first version of the project. Their architecture notes are partly out of date. For example, they say all progress lives in `localStorage`, but accounts, Premium and reading progress now sync through Supabase. `docs/future-improvements.md` holds the agreed roadmap: the founding ladder, voices, and audio delivery.
