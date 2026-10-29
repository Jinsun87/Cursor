# Accounts & Premium setup (Supabase + Paddle)

How sign-in and Premium work, and the one-time setup for each environment.

## How it works

1. A reader signs in with an **email link** (default), a **password**, or **Google**. Supabase Auth holds accounts; a `profiles` row is created automatically.
2. Checkout requires an account. Each Paddle checkout carries `customData.userId` (the Supabase user id) and `userEmail`.
3. Paddle sends subscription webhooks to `/api/webhooks/paddle`. The handler verifies the signature and writes a snapshot of the subscription to `public.subscriptions` with the service-role key. Older events never overwrite newer ones.
4. **Premium = any subscription for the user with status `active`, `trialing`, or `past_due`** (`lib/entitlement.ts`). After cancelling, Paddle keeps it `active` until the paid period ends, then sends `canceled`.
5. The welcome page polls until the webhook lands, then shows "Premium is active".
6. "Manage subscription" on the profile opens Paddle's customer portal (cancel, change card, invoices) via `/api/billing/portal`.

Coins, quiz attempts, and certificates are still kept in the browser **per account** (`lib/local-progress.ts`) until progress sync is built. The first sign-in imports progress from the old browser-only account with the same email, and plain-text passwords from the old system are deleted from the browser.

## One-time setup

### 1. Supabase project

1. Create a project at supabase.com (free tier is fine).
2. **SQL Editor** → paste and run `supabase/migrations/20261001000000_accounts_premium.sql`.
3. **Project Settings → API Keys**: copy the **publishable** key and the **secret** key, and the project URL.

### 2. Auth settings (Supabase → Authentication)

- **URL Configuration**
  - Site URL: `https://lampstandbible.com`
  - Redirect URLs: `https://lampstandbible.com/auth/confirm**` and `http://localhost:3000/auth/confirm**`
- **Email templates**: change the link in **Magic Link** and **Confirm signup** so links work across devices (someone may request on a computer and open the email on a phone):

  ```html
  <a href="{{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=email">Sign in to Lampstand</a>
  ```

  `RedirectTo` already contains `/auth/confirm?next=…`, so the `&` is correct.
  Ready-made branded versions: `supabase/templates/magic-link.html` (subject "Your Lampstand sign-in link") and `supabase/templates/confirm-signup.html` (subject "Confirm your Lampstand account"). Paste each into its template.
