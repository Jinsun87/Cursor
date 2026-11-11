/**
 * Narrated Scripture clips for Facebook (1080×1920): a hook on screen, one idea with a verse,
 * word-by-word captions over the paintings, and the Lampstand end card. Three series:
 *   dailyhope  "Scripture for sleepless nights" for the Jesus Your Daily Hope page (below)
 *   walk       morning reels for the Lampstand Sleep & Walk Bible page (clips-sleepwalk.ts)
 *   sleep      bedtime reels for the Lampstand Sleep & Walk Bible page (clips-sleepwalk.ts)
 *   night      Night Stories of the Bible for the Bible For Sleep page (clips-night.ts)
 *
 *   npx tsx video/clips.ts                     # every dailyhope clip
 *   npx tsx video/clips.ts psalm-4-breath      # one dailyhope clip
 *   npx tsx video/clips.ts walk                # every clip in a series
 *   npx tsx video/clips.ts walk lamp-to-my-feet
 *
 * Narration: ElevenLabs (the Sleep voice, Theo Silk) with character timestamps, so the captions
 * are timed exactly with no transcription. Each clip's audio is cached in video/.work/clips/ by
 * its script, so a re-render costs nothing unless the words change. Scripture is quoted word for
 * word from the Berean Standard Bible (data/bsb.txt), as in the app.
 * The walk series uses a clearer daytime voice (Eric). Writes video/out/clips/[<series>/]<id>.mp4
 * and <id>.txt (post caption, and a link comment to use only once a reel passes 500 views), and a copy under fb/ that fits Facebook's 10 MB limit.
 */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { END_CARD, type AdProps, type AdWord } from "./src/types";
import { SLEEPWALK_CLIPS } from "./clips-sleepwalk";
import { NIGHT_CLIPS } from "./clips-night";

const ROOT = resolve(__dirname, "..");
const WORK = join(ROOT, "video", ".work", "clips");
const OUT = join(ROOT, "video", "out", "clips");

const MODEL = "eleven_multilingual_v2";

type Voice = { id: string; settings: Record<string, number | boolean>; finish: string };

const SLEEP_VOICE: Voice = {
  id: "UmQN7jS1Ee8B1czsUtQh", // Theo Silk, the app's Sleep voice
  settings: { stability: 0.6, similarity_boost: 0.8, style: 0.1, use_speaker_boost: true, speed: 1.0 },
  // Warm and soft, as the Sleep narration (scripts/lib/sleep-voice.ts FINISH).
  finish: "highpass=f=70,lowpass=f=6500,equalizer=f=3500:t=q:w=1.2:g=-4,equalizer=f=180:t=q:w=1:g=2,loudnorm=I=-16:TP=-1.5:LRA=7",
};

const WALK_VOICE: Voice = {
  id: "cjVigY5qzO86Huf0OWal", // Eric, smooth and clear, for mornings
  settings: { stability: 0.5, similarity_boost: 0.8, style: 0.15, use_speaker_boost: true, speed: 1.0 },
  // Daytime: clean and level, no warm EQ, as the Walk narration.
  finish: "highpass=f=70,loudnorm=I=-16:TP=-1.5:LRA=9",
};

type Series = {
  voice: Voice;
  /** Folder under video/out/clips/ ("" for the first series). */
  dir: string;
  cta: string;
  ctaSub: string;
  /** The post link's page and tracking. */
  path: string;
  source: string;
  campaign: string;
  /** The line under the caption (no link), and the comment to add with the link once a reel passes 500 views. */
  invite: string;
  comment: string;
  hashtags: string;
  /** End-card line inviting a follow or a save. */
  endNote?: string;
  /** Soft rain under the voice and the end card, like the app's Sleep mode. */
  rain?: boolean;
};

