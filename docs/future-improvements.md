# Future improvements

Ideas agreed to come back to later. Newest at the top; move an item to done (or delete it) once it ships.

## The founding ladder

Promised publicly on /open (the numbers live in `lib/founding.ts`), in this order. Only build what is on it, and keep it true. _(Agreed 2026-10-15.)_

1. **The whole Bible**, Walk and Sleep, all 66 books (~$950, ~11 founding members).
2. **A second Sleep reader**, gentle female voice (~$520; see Voices below).
3. **Bedtime Bible Stories**: 100 gentle, faithful retellings (David and Goliath, Daniel, the Prodigal Son…), 8–15 minutes each, with a children's mode. Scripts drafted, then checked against the text. Already on the shelf as "coming soon" (`COMING_SOON` in `lib/sleep/books.ts`).
4. **Spanish**: whole Bible, both modes; paintings reused (~$650).
5. **More languages**, chosen by founding members' vote (~7 members each).
6. **Apps with offline listening** (iPhone and Android).
7. **Keeping it running**: hosting and voices (~$100 a month) plus a modest developer wage (~$1,000 a month), shown as ~12 founding members a month.

Launch content plan: Genesis, Psalms (2 paintings per psalm), John, Ruth and Jonah; then a new book every 2–4 weeks (Exodus first). Psalms needs the ElevenLabs Pro plan.

## Voices

- **A female Sleep reader, as a choice.** Offer a gentle female voice alongside Theo (male, the Sleep default on ElevenLabs Flash) in Options and in onboarding's "Meet your readers". Pick it from the ElevenLabs voice library so the tone stays steady (Gemini voices drifted). About 95,000 Flash credits for all of Genesis. Already promised as "coming soon" on the founding card, onboarding offer, welcome page and /open. Log which reader people pick in GA4. _(Noted 2026-10-14.)_

## Audio delivery

- **Serve audio from audio.lampstandbible.com through Cloudflare.** Narration streams from the bucket's free r2.dev address, which isn't cached near listeners, so the first jump along the progress bar can lag a moment. Moving the domain's DNS from GoDaddy to Cloudflare (or a small Worker) would cache audio at the edge and remove that. Only the NEXT_PUBLIC_AUDIO_BASE_URL setting changes. _(Noted 2026-10-15.)_

## Payments and onboarding

- **Open checkout straight from the onboarding offer when signed in.** If someone is already signed in when they reach the onboarding offer, the button could open Paddle's checkout straight away, skipping the pricing page. That's one fewer step at the moment people are most likely to buy. People who aren't signed in would still go via account creation, which can't be skipped. _(Noted 2026-10-14.)_
