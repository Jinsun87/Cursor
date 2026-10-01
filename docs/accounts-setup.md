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
- **SMTP (before launch)**: Supabase's built-in email is heavily rate-limited and meant for testing. Add a sender such as Resend under **Authentication → SMTP Settings**, from an address on lampstandbible.com.
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

## Testing the full flow (sandbox)

1. Register at `/register` → open the email link → you land on `/profile`.
2. Go to `/premium` → subscribe with a Paddle sandbox test card (`4242 4242 4242 4242`, any future date, any CVC).
3. `/welcome` shows "Confirming your payment…", then "Premium is active".
4. `/secret` shows no ads; `/profile` shows plan, renewal date, and "Manage subscription".
5. In the portal, cancel → profile shows "Ends on …"; Premium stays until that date.

Check `public.subscriptions` in the Supabase table editor at each step. A row with an empty `user_id` means the checkout had no matching account; link it by setting `user_id` manually.