const SERIES = {
  dailyhope: {
    voice: SLEEP_VOICE,
    dir: "",
    cta: "Fall asleep to Scripture tonight",
    ctaSub: "Psalms and Bible stories, read softly for sleep",
    path: "/?tab=sleep",
    source: "fb-dailyhope",
    campaign: "sleep-clips",
    invite: "Follow for Scripture to fall asleep to, every night. 🌙",
    comment: "Fall asleep to the Psalms, read softly with a sleep timer and gentle rain:",
    hashtags: "#Bible #Psalms #sleep #faith #JesusYourDailyHope",
  },
  walk: {
    voice: WALK_VOICE,
    dir: "walk",
    cta: "Start your day in the Word",
    ctaSub: "Every chapter, read aloud for your walk",
    path: "/?tab=walk",
    source: "fb-sleepwalk",
    campaign: "walk-reels",
    invite: "Follow for a verse every morning. ☀️",
    comment: "Hear every chapter of the Bible read aloud, word for word, for your walk:",
    hashtags: "#Bible #morning #VerseOfTheDay #faith #Lampstand",
    endNote: "Follow for tomorrow morning's verse",
  },
  sleep: {
    voice: SLEEP_VOICE,
    dir: "sleep",
    cta: "Fall asleep to Scripture tonight",
    ctaSub: "Psalms and Bible stories, read softly for sleep",
    path: "/?tab=sleep",
    source: "fb-sleepwalk",
    campaign: "sleep-reels",
    invite: "Save this for a sleepless night, and follow for tomorrow's. 🌙",
    comment: "Fall asleep to the Psalms, read softly with a sleep timer and gentle rain:",
    hashtags: "#Bible #Psalms #sleep #faith #Lampstand",
    endNote: "Save this for a sleepless night",
    rain: true,
  },
  night: {
    voice: SLEEP_VOICE,
    dir: "night",
    cta: "Fall asleep to Scripture tonight",
    ctaSub: "Bible stories and Psalms, read softly for sleep",
    path: "/?tab=sleep",
    source: "fb-bible4sleep",
    campaign: "night-stories",
    invite: "Follow for tomorrow night's story. 🌙",
    comment: "Fall asleep to the Bible stories, read softly with a sleep timer and gentle rain:",
    hashtags: "#BibleForSleep #BibleStories #sleep #faith #Lampstand",
    endNote: "Follow for tomorrow night's story",
    rain: true,
  },
} satisfies Record<string, Series>;

export type SeriesName = keyof typeof SERIES;

export type Clip = {
  id: string;
  /** Default: dailyhope. */
  series?: SeriesName;
  /** Episode pill, e.g. "Night 9 · Scripture for sleep". */
  badge?: string;
  hook: string;
  kicker: string;
  /** The narration, shown word for word as captions. */
  script: string;
  /** Paintings, shared out evenly across the clip. */
  images: string[];
  /** Facebook post caption. */
  caption: string;
};

