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

1. Create a Vercel account and **import this GitHub repo** (that is the durable live site, not a 60-minute demo).
2. Production branch: `cursor/quizforge-business-model-94c3` until merged to `main`.
3. Env: `NEXT_PUBLIC_SITE_URL=https://quiz.mediareferee.com`.
4. Project → Settings → Domains → add `quiz.mediareferee.com`.
5. At the mediareferee.com DNS host: `quiz` CNAME to the target Vercel shows.

A CLI anonymous deploy expires in an hour unless you claim it. Git import is what you want for going live.

## Ads (AdSense on apex and quiz)

**Yes — implement AdSense** for the approved apex. Do not run AdSense and Ezoic tags on the same HTML document.

**WordPress `mediareferee.com` (not this repo):** In AdSense, enable the site and Auto ads (or paste the official snippet once). Remove the Ezoic plugin, any extra `ezojs.com` header snippets, and a second `adsbygoogle.js` if Auto ads already injects one. Purge cache.

**This quiz app:** In Vercel Config set `NEXT_PUBLIC_ADSENSE_CLIENT` to `ca-pub-3795330167795048`. Leave `NEXT_PUBLIC_EZOIC_ADS` unset. Optional: `NEXT_PUBLIC_ADSENSE_SLOT` for a display unit (without a slot, Auto ads / page-level ads must be on in the AdSense UI). AdSense does not take `quiz.mediareferee.com` as its own site; approval of **mediareferee.com** covers this host. Open the Book shows an in-quiz unit from question 1, then between-course and post-quiz units. Empty units until Google crawls the quiz URLs are still possible.

ads.txt on both hosts already 301s to AdsTxtManager and already lists this Google publisher id.

## Ezoic ads

Ezoic standalone JS remains in the codebase if you switch back. Do not enable it while AdSense is on.

Standalone JavaScript only (not nameserver / Cloud takeover). Apex **mediareferee.com** stays on the existing site. Lampstand stays on **quiz.mediareferee.com** (Vercel already owns that CNAME).

Cursor MCP: `.cursor/mcp.json` → `https://setup-agent.ezoic.com/mcp` (streamable HTTP, no auth). Reload MCP in desktop Cursor. Cloud agents do not load that server automatically.

### What Ezoic actually blocks

Ezoic does **not** publish a rule that JavaScript is forbidden on a subdomain. The quiz app can keep `sa.min.js` + placeholders on `quiz.mediareferee.com` while the apex host stays untouched.

What *is* documented:

| Surface | Policy |
| --- | --- |
| **Add a Site** | Enter a **bare domain** like `newsite.com` — no `https://`. The published example is a registrable domain, not `quiz.example.com`. Subdomains (`quiz`, `www`, `blog`) are treated as **hostnames of that domain**, not a second dashboard site. If the form rejects `quiz.mediareferee.com`, that is expected. |
| **Cloud / nameservers** | DNS for the **whole zone**, including apex. Do **not** point `mediareferee.com` nameservers (or an apex CNAME) at Ezoic or Vercel. That would take the existing apex site with it. |
| **ads.txt** | Quiz impressions need `https://quiz.mediareferee.com/ads.txt`. Ezoic’s **site** is `mediareferee.com`, so dashboard **Verify** / MCM typically fetch `https://mediareferee.com/ads.txt` as well. Serve Ezoic’s file (or the same 301) on **both** hosts. On the apex, **merge** Ezoic seller lines into the existing file — do not wipe sellers the current mediareferee.com site already uses. |
| **New sites (after 19 Feb 2026)** | New publishers need **250,000 monthly users**, or apply to [Incubator](https://www.ezoic.com/incubator) (20 sites/month). Existing Ezoic sites from before that date are grandfathered; a **new** Add Site row can still hit this bar. |

Sources: [Add a site](https://support.ezoic.com/kb/article/how-do-i-add-a-new-site-or-domain-to-my-account), [ads.txt](https://support.ezoic.com/kb/article/everything-you-need-to-know-about-adstxt), [Incubator](https://www.ezoic.com/incubator).

### If you cannot add quiz.mediareferee.com as an Ezoic site

**Recommended (keep this live host):**

1. [login.ezoic.com](https://login.ezoic.com/) → **Add a Site** → **`mediareferee.com`** (no scheme, no `quiz.`). Integration **JavaScript**, not Name Servers.
2. Put Ezoic JS **only** on this quiz app (`NEXT_PUBLIC_EZOIC_ADS=true` on the Vercel project). Do not paste Ezoic tags onto the existing apex pages unless you want ads there.
3. Serve ads.txt on **the quiz host** and, for dashboard Verify, on **the apex** (step 3 below). Google MCM reviews **mediareferee.com** — including whatever is live on the apex. If that review would mix two products in a way you do not want, use a second domain instead.

**Do not** move Lampstand to `www.mediareferee.com`. `www` is the same Ezoic site as the apex, and it would collide with the current apex product.

**Do not** put the quiz at `mediareferee.com/quiz` unless you are ready to host this Next.js app on the existing apex origin.

**Cleaner isolation (if apex must never appear in Ezoic/MCM):** register a **second registrable domain** (not a hostname of mediareferee.com), add *that* domain in Ezoic, point it at this Vercel project, and leave quiz.mediareferee.com as a redirect or drop it. Then ads.txt and MCM are only for the new origin.

Code already:

- Puts Gatekeeper CMP + `sa.min.js` in `<head>` when `NEXT_PUBLIC_EZOIC_ADS=true` (native tags, not `next/script` `beforeInteractive`, which broke hydration)
- Marks the app as an SPA and re-requests ads on App Router pathname changes
- Renders dashboard placeholders **645** (in-quiz secret), **646** (between-course), **647** (post-quiz), **648** (quiet room) from `EZOIC_PLACEHOLDERS` in `lib/ezoic.ts`
- Hides slots for Premium
- Leaves Playwright with the flag unset so tests stay copy-only

You still own the dashboard:

1. **`mediareferee.com` is already an Ezoic site.** Do not Add a Site again. Do not use Name Servers.
2. Apex ads.txt is already a 301 to Ads.txt Manager (`https://srv.adstxtmanager.com/85097/mediareferee.com`). This app 301s `https://quiz.mediareferee.com/ads.txt` to the **same** URL. After deploy, open that quiz URL and confirm seller lines (`ezoic.ai`, `ownerdomain=mediareferee.com`). Then **Verify** in EzoicAds → Ad Transparency → Ads.txt.
3. Vercel **Config**: `NEXT_PUBLIC_EZOIC_ADS=true` on Production, then Redeploy. Confirm CMP/`sa.min.js` in View Source on the quiz host only.
4. **Google MCM** — if the apex is already approved, confirm **quiz** inventory is in scope; if MCM is still pending, finish the Google invite. Ads will not fill without it.
5. **Settings → Privacy** — GDPR/CCPA on, submit `https://quiz.mediareferee.com/privacy`, clear consent cache.
6. Placeholders **645–648** are already wired. If you recreate them and get new IDs, update `EZOIC_PLACEHOLDERS`.
7. In-browser: `https://quiz.mediareferee.com/?ez_js_debugger=1` and `/secret`, `/quizzes/open-the-book`. Expect 14–30 days of ramp-up after MCM.

Do not buy paid traffic until slots actually fill.


