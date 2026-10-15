# Future improvements

Ideas agreed to come back to later. Newest at the top; move an item to done (or delete it) once it ships.

## Voices

- **A female Sleep reader, as a choice.** Offer a gentle female voice alongside Theo (male, the Sleep default on ElevenLabs Flash) in Options and in onboarding's "Meet your readers". Pick it from the ElevenLabs voice library so the tone stays steady (Gemini voices drifted). About 95,000 Flash credits for all of Genesis. Already promised as "coming soon" on the founding card, onboarding offer, welcome page and /open. Log which reader people pick in GA4. _(Noted 2026-10-14.)_

## Audio delivery

- **Serve audio from audio.lampstandbible.com through Cloudflare.** Narration streams from the bucket's free r2.dev address, which isn't cached near listeners, so the first jump along the progress bar can lag a moment. Moving the domain's DNS from GoDaddy to Cloudflare (or a small Worker) would cache audio at the edge and remove that. Only the NEXT_PUBLIC_AUDIO_BASE_URL setting changes. _(Noted 2026-10-15.)_

## Payments and onboarding

- **Open checkout straight from the onboarding offer when signed in.** If someone is already signed in when they reach the onboarding offer, the button could open Paddle's checkout straight away, skipping the pricing page. That's one fewer step at the moment people are most likely to buy. People who aren't signed in would still go via account creation, which can't be skipped. _(Noted 2026-10-14.)_
