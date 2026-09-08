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

## Ezoic ads

Standalone JavaScript only (not nameserver / Cloud takeover). Apex **mediareferee.com** stays on the existing site. Lampstand stays on **quiz.mediareferee.com** (Vercel already owns that CNAME).

Cursor MCP: `.cursor/mcp.json` → `https://setup-agent.ezoic.com/mcp` (streamable HTTP, no auth). Reload MCP in desktop Cursor. Cloud agents do not load that server automatically.

### What Ezoic actually blocks

Ezoic does **not** publish a rule that JavaScript is forbidden on a subdomain. The quiz app can keep `sa.min.js` + placeholders on `quiz.mediareferee.com` while the apex host stays untouched.

What *is* documented:

| Surface | Policy |
| --- | --- |
| **Add a Site** | Enter a **bare domain** like `newsite.com` — no `https://`. The published example is a registrable domain, not `quiz.example.com`. Subdomains (`quiz`, `www`, `blog`) are treated as **hostnames of that domain**, not a second dashboard site. If the form rejects `quiz.mediareferee.com`, that is expected. |
| **Cloud / nameservers** | DNS for the **whole zone**, including apex. Do **not** point `mediareferee.com` nameservers (or an apex CNAME) at Ezoic or Vercel. That would take the existing apex site with it. |
| **ads.txt** | Inventory on `quiz.mediareferee.com` needs `https://quiz.mediareferee.com/ads.txt`. Apex `mediareferee.com/ads.txt` does **not** cover the quiz host by itself. Domain MCM/Verify still looks at the **root** file, so merge Ezoic’s seller lines into `https://mediareferee.com/ads.txt` (or the same 301) without wiping sellers the apex already uses. |
| **New sites (after 19 Feb 2026)** | New publishers need **250,000 monthly users**, or apply to [Incubator](https://www.ezoic.com/incubator) (20 sites/month). Existing Ezoic sites from before that date are grandfathered; a **new** Add Site row can still hit this bar. |

Sources: [Add a site](https://support.ezoic.com/kb/article/how-do-i-add-a-new-site-or-domain-to-my-account), [ads.txt](https://support.ezoic.com/kb/article/everything-you-need-to-know-about-adstxt), [Incubator](https://www.ezoic.com/incubator).

### If you cannot add quiz.mediareferee.com as an Ezoic site

**Recommended (keep this live host):**

1. [login.ezoic.com](https://login.ezoic.com/) → **Add a Site** → **`mediareferee.com`** (no scheme, no `quiz.`). Integration **JavaScript**, not Name Servers.
2. Put Ezoic JS **only** on this quiz app (`NEXT_PUBLIC_EZOIC_ADS=true` on the Vercel project). Do not paste Ezoic tags onto the existing apex pages unless you want ads there.
3. Serve ads.txt **on the quiz host** (step 3 below). Google MCM will review **mediareferee.com** as a domain — including whatever is live on the apex. If that review would mix two products in a way you do not want, use a second domain instead.

**Do not** move Lampstand to `www.mediareferee.com`. `www` is the same Ezoic site as the apex, and it would collide with the current apex product.

**Do not** put the quiz at `mediareferee.com/quiz` unless you are ready to host this Next.js app on the existing apex origin.

**Cleaner isolation (if apex must never appear in Ezoic/MCM):** register a **second registrable domain** (not a hostname of mediareferee.com), add *that* domain in Ezoic, point it at this Vercel project, and leave quiz.mediareferee.com as a redirect or drop it. Then ads.txt and MCM are only for the new origin.

Code already:

- Puts Gatekeeper CMP + `sa.min.js` in `<head>` when `NEXT_PUBLIC_EZOIC_ADS=true` (native tags, not `next/script` `beforeInteractive`, which broke hydration)
- Marks the app as an SPA and re-requests ads on App Router pathname changes
- Renders placeholders **101** (in-quiz secret), **102** (between-course), **103** (post-quiz), **104** (quiet room). If the dashboard assigns other IDs, change `EZOIC_PLACEHOLDERS` in `lib/ezoic.ts` — do not invent IDs
- Hides slots for Premium
- Leaves Playwright with the flag unset so tests stay copy-only

You still own the dashboard:

1. Add **`mediareferee.com`** (or a second registrable domain). Do not use Name Servers. Skip this if that domain is already an Ezoic site on this account — then only finish JS + ads.txt + MCM on this host.
2. Vercel **Config**: `NEXT_PUBLIC_EZOIC_ADS=true` on Production, then Redeploy. Confirm CMP/`sa.min.js` in View Source (not only after client JS).
3. **EzoicAds → Ad Transparency → Ads.txt** — JavaScript integration. Either paste the generated file over `public/ads.txt`, or set server env `EZOIC_ADS_TXT_URL` to the Ads.txt Manager URL the dashboard shows (301). The manager URL’s hostname may be the **apex** (`…/mediareferee.com`); the **redirect still belongs on this quiz origin**. Then **Verify**. Do not invent a publisher ID.
4. **Google MCM** — send invite, accept in Google, wait for the **registered domain** to be approved. Ads will not fill without it. ads.txt must be valid first.
5. **Settings → Privacy** — turn GDPR/CCPA on, submit `https://quiz.mediareferee.com/privacy`, clear consent cache.
6. **EzoicAds → Placeholders** — create four placements and match the IDs in code.
7. In-browser: `https://quiz.mediareferee.com/?ez_js_debugger=1` and `/secret`, `/quizzes/open-the-book`. Expect 14–30 days of ramp-up after MCM.

Do not buy paid traffic until slots actually fill.


