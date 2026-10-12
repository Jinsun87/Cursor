/**
 * Re-voices (or re-finishes) Genesis 1 for Sleep. Other chapters use
 * scripts/sleep-chapter.ts; both share scripts/lib/sleep-voice.ts.
 *
 *   npx tsx scripts/sleep-openai-voice-v2.ts --out=public/sleep/genesis-1
 *   --voice=<name>  --keep-plain  --plain=<mp3> (re-finish and re-time an earlier take, no speech API)
 */
import { SLEEP_GENESIS_1 } from "../lib/sleep/genesis-1";
import { voiceChapter } from "./lib/sleep-voice";

const arg = (name: string) => process.argv.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];
const out = arg("out");
if (!out) throw new Error("--out=<folder> is required");

voiceChapter(SLEEP_GENESIS_1.verses, out, {
  voice: arg("voice"),
  plain: arg("plain"),
  keepPlain: process.argv.includes("--keep-plain"),
  label: "Genesis 1",
}).then(({ duration, missed }) =>
  console.log(`\nGenesis 1: ${SLEEP_GENESIS_1.verses.length} verses, ${duration}s, ${missed} verse starts estimated → ${out}`),
);