const CLIPS: Clip[] = [
  {
    id: "psalm-4-breath",
    hook: "Mind racing at bedtime? Try the Psalm 4 breath",
    kicker: "Psalm 4:8 · for sleepless nights",
    script:
      "Lying awake with your mind racing? Try a prayer David wrote for the end of the day. It's the last line of Psalm 4. " +
      "“I will lie down and sleep in peace, for You alone, O LORD, make me dwell in safety.” " +
      "Here's how to pray it. Breathe in slowly: I will lie down. Breathe out: and sleep in peace. " +
      "Breathe in: You alone, O LORD. Breathe out: make me dwell in safety. " +
      "Then again, a little slower each time. You're not trying to force sleep. You're handing the night to the One who keeps watch over you.",
    images: ["/images/sleep/psalm-4/s1.jpg", "/images/sleep/psalm-63/s2.jpg", "/images/sleep/psalm-3/s1.jpg"],
    caption: "Can't switch off at night? Pray Psalm 4:8 with your breathing, slowly, line by line. 🌙",
  },
  {
    id: "jesus-slept-storm",
    hook: "Jesus slept through a storm. Here's why that matters at 2 a.m.",
    kicker: "Mark 4 · for sleepless nights",
    script:
      "In Mark chapter four, a violent windstorm hits the Sea of Galilee. The waves are breaking over the boat. " +
      "And Jesus? He's in the stern, sleeping on the cushion. " +
      "The disciples wake Him in a panic. “Teacher, don't You care that we are perishing?” " +
      "He gets up and speaks to the wind and the sea. “Silence!” He commanded. “Be still!” And the wind died down, and it was perfectly calm. " +
      "If your night feels like that boat, notice this. The One who calmed the sea wasn't anxious about it. He was asleep in it. " +
      "And He's in your boat tonight.",
    images: ["/images/story/jesus-calms-the-storm/storm.jpg", "/images/story/jesus-calms-the-storm/calm.jpg", "/images/sleep/psalm-4/s1.jpg"],
    caption: "The storm was real. So was His peace. Mark 4:37–39 🌊",
  },
  {
    id: "king-couldnt-sleep",
    hook: "The king couldn't sleep. God used it.",
    kicker: "Esther 6 · for sleepless nights",
    script:
      "Esther chapter six begins with a sleepless night. “That night sleep escaped the king.” " +
      "So King Xerxes ordered the Book of Records to be brought in and read to him. " +
      "And in it, they found a forgotten story. A man named Mordecai had once saved the king's life, and nothing had ever been done for him. " +
      "That one sleepless night turned the whole story around. " +
      "Your sleepless nights aren't wasted either. If you're awake right now, do what the king did. " +
      "Let something true be read to you, and trust that God is still at work while you rest.",
    images: ["/images/story/esther/sleepless.jpg", "/images/story/esther/court.jpg", "/images/story/esther/gate.jpg"],
    caption: "One sleepless night changed everything for Esther and her people. Esther 6:1 👑",
  },
  {
    id: "three-am-thoughts",
    hook: "What to do with 3 a.m. thoughts",
    kicker: "Psalm 63 · 1 Peter 5 · for sleepless nights",
    script:
      "It's three in the morning, and every worry you have is wide awake. David knew those hours. " +
      "“When I remember You on my bed, I think of You through the watches of the night.” " +
      "So try this. Name the loudest worry, quietly, in your head. Then hand it over with Peter's words. " +
      "“Cast all your anxiety on Him, because He cares for you.” Then the next worry, and the next. " +
      "And Paul tells us what comes after that kind of prayer. “The peace of God, which surpasses all understanding, will guard your hearts and your minds in Christ Jesus.” " +
      "The worries can wait until morning. You don't have to hold them tonight.",
    images: ["/images/sleep/psalm-63/s2.jpg", "/images/sleep/psalm-63/s1.jpg", "/images/sleep/psalm-4/s1.jpg"],
    caption: "Awake at 3 a.m.? Name each worry, then hand it over. 1 Peter 5:7 🙏",
  },
  {
    id: "earn-your-rest",
    hook: "You don't have to earn your rest",
    kicker: "Psalm 127 · Psalm 121 · for sleepless nights",
    script:
      "Psalm 127 has a line for everyone who lies in bed still working through tomorrow's list. " +
      "“In vain you rise early and stay up late, toiling for bread to eat—for He gives sleep to His beloved.” " +
      "Notice the last words. Sleep isn't a reward for finishing everything. It's a gift, given to the people God loves. " +
      "You can stop toiling now. The work will still be there in the morning, and so will He. " +
      "“Behold, the Protector of Israel will neither slumber nor sleep.” He's keeping watch, so you don't have to.",
    images: ["/images/sleep/psalm-127/s1.jpg", "/images/sleep/psalm-121/s1.jpg", "/images/sleep/psalm-3/s1.jpg"],
    caption: "Sleep isn't a reward for finishing everything. It's a gift. Psalm 127:2 ✨",
  },
  ...SLEEPWALK_CLIPS,
  ...NIGHT_CLIPS,
];