- **SMTP via Resend (before launch)**: Supabase's built-in email is heavily rate-limited and meant for testing.
  1. resend.com → **Domains → Add domain** `lampstandbible.com`. Add the DNS records it shows (MX and SPF on `send.lampstandbible.com`, the `resend._domainkey` DKIM record, and a `_dmarc` record if there isn't one) at the DNS host (GoDaddy), then **Verify**.
  2. **API Keys → Create**: "Sending access", limited to lampstandbible.com.
  3. Supabase → **Authentication → Emails → SMTP Settings → Enable custom SMTP**: host `smtp.resend.com`, port `465`, username `resend`, password = the Resend API key, sender `hello@lampstandbible.com`, name `Lampstand`.
  4. **Authentication → Rate Limits**: raise "emails sent per hour" (custom SMTP starts at 30/hour).
  5. Test: register a new account and sign in with an email link; check both emails arrive (and not in spam).
- **Google (optional)**: enable the Google provider with a Google Cloud OAuth client, then set `NEXT_PUBLIC_AUTH_GOOGLE=true`.

### 3. Paddle (sandbox first)

1. Use a **sandbox** account: `NEXT_PUBLIC_PADDLE_ENV=sandbox`, sandbox client token (`test_…`), sandbox API key, sandbox price IDs.
2. **Developer tools → Notifications → New destination**: URL `https://<your-domain>/api/webhooks/paddle`, events: all `subscription.*`. Copy the secret key into `PADDLE_NOTIFICATION_WEBHOOK_SECRET`.
3. To test locally, expose the dev server (for example `npx ngrok http 3000`) and point a second sandbox destination at the tunnel URL.

### 4. Environment variables (Vercel → Settings → Environment Variables, and `.env.local`)

| Variable | Where it comes from | Exposed to browser |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase API settings | yes |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key | yes |
| `SUPABASE_SECRET_KEY` | Supabase secret key: **server only** | **no** |
| `NEXT_PUBLIC_AUTH_GOOGLE` | `true` once Google is configured | yes |
| `PADDLE_API_KEY`, `PADDLE_NOTIFICATION_WEBHOOK_SECRET` | Paddle developer tools | no |

Without the Supabase variables the site still builds and runs; sign-in shows "Accounts are not available right now".

### 5. Going live with Paddle

Sandbox stays for local development (`.env.local`) and Vercel **Preview**; only Vercel **Production** gets the live values. The code switches with `NEXT_PUBLIC_PADDLE_ENV=production` and refuses a `test_` client token in that mode.

1. **Paddle live account approved** for selling: business verification done, and **Checkout → Website approval** lists `lampstandbible.com` as approved. Paddle reviews the pricing, terms, refund and privacy pages, which all exist.
2. **Checkout → Checkout settings → Default payment link**: `https://lampstandbible.com/pricing`. Paddle sends people here with `?_ptxn=…` (card-update emails, payment links made in the dashboard), and only the pricing page loads Paddle.js, which then opens that checkout by itself. The home page does not load Paddle, so it would not work there.
3. **Catalog** (live), matching the sandbox catalogue:
   - Lampstand Pro **monthly** $4.99, recurring monthly, **7-day trial**.
   - Lampstand Pro **annual** $39.99, recurring yearly, **7-day trial**.
   - **Founding member** $99, one-time.
4. **Developer tools → Authentication**: a live **client-side token** (`live_…`) and a live **API key** with permission to create customer portal sessions (the only server call besides webhooks).
5. **Developer tools → Notifications → New destination** (live): `https://lampstandbible.com/api/webhooks/paddle`, events: every `subscription.*`, `transaction.completed`, `adjustment.created` and `adjustment.updated` (founding purchases and their refunds). Copy its secret key.
6. **Vercel → Settings → Environment Variables, Production only**:

   | Variable | Live value |
   | --- | --- |
   | `NEXT_PUBLIC_PADDLE_ENV` | `production` |
   | `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` | the `live_…` token |
   | `NEXT_PUBLIC_PADDLE_MONTHLY_PRICE_ID` | live monthly price id |
   | `NEXT_PUBLIC_PADDLE_ANNUAL_PRICE_ID` | live annual price id |
   | `NEXT_PUBLIC_PADDLE_LIFETIME_PRICE_ID` | live founding price id (the webhook uses it to recognise founding purchases) |
   | `PADDLE_API_KEY` | live API key |
   | `PADDLE_NOTIFICATION_WEBHOOK_SECRET` | live destination's secret |

   Leave the `…STARTER…` and `…ADVANCED…` price variables empty in Production (an old pricing model; the code skips them when unset).
7. **Remove sandbox test purchases** from Supabase so they do not count as founding members (SQL Editor): `delete from public.lifetime_purchases where price_id = '<sandbox founding price id>';` and the same for any sandbox rows in `public.subscriptions`.
8. **Redeploy**, then **Promote to Production**: `NEXT_PUBLIC_…` values are built into the site, so a new build is needed after changing them.
9. **Test with a real card**: subscribe monthly (the 7-day trial charges nothing), check `/welcome` shows Premium and `public.subscriptions` has the row, then cancel from the profile's "Manage subscription".

## Testing the full flow (sandbox)

1. Register at `/register` → open the email link → you land on `/profile`.
2. Go to `/premium` → subscribe with a Paddle sandbox test card (`4242 4242 4242 4242`, any future date, any CVC).
3. `/welcome` shows "Confirming your payment…", then "Premium is active".
4. `/secret` shows no ads; `/profile` shows plan, renewal date, and "Manage subscription".
5. In the portal, cancel → profile shows "Ends on …"; Premium stays until that date.

Check `public.subscriptions` in the Supabase table editor at each step. A row with an empty `user_id` means the checkout had no matching account; link it by setting `user_id` manually.
