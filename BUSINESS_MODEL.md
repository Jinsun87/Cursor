# QuizGriz (grizly.com) — business model analysis and recreation plan

QuizForge in this repository is an **original product clone of the business model**, not a trademark or content clone. Questions, name, and copy are new. The operating loop matches [QuizGriz](https://grizly.com/), operated by QG Marketing LLC (Ohio).

## What the source product is

QuizGriz is a **consumer trivia / lifelong-learning gym** aimed at adults who want more than viral listicles. Positioning:

- Emotional promise: *prove you are smarter than the average bear*
- Functional promise: expert-written quizzes on interest topics
- Moral / health promise: training the mind as a stand against cognitive decline (Alzheimer’s framing)
- Social promise: community, certificates, badges, bragging rights

They claim a large registered base (on the order of hundreds of thousands on the signup page) and sell **topic mastery**, not one-off clicks.

## Value proposition (jobs to be done)

| Job | How they do it |
| --- | --- |
| Kill time with a slightly prouder feeling than social media | Short multiple-choice quizzes |
| Actually learn a topic | “Quiz packs / series”: ~5 quizzes + a harder review |
| Get a credential they can show | Certificate of Mastery at **70%+** on the review after finishing the pack |
| Feel the content is trustworthy | Named industry experts (e.g. survival, history) |
| Do something “good” | Alzheimer’s / CAF donation CTAs next to Premium |

## Product surface to recreate

1. **Marketing home** — hero, expert category tiles, mission, Premium + dual donate CTAs  
2. **Category hubs** — Survival, History, Science, DIY, Sports, Entertainment, Geography, Cars & Trucks, General Knowledge, Bible (they cite ~14 categories)  
3. **Quiz packs / series** — ordered path, progress, locked review  
4. **Individual quizzes** — scored, explanations, coins  
5. **Daily trivia** — recurring habit loop  
6. **Secret quizzes** — gated-feeling inventory; ads unless Premium  
7. **Auth** — optional to browse; required for progress, certificates; email + social (Facebook/Google on source)  
8. **Profile** — coins, premium badge, certificates  
9. **Leaderboard / social proof**  
10. **Premium checkout** — monthly ~$9.99, annual ~$99.99 (2 months free language, 30-day money-back on annual)  
11. **Donations** — charity + “donate to us”  
12. **Ads** — display/video inventory sold via networks; ads especially on secret / premium-adjacent inventory  

## Revenue model (three-legged)

```
        ┌──────────────┐
        │   Quizzes    │  attention + emails
        └──────┬───────┘
               │
     ┌─────────┼─────────┐
     ▼         ▼         ▼
  Advertising  Premium   Donations
  (free users, (ad-lite   (CAF + ops)
   secret trail) secret +
                 coins +
                 badge)
```

1. **Advertising** — free users; AllMediaDesk-style sell-side mentions display/video on grizly.com. Classic ad-supported media on high-intent article/quiz URLs.  
2. **Subscriptions** — convert the annoyed (ads on “best”/secret quizzes) and the committed (badge, coins, early series). Coin grant (5,000) is an endowment that makes the virtual economy feel generous at the moment of payment.  
3. **Donations** — mission-aligned ARPU from users who will not subscribe but will give; also brand insurance (“we are not just a content farm”).

There is no public evidence of a large venture round (Tracxn lists them unfunded / subscription-classified). This is a **bootstrapped media + membership** business, not a marketplace take-rate business.

## Engagement / game economy

- **Coins** — earned on play; Premium dumps a large balance at signup  
- **Certificates** — long-cycle achievement (hours, not minutes)  
- **Badge** — identity marker for paying users  
- **Email / “first to know”** — inventory for new series launches  
- **Experts as SKUs** — a Les Stroud-style name is a merchandising unit, not just a byline  

## Unit economics (planning assumptions, not their books)

| Input | Planning guess |
| --- | --- |
| CAC | SEO + social + quiz titles (highly listicle-shaped URLs) |
| Variable cost of a quiz | Writer/expert + editor + CMS + images |
| Gross margin of digital sub | High after payment fees |
| Gross margin of ads | High; yield depends on RPM and page depth |
| Risk | Expert fees, ad-blockers, Google quality rater views of quiz farms, charity-claim scrutiny |

**SEO is the growth engine.** Titles are long, question-shaped, and category-clustered. The recreation should treat each quiz as a landing page with unique title, blurb, and internal links into packs.

## Recreation plan (what this repo implements vs later)

### Implemented in QuizForge (this codebase)

- Home, categories, packs, quizzes with explanations  
- Daily quiz (UTC rotation)  
- Secret quizzes + ad slots that hide for Premium  
- Local accounts, coins, certificates at 70%  
- Simulated Premium ($9.99 / $99.99 psychology) and donations  
- Leaderboard and profiles  
- Original question bank (public-domain facts, not scraped Grizly items)

### Production hardening (next engineering slices)

1. **Postgres + real auth** (password hashes, OAuth, sessions)  
2. **Stripe Billing** for Premium; **Stripe Charity / CAF** or Givebutter for gifts  
3. **Google Ad Manager / Prebid** on non-premium secret and article surfaces  
4. **CMS** (Sanity/Keystatic) so editors ship packs without deploys  
5. **Expert workflow** — contracts, review checklist, byline pages  
6. **Email** (series launches, dunning, donation receipts)  
7. **Analytics** — funnel: land → quiz start → complete → register → pay  
8. **Legal** — original questions, expert likeness rights, charity substantiation, COPPA/age gates  

### Go-to-market for a recreation

- Do **not** impersonate QuizGriz. Different brand, different experts, different items.  
- Win on **narrow vertical packs** (one expert, one topic, real certificate) rather than 2,000 thin quizzes.  
- Use the same **freemium + mission** story; measure paid conversion on the secret-quiz ad wall.

## Competitive set

Trivia apps (HQ-style live), Quizlet (study), Sporcle (user quizzes), Brilliant (paid learning), newspaper crossword/wordle habit loops. QuizGriz sits between **Sporcle entertainment** and **course-lite certificates**, monetized like **digital media**.

## Why the model works

- Cheap to try, expensive-feeling to finish a pack  
- Health halo reduces guilt vs “I wasted an hour on trivia”  
- Experts justify both SEO and Premium  
- Three revenue doors catch different willingness-to-pay  

## Why it fails if copied blindly

- Thin AI quizzes destroy the expert claim  
- Charity messaging without real disbursements is a trust bomb  
- Ad clutter on mobile kills completion rate, which kills the certificate loop  
- Coin sinks without sinks (nothing to buy) make coins meaningless — add cosmetic unlocks later