const seriesOf = (clip: Clip): Series => SERIES[clip.series ?? "dailyhope"];

/** What the voice reads: the script, with LORD spoken as a word (same length, so timings still line up). */
const spoken = (script: string) => script.replace(/\bLORD\b/g, "Lord");

function elevenKey(): string {
  // Read .env.local directly: a stale key in the Windows environment would otherwise win.
  const key = readFileSync(join(ROOT, ".env.local"), "utf8").match(/^ELEVENLABS_API_KEY=(.+)$/m)?.[1].trim();
  if (!key) throw new Error("ELEVENLABS_API_KEY is missing from .env.local");
  return key;
}

type Alignment = { characters: string[]; character_start_times_seconds: number[]; character_end_times_seconds: number[] };

/** Narration and its character timings, from the cache when the script hasn't changed. */
async function narrate(clip: Clip): Promise<{ mp3: string; alignment: Alignment }> {
  const text = spoken(clip.script);
  const { id: VOICE, settings: SETTINGS } = seriesOf(clip).voice;
  const hash = createHash("sha1").update(`${VOICE}|${MODEL}|${JSON.stringify(SETTINGS)}|${text}`).digest("hex").slice(0, 12);
  const raw = join(WORK, `${clip.id}-${hash}-raw.mp3`);
  const timing = join(WORK, `${clip.id}-${hash}.json`);
  if (!existsSync(raw) || !existsSync(timing)) {
    console.log(`  ${clip.id}: narrating (${text.length} characters)…`);
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}/with-timestamps?output_format=mp3_44100_128`, {
      method: "POST",
      headers: { "xi-api-key": elevenKey(), "Content-Type": "application/json" },
      body: JSON.stringify({ text, model_id: MODEL, voice_settings: SETTINGS }),
    });
    if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const body = (await res.json()) as { audio_base64: string; alignment: Alignment };
    writeFileSync(raw, Buffer.from(body.audio_base64, "base64"));
    writeFileSync(timing, JSON.stringify(body.alignment));
  }
  return { mp3: raw, alignment: JSON.parse(readFileSync(timing, "utf8")) };
}

/** Each word of the script with the time its first and last letters are spoken. */
export function wordsFrom(script: string, alignment: Alignment): AdWord[] {
  const chars = alignment.characters.join("");
  if (chars !== spoken(script)) throw new Error("ElevenLabs timings do not match the script");
  const words: AdWord[] = [];
  for (const m of script.matchAll(/\S+/g)) {
    const first = m.index!;
    const last = first + m[0].length - 1;
    words.push({ text: m[0], start: alignment.character_start_times_seconds[first], end: alignment.character_end_times_seconds[last] });
  }
  return words;
}

async function propsFor(clip: Clip): Promise<AdProps> {
  const { mp3, alignment } = await narrate(clip);
  const words = wordsFrom(clip.script, alignment);
  const audio = `${clip.id}.mp3`;
  // A short breath before the first word, the voice's finish, and a soft fade at the end.
  const lead = 0.4;
  const spokenFor = words[words.length - 1].end;
  const length = lead + spokenFor + 0.8;
  const s = seriesOf(clip);
  const voice = `adelay=${lead * 1000}:all=1,${s.voice.finish},apad,atrim=0:${length.toFixed(2)},afade=t=out:st=${(length - 0.6).toFixed(2)}:d=0.6`;
  if (s.rain) {
    // The app's rain (brown noise through a low-pass), quietly under the voice and on through the end card.
    const total = length + END_CARD;
    execFileSync("ffmpeg", [
      "-y", "-loglevel", "error", "-i", mp3,
      "-f", "lavfi", "-i", `anoisesrc=color=brown:amplitude=0.9:duration=${total.toFixed(2)}`,
      "-filter_complex",
      `[0:a]${voice},aformat=channel_layouts=stereo,apad,atrim=0:${total.toFixed(2)}[v];` +
        `[1:a]lowpass=f=1100,volume=0.07,aformat=channel_layouts=stereo,afade=t=in:d=1.2,afade=t=out:st=${(total - 1.5).toFixed(2)}:d=1.5[r];` +
        "[v][r]amix=inputs=2:normalize=0",
      "-ar", "44100", join(WORK, audio),
    ]);
  } else {
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", mp3, "-af", voice, join(WORK, audio)]);
  }
  const share = length / clip.images.length;
  const images = clip.images.map((src, i) => {
    const name = `${clip.id}-${i}-${basename(src)}`;
    copyFileSync(join(ROOT, "public", src), join(WORK, name));
    return { src: name, at: i * share };
  });
  return {
    hook: clip.hook,
    kicker: clip.kicker,
    audio,
    clip: length,
    words: words.map((w) => ({ ...w, start: w.start + lead, end: w.end + lead })),
    images,
    cta: s.cta,
    ctaSub: s.ctaSub,
    badge: clip.badge,
    endNote: s.endNote,
  };
}

function postText(clip: Clip): string {
  const s = seriesOf(clip);
  const link = `https://lampstandbible.com${s.path}&utm_source=${s.source}&utm_medium=organic&utm_campaign=${s.campaign}&utm_content=${clip.id}`;
  return [
    `Caption: ${clip.caption}`,
    "",
    s.invite,
    "",
    `No link at posting. Only if the reel passes 500 views, comment: ${s.comment} ${link}`,
    "",
    `Hashtags: ${s.hashtags}`,
  ].join("\n") + "\n";
}

