# Lampstand (`lampstandbible.com`) — Master System Architecture & Feature Guide

> Comprehensive technical reference explaining the codebase architecture, complete technology stack, core features, audio engine, billing integration, and directory structure.

---

## Table of Contents
1. [Executive Summary & Product Mission](#1-executive-summary--product-mission)
2. [Complete Technology Stack](#2-complete-technology-stack)
3. [Repository & Directory Structure Map](#3-repository--directory-structure-map)
4. [Core Features & Code Implementation](#4-core-features--code-implementation)
   - [4.1. 30 Landmark Illuminated Chapters & Curriculum](#41-30-landmark-illuminated-chapters--curriculum)
   - [4.2. Daily Habit Hub & Sacred Rhythm ("Daily Walk")](#42-daily-habit-hub--sacred-rhythm-daily-walk)
   - [4.3. Scripture & Counsel (Filter by Topics & Practical Sub-Topics)](#43-scripture--counsel-filter-by-topics--practical-sub-topics)
   - [4.4. Daily Listens Audio Companions](#44-daily-listens-audio-companions)
   - [4.5. Paddle Billing & Monetization (Live 3-Tier Pricing)](#45-paddle-billing--monetization-live-3-tier-pricing)
   - [4.6. Interactive Readers (Story Shorts, Scroll Reader, Daily Ritual)](#46-interactive-readers-story-shorts-scroll-reader-daily-ritual)
   - [4.7. Scripture Quizzes, Lifelines & Coin Economy](#47-scripture-quizzes-lifelines--coin-economy)
   - [4.8. Legal & Compliance System](#48-legal--compliance-system)
5. [Audio Architecture & Zero-Latency Performance](#5-audio-architecture--zero-latency-performance)
6. [State Management & Data Persistence](#6-state-management--data-persistence)
7. [Environment Variables & Configuration](#7-environment-variables--configuration)
8. [Testing, Quality Control & CI/CD](#8-testing-quality-control--cicd)
9. [Deployment & Vercel Edge Optimization](#9-deployment--vercel-edge-optimization)

---

## 1. Executive Summary & Product Mission

**Lampstand** ([lampstandbible.com](https://lampstandbible.com)) is a modern, privacy-first Christian Scripture companion and contemplative web application. 

It is designed around the promise **"Know the text."** Rather than generic gamification or denominational commentary, Lampstand blends museum-grade classical artwork, original Hebrew/Greek **WordSparks**, interactive visual story reels, practical situational life counsel, and daily contemplative audio into a frictionless, senior-accessible experience.

### Core Philosophy
* **Zero Database Friction**: All user progress, reading streaks, and coins are safely stored in browser `localStorage`. Visitors can immediately embark on 30-day Scripture journeys without forced registration barriers.
* **Anti-Binge Sacred Rhythm**: Encourages one illuminated chapter per calendar day, protecting the habit from dopamine burnout.
* **Practical Situational Connection**: 48 life topics (e.g. *Anger From Expectations*, *Anxiety From Overthinking*, *Jealousy in Workplace*) mapped directly to Scripture anchors and church father counsel.
* **Country-Localized Billing**: Fair global pricing powered by Paddle v2 with client-side localization and overlay checkout.

---

## 2. Complete Technology Stack

| Layer | Technologies & Libraries | Purpose & Key Details |
|---|---|---|
| **Core Framework** | **Next.js 15.5.23** (App Router) | Server Components, SSG static pre-rendering, edge streaming, client-side Suspense boundaries. |
| **UI Library** | **React 19** | Strict mode, modern concurrency, hooks (`use`, `useMemo`, `useCallback`, `useRef`). |
| **Language** | **TypeScript 5.x** | End-to-end type safety across catalog, topics, quizzes, and webhook contracts. |
| **Styling** | **Tailwind CSS v3 + CSS Design Tokens** | Custom sacred sanctuary theme, gold accents (`--gold`), paper ink tones (`--canvas-1`, `--canvas-2`, `--ink`), glassmorphic overlays. |
| **Billing & Payments** | **@paddle/paddle-js (v1)** & **@paddle/paddle-node-sdk** | Client overlay checkout (`Paddle.Checkout.open`), live PricePreview localization, and server webhook verification. |
| **Speech & Audio** | **Web Speech API** + **HTML5 Audio Engine** + **Next.js Route Stream** | Pre-warmed sentence-chunked voice synthesis, preloaded high-fidelity MP3 companions, OpenAI `tts-1` low-latency fallback. |
| **Haptics** | **Web Vibration API** (`lib/haptics.ts`) | Subtle tactile feedback for button taps, selections, and completed stages. |
| **Testing Suite** | **Vitest 3.2.7** & **Playwright** | 16 unit test suites (68+ tests) covering logic, streak calculations, catalog validity, and end-to-end smoke tests. |
| **Hosting & CDN** | **Vercel Edge Network** | Worldwide edge caching (`Cache-Control: public, max-age=31536000, immutable`), SSG generation of all 30 chapter routes. |

---

## 3. Repository & Directory Structure Map

```
├── .agents/                    # Custom agent plugins & skill definitions (Paddle, billing, webhooks)
├── app/                        # Next.js 15 App Router directory
│   ├── api/
│   │   ├── audio/tts/          # Real-time TTS audio generation fallback route (OpenAI / ElevenLabs)
│   │   └── webhooks/paddle/    # Paddle v2 webhook signature verification & event processor
│   ├── category/[slug]/        # Category browse pages for quiz packs
│   ├── certificate/[seriesSlug]/ # Shareable Course & Quiz Certificates of Mastery
│   ├── daily/                  # 10-Question Scripture sitting (UTC daily challenge)
│   ├── donate/                 # Patronage and gifting support page
│   ├── ebooks/                 # Illustrated digital study guides & downloads
│   ├── how-it-works/           # Onboarding & methodological philosophy
│   ├── leaderboard/            # Community streaks & Coin leaderboard
│   ├── login/ & register/      # Lightweight authentication interface
│   ├── premium/                # Premium tier overview & feature comparisons
│   ├── pricing/                # 3-Tier Country-Localized Pricing Page (Paddle Checkout)
│   ├── privacy/                # Privacy Policy (GDPR, CCPA, zero tracking compliance)
│   ├── profile/                # User settings, coin wallet, and reading history
│   ├── quizzes/                # Bible and historical quiz directory
│   ├── read/                   # Course Sanctuary & Topic Explorer Hub
│   │   └── [book]/[chapter]/   # Prerendered 30 Landmark Illuminated Readers (Story, Scroll, Daily)
│   ├── refunds/ & refund/      # 14-Day Refund Policy & Customer Support instructions
│   ├── terms/                  # Terms of Service & Subscription Agreements
│   └── welcome/                # Post-checkout welcome & onboarding confirmation
├── components/                 # Reusable UI component library
│   ├── bible/                  # Scripture readers, Topic Explorer, Audio banners, Mode toggles
│   ├── home/                   # Habit Hub, Daily Listens, Featured Story carousel
│   ├── pricing/                # Pricing cards, billing frequency toggle, Paddle client
│   └── ...                     # Global Navbar, Footer, HUD, AdSense wrappers
├── constants/                  # Configuration constants (pricing tiers, product IDs)
├── lib/                        # Business logic, stores, catalogs, and test suites
│   ├── bible/                  # 30-chapter curriculum, 48 topics, devotionals, reading store
│   │   ├── chapters/           # Weeks 1 to 4 illuminated chapter definitions
│   │   ├── catalog.ts          # Landmark Chapter catalog, Reading Plans, book metadata
│   │   ├── devotionals.ts      # Quotes, historical contexts, prayers, and reflections
│   │   ├── reading-store.ts    # LocalStorage tracker: streaks, completion flags, preferences
│   │   └── topics.ts           # 4 Categories, 48 Topics, 180+ practical sub-sections & verses
│   ├── paddle/                 # Paddle Node SDK initialization & webhook unmarshaling
│   ├── haptics.ts              # Tactile vibration presets
│   ├── store.tsx               # AppContext: user authentication, coins, lifelines
│   └── site.ts                 # Domain configuration (lampstandbible.com)
├── public/                     # Static assets, artwork, and audio files
│   ├── audio/daily-listens/    # Pre-rendered MP3 companions (spark.mp3, prayer.mp3, wisdom.mp3)
│   └── images/                 # Museum-grade classical artwork and quiz illustrations
└── tests / configs             # vitest.config.ts, playwright.config.ts, next.config.ts, tailwind.config.ts
```

---

## 4. Core Features & Code Implementation

### 4.1. 30 Landmark Illuminated Chapters & Curriculum
* **Location**: [`lib/bible/catalog.ts`](file:///c:/Users/chand/.antigravity-ide/Projects/Cursor/lib/bible/catalog.ts) & [`lib/bible/chapters/`](file:///c:/Users/chand/.antigravity-ide/Projects/Cursor/lib/bible/chapters/)
* **The 4 Arcs**:
  1. **Week 1 (Days 1–7)**: *Covenant Foundations* (Genesis 1 Creation through Exodus 20 Sinai).
  2. **Week 2 (Days 8–14)**: *Kingdom & Wisdom* (David & Goliath, Psalm 23, Daniel in the Den).
  3. **Week 3 (Days 15–21)**: *Gospel Light* (John 1 Word Made Flesh through Matthew 28 Resurrection).
  4. **Week 4 (Days 22–30)**: *The Church & Eternity* (Pentecost, Romans 8 Adoption through Revelation 21 New Jerusalem).
* **Chapter Assets**: Each chapter contains authenticated text, 3 active recall check-in questions, museum-grade classical paintings, original Hebrew/Greek **WordSparks** with morphological root meanings, and Instagram/WhatsApp-style full-screen story slides.

### 4.2. Daily Habit Hub & Sacred Rhythm ("Daily Walk")
* **Location**: [`components/home/TodayHabitHub.tsx`](file:///c:/Users/chand/.antigravity-ide/Projects/Cursor/components/home/TodayHabitHub.tsx)
* **Circadian Greeting**: Auto-detects visitor's local hour:
  - *Morning Awakening* (5 AM – 12 PM): Focus on clarity and morning mercy.
  - *Midday Restoration* (12 PM – 5 PM): Pause the workday rush for sanctuary rest.
  - *Evening Surrender* (5 PM+): Releasing burdens before sleep.
* **4-Step Daily Ritual**:
  1. `Daily Verse & Anchor Quote` (1 min read & one-tap social share).
  2. `Today's Scripture Passage` (3 min illuminated visual reels).
  3. `Pastoral Devotional` (4 min historical reflection).
  4. `Sanctuary Prayer` (1 min spoken audio reflection).
* **Anti-Binge Safeguard**: Once the 4 daily rituals are complete, the hub celebrates with a golden badge and gently prompts the user to rest in today's truth until tomorrow's chapter unlocks.

### 4.3. Scripture & Counsel (Filter by Topics & Practical Sub-Topics)
* **Location**: [`components/bible/TopicExplorer.tsx`](file:///c:/Users/chand/.antigravity-ide/Projects/Cursor/components/bible/TopicExplorer.tsx) & [`lib/bible/topics.ts`](file:///c:/Users/chand/.antigravity-ide/Projects/Cursor/lib/bible/topics.ts)
* **4 Grand Categories**:
  - `🟡 Challenges & Inner Struggles` (14 topics: Anxiety, Guilt, Regret, Jealousy, Anger, Ego, Doubt, Failure, Confusion, Attachment, Greed, Grief, Comparison, Desire).
  - `🟡 Self-Growth & Strength` (12 topics: Determination, Discipline, Purpose, Self-Control, Responsibility, Integrity, Self-Awareness, Motivation, Sacrifice, Self-Care, Leadership, Balance).
  - `🟡 Core Human Emotions & Spiritual Insights` (17 topics: Love, Trust, Fear, Courage, Wisdom, Faith, Hope, Peace, Compassion, Forgiveness, Patience, Gratitude, Humility, Unity, Respect, Harmony, Understanding).
  - `🟡 Philosophical & Spiritual Concepts` (5 topics: Righteousness, Detachment, Enlightenment, Acceptance, Freedom).
* **Practical Life Connections**:
  - When tapping any topic, the screen **smoothly scrolls to the sub-topics card**.
  - Sub-topics are worded as real-world human scenarios (e.g. *Anger From Expectations*, *Anger From Desires*, *Anger From Feeling Disrespected*, *Hatred & Resentment*).
* **Sub-Sub-Topics (Scripture Cards View)**:
  - Tapping a sub-topic displays accordion cards with scripture references (e.g., `James 1:19-20`, `Proverbs 19:11`), situational badges (`Personal`, `Relational`, `Social`, `Spiritual`), illuminated quote snippets, a `[ 📖 View Passage ]` button, and an instant `[ ▶ Play Audio ]` player.

### 4.4. Daily Listens Audio Companions
* **Location**: [`components/home/DailyListens.tsx`](file:///c:/Users/chand/.antigravity-ide/Projects/Cursor/components/home/DailyListens.tsx)
* **Pre-Rendered Audio Tracks**:
  - `1 MIN SPARK`: *The Morning Ember* (Lamentations 3:22–23) — Pivoting from morning dread to peace.
  - `2 MIN PRAYER`: *Unclenched Hands* (Matthew 11:28) — Physical surrender of overscheduled stress.
  - `4 MIN WISDOM`: *Street-Level Grace* (Colossians 3:12–13) — Practical patience when people are difficult.
* **Preloaded Buffering**: High-quality MP3s are preloaded into browser memory on mount for instantaneous playback without loading spinners.

### 4.5. Paddle Billing & Monetization (Live 3-Tier Pricing)
* **Location**: [`constants/pricing-tier.ts`](file:///c:/Users/chand/.antigravity-ide/Projects/Cursor/constants/pricing-tier.ts), [`components/pricing/PricingPageClient.tsx`](file:///c:/Users/chand/.antigravity-ide/Projects/Cursor/components/pricing/PricingPageClient.tsx), and [`app/api/webhooks/paddle/route.ts`](file:///c:/Users/chand/.antigravity-ide/Projects/Cursor/app/api/webhooks/paddle/route.ts)
* **Tiers Configured**:
  1. **Starter (Free)**: Access to Foundations, daily Scripture sitting, reading plans, and coin rewards.
  2. **Pro ($4.99/mo or $39.99/yr with 7-Day Free Trial)**: All 30 Illuminated Chapters, unlimited daily listens, museum art gallery, offline reading, WordSparks, and zero advertisements.
  3. **Advanced (Patron - $9.99/mo or $79.99/yr)**: Everything in Pro plus sponsoring translation work, patron badge, early access to new testament courses.
* **Paddle Integration Specs**:
  - Client SDK: `@paddle/paddle-js` via `Paddle.Initialize({ token, environment: 'production' })`.
  - Country Detection: Passed from Vercel `x-vercel-ip-country` request header into client `Paddle.PricePreview({ items })`.
  - Checkout Mode: One-page overlay (`displayMode: 'overlay'`, `variant: 'one-page'`).
  - Webhook Verification: Cryptographically unmarshaled on the server using `@paddle/paddle-node-sdk` via `paddle.webhooks.unmarshal(rawBody, secret, signature)`.

### 4.6. Interactive Readers
* **Location**: [`components/bible/`](file:///c:/Users/chand/.antigravity-ide/Projects/Cursor/components/bible/)
* **Three Switchable Modes**:
  1. `Story Shorts Mode` ([`StoryReader.tsx`](file:///c:/Users/chand/.antigravity-ide/Projects/Cursor/components/bible/StoryReader.tsx)): Instagram/WhatsApp-style animated visual reels with auto-advancing progress bars and interactive tap navigation.
  2. `Scroll Reader Mode` ([`ScrollReader.tsx`](file:///c:/Users/chand/.antigravity-ide/Projects/Cursor/components/bible/ScrollReader.tsx)): Distraction-free, continuous typography with adjustable font size, night mode, and inline verse markers.
  3. `Glorify Daily Ritual Mode` ([`GlorifyDailyReader.tsx`](file:///c:/Users/chand/.antigravity-ide/Projects/Cursor/components/bible/GlorifyDailyReader.tsx)): Guided 5-stage stepping through Quote &rarr; Historical Context &rarr; Scripture Passage &rarr; Devotional &rarr; Spoken Prayer.

### 4.7. Scripture Quizzes, Lifelines & Coin Economy
* **Location**: [`lib/economy.ts`](file:///c:/Users/chand/.antigravity-ide/Projects/Cursor/lib/economy.ts), [`lib/lifelines.ts`](file:///c:/Users/chand/.antigravity-ide/Projects/Cursor/lib/lifelines.ts), and [`components/QuizRunner.tsx`](file:///c:/Users/chand/.antigravity-ide/Projects/Cursor/components/QuizRunner.tsx)
* **Economics**:
  - Complete daily passage: `+50 Coins`.
  - Finish story reels: `+25 Coins`.
  - Complete quiz sitting: `+50 to +100 Coins`.
* **Lifelines**: In quiz sittings, users can spend coins on **50:50**, **Skip Question**, or **Scripture Hint** lifelines.

### 4.8. Legal & Compliance System
* **Location**: [`app/privacy/page.tsx`](file:///c:/Users/chand/.antigravity-ide/Projects/Cursor/app/privacy/page.tsx), [`app/terms/page.tsx`](file:///c:/Users/chand/.antigravity-ide/Projects/Cursor/app/terms/page.tsx), and [`app/refunds/page.tsx`](file:///c:/Users/chand/.antigravity-ide/Projects/Cursor/app/refunds/page.tsx)
* Fully compliant with Paddle merchant requirements: explicit merchant disclosure, 14-day money-back guarantee, cancellation rights, and privacy handling disclosures.

---

## 5. Audio Architecture & Zero-Latency Performance

To eliminate initial 30–40 second audio stalling previously encountered on Chromium browsers:

```
User Clicks Play
       │
       ├──> [Static MP3]: Fetched from /audio/daily-listens/
       │      │
       │      ├──> Browser Memory / Preloaded Buffer (0ms latency)
       │      └──> Vercel Edge Cache (HTTP 200 HIT via max-age=31536000, immutable)
       │
       └──> [Spoken Scripture / Homily]: Web Speech API Engine
              │
              ├──> 1. Pre-warm speech voices on mount (avoid OS voice delay)
              ├──> 2. Sentence-Chunking: Text split by punctuation into short utterances
              ├──> 3. First sentence dispatched immediately (<50ms audio output)
              └──> 4. Subsequent sentences chained via utterance.onend
```

* **Low-Latency Edge Headers**: Configured in [`next.config.ts`](file:///c:/Users/chand/.antigravity-ide/Projects/Cursor/next.config.ts) for `/audio/:path*` with `public, max-age=31536000, immutable`.
* **TTS Route Fallback**: Configured with OpenAI's `tts-1` model in [`app/api/audio/tts/route.ts`](file:///c:/Users/chand/.antigravity-ide/Projects/Cursor/app/api/audio/tts/route.ts) for sub-second synthesis if dynamic text generation is ever requested.

---

## 6. State Management & Data Persistence

* **Global User State**: [`lib/store.tsx`](file:///c:/Users/chand/.antigravity-ide/Projects/Cursor/lib/store.tsx) manages `AppContext`:
  - `user`: Authenticated user email, subscription tier, and username.
  - `coins`: Accumulated coin wallet balance.
  - `lifelines`: Available quiz lifelines count.
  - `theme`: Light / Dark sanctuary theme preference.
* **Reading Tracker**: [`lib/bible/reading-store.ts`](file:///c:/Users/chand/.antigravity-ide/Projects/Cursor/lib/bible/reading-store.ts):
  - `completedChapterKeys`: Record of completed chapters and timestamps.
  - `dailyRituals`: Checklist completion state for today's 4 rituals (`quote`, `passage`, `devotional`, `prayer`).
  - `currentStreak`: Consecutive days of scripture reading with automated streak calculation.
  - `preferredMode`: User's default reading format preference (`story` vs `scroll`).

---

## 7. Environment Variables & Configuration

Defined in [`.env.example`](file:///c:/Users/chand/.antigravity-ide/Projects/Cursor/.env.example) and loaded via `.env.local`:

```ini
# Canonical Site URL
NEXT_PUBLIC_SITE_URL=https://lampstandbible.com

# Paddle Billing (Live Production)
NEXT_PUBLIC_PADDLE_ENV=production
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=live_763a3e43ae029a4f937d308c0a6
NEXT_PUBLIC_PADDLE_MONTHLY_PRICE_ID=pri_01m3491eqp91gkse1fmpngdt7h
NEXT_PUBLIC_PADDLE_ANNUAL_PRICE_ID=pri_01m3491f04x6epgafayhm6saty
PADDLE_API_KEY=pdl_live_...
PADDLE_WEBHOOK_SECRET=pdl_ntfset_...

# Audio Synthesis API Keys (Server-side optional fallbacks)
OPENAI_API_KEY=sk-proj-...
ELEVENLABS_API_KEY=sk_...
```

---

## 8. Testing, Quality Control & CI/CD

The repository maintains an automated testing suite run via Vitest:

* **Command**: `npm test`
* **Test Suites Covered**:
  - [`lib/bible/topics.test.ts`](file:///c:/Users/chand/.antigravity-ide/Projects/Cursor/lib/bible/topics.test.ts): Verifies all 4 categories, 48 topics, and 180+ sub-sections are populated without empty fields.
  - [`lib/bible/bible.test.ts`](file:///c:/Users/chand/.antigravity-ide/Projects/Cursor/lib/bible/bible.test.ts): Verifies all 30 chapters, question sets, and streak formulas.
  - [`lib/paddle/paddle.test.ts`](file:///c:/Users/chand/.antigravity-ide/Projects/Cursor/lib/paddle/paddle.test.ts): Tests subscription webhooks and transaction completion handling.
  - [`lib/site.test.ts`](file:///c:/Users/chand/.antigravity-ide/Projects/Cursor/lib/site.test.ts): Ensures canonical domain matches `lampstandbible.com`.

---

## 9. Deployment & Vercel Edge Optimization

* **Prerendered SSG Routes**: All 30 chapter endpoints (`/read/genesis/1`, `/read/psalms/23`, etc.) export `generateStaticParams()` in [`app/read/[book]/[chapter]/page.tsx`](file:///c:/Users/chand/.antigravity-ide/Projects/Cursor/app/read/%5Bbook%5D/%5Bchapter%5D/page.tsx), turning dynamic lambdas into ultra-fast static HTML.
* **Instant Loading Skeleton**: Configured in [`app/read/[book]/[chapter]/loading.tsx`](file:///c:/Users/chand/.antigravity-ide/Projects/Cursor/app/read/%5Bbook%5D/%5Bchapter%5D/loading.tsx) to prevent page freeze during client-side navigation.
* **Production Branches**: Synced across GitHub `main` and `lampstand` branches with automatic deployment to Vercel production.
