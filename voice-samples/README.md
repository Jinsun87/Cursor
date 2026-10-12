# Sleep voice candidates (Genesis 1)

Same passages, pauses and warm finish; only the voice differs. Not deployed.

| File | Voice | Length | Approx. cost, all of Genesis |
|---|---|---|---|
| genesis-1-openai-onyx-current.mp3 | OpenAI gpt-4o-mini-tts, onyx (live now) | 4:32 | ~$3 |
| genesis-1-gemini-flash-algieba-natural.mp3 | Google Gemini 2.5 Flash TTS, Algieba, "natural pace" instructions | 5:58 | ~$4 |
| genesis-1-google-chirp3hd-algieba.mp3 | Google Chirp 3 HD, Algieba, 0.9x | 4:52 | free tier |

Regenerate with `npx tsx scripts/voice-test-google.ts --engine=gemini --voice=Algieba --style=natural --out=voice-samples`.