async function main() {
  const args = process.argv.slice(2);
  const series: SeriesName = args[0] && args[0] in SERIES ? (args.shift() as SeriesName) : "dailyhope";
  const inSeries = CLIPS.filter((c) => (c.series ?? "dailyhope") === series);
  const clips = args.length ? inSeries.filter((c) => args.includes(c.id)) : inSeries;
  if (!clips.length) throw new Error(`No ${series} clip named ${args.join(", ")}. Clips: ${inSeries.map((c) => c.id).join(", ")}`);
  const dir = SERIES[series].dir;
  const out = join(OUT, dir);
  mkdirSync(WORK, { recursive: true });
  mkdirSync(join(out, "fb"), { recursive: true });
  copyFileSync(join(ROOT, "public", "icon-512.png"), join(WORK, "lampstand-icon.png"));

  const all: [Clip, AdProps][] = [];
  for (const clip of clips) all.push([clip, await propsFor(clip)]);

  const serveUrl = await bundle({ entryPoint: join(ROOT, "video", "src", "index.ts"), publicDir: WORK });
  for (const [clip, props] of all) {
    const composition = await selectComposition({ serveUrl, id: "AdReel", inputProps: props });
    await renderMedia({
      composition,
      serveUrl,
      codec: "h264",
      outputLocation: join(out, `${clip.id}.mp4`),
      inputProps: props,
      onProgress: ({ progress }) => process.stdout.write(`\r  ${clip.id}: ${Math.round(progress * 100)}%   `),
    });
    writeFileSync(join(out, `${clip.id}.txt`), postText(clip));
    // A copy that fits Facebook's 10 MB upload limit.
    execFileSync("ffmpeg", [
      "-y", "-loglevel", "error", "-i", join(out, `${clip.id}.mp4`),
      "-c:v", "libx264", "-crf", "25", "-maxrate", "1600k", "-bufsize", "3200k", "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart",
      join(out, "fb", `${clip.id}.mp4`),
    ]);
    const where = ["video/out/clips", dir, `${clip.id}.mp4`].filter(Boolean).join("/");
    console.log(`\r  ${clip.id}: ${where} (${(props.clip + END_CARD).toFixed(1)}s)`);
  }
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  });
}
