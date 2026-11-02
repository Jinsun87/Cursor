# Meta ads tracking (Pixel + Conversions API)

What it does, and the one-time setup. The marketing plan explains why; this page is the wiring.

## Events

| Event | When | Sent from |
| --- | --- | --- |
| PageView | Every page | Browser pixel |
| ViewContent | A chapter or story starts in the player (`lib/sleep/sleep-audio.tsx`) | Browser pixel + server relay (`/api/meta/event`), same event id |
| CompleteRegistration | The register form succeeds (`app/register/page.tsx`) | Browser pixel + server relay, same event id |
| StartTrial | Paddle `subscription.created` with status `trialing` | Paddle webhook → Conversions API |
| Subscribe | Paddle `subscription.activated` (first payment after the trial) | Paddle webhook → Conversions API |
| Purchase | Paddle `transaction.completed` for the founding price | Paddle webhook → Conversions API |

Billing events use Paddle's ids (`trial-sub_…`, `purchase-txn_…`), so a retried webhook is counted once. Email and account id are SHA-256 hashed before they leave our server (`lib/meta/capi.ts`).

## Consent

- Europe (time zone `Europe/…`, plus Iceland and the Atlantic islands of EU countries): nothing loads until the visitor taps **Allow** on the banner (`components/MetaPixel.tsx`).
- Elsewhere: on by default; anyone can switch it off on `/privacy` (`components/AdConsentChoice.tsx`).
- Checkouts carry `adConsent`, `fbp` and `fbc` in Paddle custom data (`checkoutAdData()`); the webhook sends a conversion only when `adConsent` is `granted`.
- Nothing loads at all unless `NEXT_PUBLIC_META_PIXEL_ID` is set.

## One-time setup (founder)

1. **Meta Business Suite → Events Manager → Connect data sources → Web**: create a dataset (pixel) named Lampstand. Copy its numeric **Dataset ID**.
2. **Events Manager → the dataset → Settings → Conversions API → Generate access token**. Copy it (it is shown once).
3. **Settings → Domain verification** (Business settings → Brand safety → Domains): add `lampstandbible.com` with the DNS TXT record, then verify.
4. **Vercel → Settings → Environment Variables (Production)**:

   | Variable | Value |
   | --- | --- |
   | `NEXT_PUBLIC_META_PIXEL_ID` | the Dataset ID (digits only) |
   | `META_CAPI_ACCESS_TOKEN` | the access token (server only) |
   | `META_TEST_EVENT_CODE` | optional, only while testing (from Events Manager → Test events); remove afterwards |

5. Redeploy, then **Promote to Production** (`NEXT_PUBLIC_…` values are built into the site).
6. **Test**: Events Manager → **Test events** → open the site, play a chapter. PageView and ViewContent should appear twice each (Browser and Server) and show as deduplicated.

## Ads

Optimise the first campaign for **CompleteRegistration**, then switch to **StartTrial** once there are about 50 trials a week. Ad wording rules are in the marketing plan.
