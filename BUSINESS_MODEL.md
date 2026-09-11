# Lampstand — niche, loop, and what this repo implements

Lampstand is a **Christian Scripture quiz product**. The promise is *Know the text.* It is not a church, not pastoral care, and not affiliated with any denomination. Questions are original public-domain biblical facts. Branding is original.

The **operating loop** is the same paid-click + long sitting model used by many trivia gyms: inventory pages that earn attention, packs that take time, ads on a “secret” trail, Premium that quiets ads, and optional gifts. This repo used to ship that loop under a generic gym name; the live product is now Lampstand.

We do **not** copy another site’s ads, trademarks, or question banks.

## Positioning

- Emotional promise: stay with Scripture long enough to remember it
- Functional promise: original multiple-choice sittings, a fact after every answer
- Social promise: certificates, coins, a board
- Boundary: knowledge product, not congregational life

Flagship inventory is **Open the Book** (50+ questions). **Bible Foundations** is the mastery pack. History, geography, and other secular quizzes stay in the library so the engine still has breadth; they are not the homepage hero.

## Value proposition

| Job | How Lampstand does it |
| --- | --- |
| A sitting that is not a feed | Longform Scripture quiz with course medals and pauses |
| Actually learn a slice of the text | Pack of ~5 quizzes + harder review |
| Show the work | Certificate of Mastery at **70%+** on the review |
| Daily habit | Ten Scripture questions, UTC rotation |
| Quiet study | Premium hides ads on `/secret` (Quiet room) |

## Product surface

1. **Home** — Know the text, Open the Book CTA, Bible sittings first  
2. **Category hubs** — Bible first, then history, geography, and the rest  
3. **Quiz packs** — Bible Foundations plus geography, survival, history, science  
4. **Individual quizzes** — scored, explanations, coins  
5. **Daily trivia** — Scripture bank  
6. **Quiet room (`/secret`)** — ads unless Premium  
7. **Auth** — optional to browse; required for progress  
8. **Profile, leaderboard, Premium, donations**

## Revenue model (three-legged)

```
        ┌──────────────┐
        │   Quizzes    │  attention + emails
        └──────┬───────┘
               │
     ┌─────────┼─────────┐
     ▼         ▼         ▼
  Advertising  Premium   Donations
  (free users, (ad-lite   (ops)
   secret trail) secret +
                 coins +
                 badge)
```

Same doors as a freemium trivia gym. Conversion still happens on the ad wall and the long sitting that makes Premium feel like quiet.

## Engagement / game economy

- **Coins** — earned on play; 50/50 and skip-ad sinks; streak of five skips a longform pause  
- **Certificates** — pack + 70% review  
- **HUD** — question, accuracy, coins, streak  
- **Resume** — mid-quiz sittings in `localStorage`  
- **Course medals** — every five answers on longform

## Recreation plan (implemented vs later)

### Implemented in Lampstand (this codebase)

- Home, categories, packs, quizzes with explanations  
- Daily Scripture quiz (UTC rotation)  
- Quiet room + ad slots that hide for Premium  
- Local accounts, coins, certificates at 70%  
- Simulated Premium ($9.99 / $99.99 psychology) and donations  
- Leaderboard and profiles  
- Original question bank (public-domain biblical and general facts)

### Production hardening (next engineering slices)

1. **Postgres + real auth**  
2. **Stripe Billing** for Premium; a real gift processor for donations  
3. **Ad inventory** on non-premium Quiet room and longform pauses  
4. **CMS** so editors ship packs without deploys  
5. **Email** (series launches)  
6. **Analytics** — land → Open the Book start → complete → register → pay  
7. **Legal** — original questions, no implied church affiliation, age gates  

### Go-to-market

- Win on **narrow vertical packs** (Scripture first) rather than thousands of thin quizzes.  
- Measure paid conversion on the Quiet-room ad wall and the 54-question sitting.  
- Never impersonate another trivia brand or a denomination.

## Why this niche can work

- Cheap to try, expensive-feeling to finish Open the Book or a pack  
- The text itself is the expert — no fake celebrity byline  
- Three revenue doors catch different willingness-to-pay  

## Why it fails if copied blindly

- Thin AI quizzes destroy the “know the text” claim  
- Church language without a church is confusing; stay a quiz desk  
- Ad clutter on mobile kills completion, which kills the certificate loop  
- Coin sinks without sinks make coins meaningless
