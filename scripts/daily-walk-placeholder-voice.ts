/**
 * Generates PLACEHOLDER narration for a Daily Walk episode with the local
 * Windows speech engine (free, offline, robotic), plus timing.json with each
 * clip's duration in seconds. Real narration replaces these WAVs later; the
 * player only needs the same file names and an updated timing.json.
 *
 *   npx tsx scripts/daily-walk-placeholder-voice.ts
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { GENESIS_1 } from "../lib/daily-walk/genesis-1";
import { episodeClips } from "../lib/daily-walk/types";

const VOICE = "Microsoft David Desktop";
const RATE = -1; // SAPI scale -10..10; slightly slower than default

const episode = GENESIS_1;
const outDir = join(process.cwd(), "public", episode.audioDir);
mkdirSync(outDir, { recursive: true });

const clips = episodeClips(episode).map((clip) => ({
  text: clip.text.replace(/[“”]/g, '"').replace(/—/g, ", "),
  file: join(outDir, `${clip.name}.wav`),
  name: clip.name,
}));

const jobsPath = join(tmpdir(), "daily-walk-jobs.json");
writeFileSync(jobsPath, JSON.stringify(clips), "utf8");

const ps = `
Add-Type -AssemblyName System.Speech
$s = New-Object System.Speech.Synthesis.SpeechSynthesizer
$s.SelectVoice('${VOICE}')
$s.Rate = ${RATE}
foreach ($job in (Get-Content -Raw -Encoding UTF8 '${jobsPath}' | ConvertFrom-Json)) {
  $s.SetOutputToWaveFile($job.file)
  $s.Speak($job.text)
}
$s.SetOutputToNull()
`;
execFileSync("powershell.exe", ["-NoProfile", "-Command", ps], { stdio: "inherit" });

/** Duration of a PCM WAV: data chunk size / byte rate. */
function wavSeconds(path: string): number {
  const buf = readFileSync(path);
  const byteRate = buf.readUInt32LE(28);
  let offset = 12;
  while (offset < buf.length) {
    const id = buf.toString("ascii", offset, offset + 4);
    const size = buf.readUInt32LE(offset + 4);
    if (id === "data") return Math.round((size / byteRate) * 100) / 100;
    offset += 8 + size;
  }
  throw new Error(`No data chunk in ${path}`);
}

const timing = Object.fromEntries(clips.map((c) => [c.name, wavSeconds(c.file)]));
writeFileSync(join(outDir, "timing.json"), JSON.stringify(timing, null, 2) + "\n");
const total = Object.values(timing).reduce((a, b) => a + b, 0);
console.log(`${clips.length} clips, ${total.toFixed(1)}s of speech → ${outDir}`);
