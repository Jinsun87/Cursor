/**
 * PLACEHOLDER narration for a Sleep chapter, made with the local Windows
 * speech engine (free, offline, robotic). Writes one continuous WAV for the
 * whole chapter plus timing.json with each verse's start time, which is all
 * the Sleep player needs. Real narration replaces chapter.wav + timing.json.
 *
 *   npx tsx scripts/sleep-placeholder-voice.ts
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { SLEEP_GENESIS_1 } from "../lib/sleep/genesis-1";

const VOICE = "Microsoft David Desktop";
const RATE = -3; // slower than the Daily Walk: this is read for falling asleep
const GAP_SECONDS = 1.4; // stillness between verses
const LEAD_SECONDS = 2; // quiet before the first verse

const chapter = SLEEP_GENESIS_1;
const outDir = join(process.cwd(), "public", chapter.audioSrc.split("/").slice(0, -1).join("/"));
const workDir = join(tmpdir(), `sleep-${chapter.slug}`);
mkdirSync(outDir, { recursive: true });
mkdirSync(workDir, { recursive: true });

const jobs = chapter.verses.map((v) => ({
  text: v.text.replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/—/g, ", "),
  file: join(workDir, `v${v.n}.wav`),
}));
const jobsPath = join(workDir, "jobs.json");
writeFileSync(jobsPath, JSON.stringify(jobs), "utf8");

execFileSync(
  "powershell.exe",
  [
    "-NoProfile",
    "-Command",
    `Add-Type -AssemblyName System.Speech
$s = New-Object System.Speech.Synthesis.SpeechSynthesizer
$s.SelectVoice('${VOICE}')
$s.Rate = ${RATE}
foreach ($job in (Get-Content -Raw -Encoding UTF8 '${jobsPath}' | ConvertFrom-Json)) {
  $s.SetOutputToWaveFile($job.file)
  $s.Speak($job.text)
}
$s.SetOutputToNull()`,
  ],
  { stdio: "inherit" },
);

type Pcm = { fmt: Buffer; data: Buffer; byteRate: number; blockAlign: number };

function readWav(path: string): Pcm {
  const buf = readFileSync(path);
  let offset = 12;
  let fmt: Buffer | undefined;
  let data: Buffer | undefined;
  while (offset < buf.length) {
    const id = buf.toString("ascii", offset, offset + 4);
    const size = buf.readUInt32LE(offset + 4);
    const chunk = buf.subarray(offset + 8, offset + 8 + size);
    if (id === "fmt ") fmt = chunk;
    if (id === "data") data = chunk;
    offset += 8 + size + (size % 2);
  }
  if (!fmt || !data) throw new Error(`Bad WAV: ${path}`);
  return { fmt, data, byteRate: fmt.readUInt32LE(8), blockAlign: fmt.readUInt16LE(12) };
}

const clips = jobs.map((j) => readWav(j.file));
const { fmt, byteRate, blockAlign } = clips[0];
const silence = (seconds: number) => Buffer.alloc(Math.round((seconds * byteRate) / blockAlign) * blockAlign);

const parts: Buffer[] = [silence(LEAD_SECONDS)];
const timing: Record<string, number> = {};
let cursor = LEAD_SECONDS;
chapter.verses.forEach((v, i) => {
  timing[String(v.n)] = Math.round(cursor * 100) / 100;
  parts.push(clips[i].data, silence(GAP_SECONDS));
  cursor += clips[i].data.length / byteRate + GAP_SECONDS;
});
const data = Buffer.concat(parts);

const header = Buffer.alloc(12 + 8 + fmt.length + 8);
header.write("RIFF", 0, "ascii");
header.writeUInt32LE(header.length - 8 + data.length, 4);
header.write("WAVE", 8, "ascii");
header.write("fmt ", 12, "ascii");
header.writeUInt32LE(fmt.length, 16);
fmt.copy(header, 20);
header.write("data", 20 + fmt.length, "ascii");
header.writeUInt32LE(data.length, 24 + fmt.length);

writeFileSync(join(outDir, "chapter.wav"), Buffer.concat([header, data]));
writeFileSync(
  join(outDir, "timing.json"),
  JSON.stringify({ duration: Math.round(cursor * 100) / 100, verses: timing }, null, 2) + "\n",
);
rmSync(workDir, { recursive: true, force: true });
console.log(`${chapter.verses.length} verses, ${cursor.toFixed(1)}s → ${outDir}`);
