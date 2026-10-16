/**
 * Builds Sleep and Walk chapters from the BSB: paintings (Vertex AI), the chapter data
 * the app reads, and the narration with verse timings.
 *
 *   npx tsx scripts/sleep-chapter.ts "Genesis 2-10"            # everything missing
 *   npx tsx scripts/sleep-chapter.ts "Genesis 3" --only=images  # or --only=voice, --only=walk, --only=data
 *   npx tsx scripts/sleep-chapter.ts "Genesis 3" --redo         # regenerate even if files exist
 *
 * Writes public/images/sleep/<slug>/sN.jpg, public/sleep/<slug>/{chapter.mp3,timing.json}
 * (and uploads each new chapter.mp3 to the R2 bucket),
 * lib/sleep/chapters/<slug>.json and the catalogue lib/sleep/chapters/index.ts.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { getChapter, BSB_NAME } from "../lib/bible/bsb";
import { generateVertexImage } from "../lib/ai/vertex-imagen";
import { GENESIS_PLANS, NIGHT_STYLE, type SleepChapterPlan } from "../content/sleep/genesis";
import type { SleepChapter } from "../lib/sleep/types";
import { SLEEP_GENESIS_1 } from "../lib/sleep/genesis-1";
import { takePath, transcriptPath, voiceChapter, type VoiceVerse } from "./lib/sleep-voice";
import { r2Env, uploadToR2 } from "./upload-audio-r2";

// GCP_PROJECT_ID and friends for Vertex.
if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const m = line.match(/^(GCP_PROJECT_ID|VERTEX_LOCATION|VERTEX_MODEL)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}

const PLANS: Record<string, SleepChapterPlan[]> = { Genesis: GENESIS_PLANS };
const only = process.argv.find((a) => a.startsWith("--only="))?.split("=")[1];
const redo = process.argv.includes("--redo");
const step = (name: string) => !only || only === name;

function chaptersFrom(ref: string): { book: string; chapter: number }[] {
  const m = ref.match(/^(.+?) (\d+)(?:-(\d+))?$/);
  if (!m) throw new Error(`Use a book and chapter or range, e.g. "Genesis 2-10" (got "${ref}")`);
  const from = Number(m[2]);
  const to = m[3] ? Number(m[3]) : from;
  return Array.from({ length: to - from + 1 }, (_, i) => ({ book: m[1], chapter: from + i }));
}

const slugOf = (book: string, chapter: number) => `${book.toLowerCase().replace(/\s+/g, "-")}-${chapter}`;

/** Vertex allows only a few images a minute: on "429 Too Many Requests", wait and try again. */
async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fn();
    } catch (e) {
      const limited = e instanceof Error && /\b429\b|RESOURCE_EXHAUSTED/.test(e.message);
      if (!limited || attempt >= 8) throw e;
      const wait = Math.min(120, 15 * attempt);
      process.stdout.write(`\r  rate limited; waiting ${wait}s   `);
      await new Promise((r) => setTimeout(r, wait * 1000));
    }
  }
}

async function paint(plan: SleepChapterPlan, slug: string, label: string) {
  const dir = join("public", "images", "sleep", slug);
  mkdirSync(dir, { recursive: true });
  for (const [i, scene] of plan.scenes.entries()) {
    const file = join(dir, `s${i + 1}.jpg`);
    if (existsSync(file) && !redo) continue;
    process.stdout.write(`\r  ${label} painting ${i + 1}/${plan.scenes.length}   `);
    const [img] = await withRetry(() =>
      generateVertexImage({ prompt: `${scene.prompt} ${NIGHT_STYLE}`, aspectRatio: "9:16", stylePreset: "none" }),
    );
    const raw = join(dir, `s${i + 1}.raw`);
    writeFileSync(raw, img.buffer);
    // Phone-sized and light: 768 wide, good-quality JPEG.
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", raw, "-vf", "scale=768:-2", "-q:v", "4", file]);
    rmSync(raw);
  }
}

function buildData(plan: SleepChapterPlan, book: string, chapter: number, slug: string): SleepChapter {
  const verses = getChapter(book, chapter);
  for (const from of [...Object.keys(plan.headings).map(Number), ...plan.scenes.map((s) => s.from)]) {
    if (from < 1 || from > verses.length) throw new Error(`${book} ${chapter} has no verse ${from}`);
  }
  const imageFor = (n: number) => {
    let k = 0;
    plan.scenes.forEach((s, i) => n >= s.from && (k = i));
    return `/images/sleep/${slug}/s${k + 1}.jpg`;
  };
  return {
    slug,
    book,
    chapter,
    title: plan.title,
    translation: BSB_NAME,
    audioSrc: `/sleep/${slug}/chapter.mp3`,
    timingSrc: `/sleep/${slug}/timing.json`,
    verses: verses.map((v) => ({ n: v.n, text: v.text, heading: plan.headings[v.n], image: imageFor(v.n) })),
  };
}

/**
 * The catalogue the app imports: Genesis 1 (hand-made) plus every generated
 * chapter that has narration, in Bible order, and each chapter's length.
 */
function writeIndex() {
  const dir = join("lib", "sleep", "chapters");
  const seconds = (slug: string, mode: "sleep" | "walk" = "sleep") => {
    const t = join("public", mode, slug, "timing.json");
    return existsSync(t) ? Math.round(JSON.parse(readFileSync(t, "utf8")).duration) : 0;
  };
  const files = readdirSync(dir)
    .filter((f) => f.endsWith(".json") && seconds(f.replace(/\.json$/, "")) > 0)
    .sort((a, b) => Number(a.match(/(\d+)\.json$/)![1]) - Number(b.match(/(\d+)\.json$/)![1]));
  const name = (f: string) => f.replace(/\.json$/, "").replace(/-(\w)/g, (_, c) => c.toUpperCase());
  const slugs = ["genesis-1", ...files.map((f) => f.replace(/\.json$/, ""))];
  const lines = [
    "// Generated by scripts/sleep-chapter.ts. Do not edit by hand.",
    'import type { SleepChapter } from "../types";',
    'import { SLEEP_GENESIS_1 } from "../genesis-1";',
    ...files.map((f) => `import ${name(f)} from "./${f}";`),
    "",
    "/** Every Sleep chapter with narration, in reading order. */",
    "export const SLEEP_CHAPTERS: SleepChapter[] = [",
    "  SLEEP_GENESIS_1,",
    ...files.map((f) => `  ${name(f)} as SleepChapter,`),
    "];",
    "",
    "/** Length of each chapter's narration in seconds, by slug. */",
    "export const SLEEP_SECONDS: Record<string, number> = {",
    ...slugs.map((slug) => `  "${slug}": ${seconds(slug)},`),
    "};",
    "",
    "/** Length of each chapter's brisk Walk reading in seconds, by slug (0 = not voiced yet). */",
    "export const WALK_SECONDS: Record<string, number> = {",
    ...slugs.map((slug) => `  "${slug}": ${seconds(slug, "walk")},`),
    "};",
    "",
  ];
  writeFileSync(join(dir, "index.ts"), lines.join("\n"));
}

/** ", 1 phrase skipped" and the like, for the one-line summary. */
function coverageNote(issues: { kind: string }[]): string {
  const skipped = issues.filter((x) => x.kind === "skipped").length;
  const extra = issues.filter((x) => x.kind === "extra").length;
  return `${skipped ? `, ${skipped} skipped` : ""}${extra ? `, ${extra} repeated` : ""}`;
}

const problems: string[] = [];

/**
 * Voices one reading and checks it word for word; when words were skipped or added, voices it
 * again (up to twice). Walk retries in shorter passages, which stops Gemini losing its place in
 * repetitive text. Returns the note for the summary line.
 */
async function voiceClean(verses: VoiceVerse[], mode: "sleep" | "walk", slug: string, label: string): Promise<string> {
  const tries: (number | undefined)[] = mode === "walk" ? [undefined, 1200, 600] : [undefined, undefined, undefined];
  let result!: Awaited<ReturnType<typeof voiceChapter>>;
  let attempt = 0;
  for (const maxPassage of tries) {
    attempt++;
    result = await voiceChapter(verses, join("public", mode, slug), {
      mode,
      label,
      transcriptFile: transcriptPath(mode, slug),
      takeFile: takePath(mode, slug),
      maxPassage,
    });
    const bad = result.issues.filter((x) => x.kind !== "unheard");
    if (!bad.length || attempt === tries.length) break;
    console.log(`  ${label} ${mode}: ${bad.length} word problem${bad.length > 1 ? "s" : ""}, voicing again   `);
  }
  const name = mode === "walk" ? "Walk" : "Sleep";
  problems.push(...result.issues.filter((x) => x.kind !== "unheard").map((x) => `  ${label} ${name} v${x.verse} @${x.at}s ${x.kind}: "${x.words}"`));
  const retried = attempt > 1 ? `, ${attempt} takes` : "";
  return `${mode} ${Math.round(result.duration)}s, ${result.missed} estimated${retried}${coverageNote(result.issues)}`;
}

async function main() {
  const ref = process.argv[2];
  if (!ref || ref.startsWith("--")) throw new Error('Usage: npx tsx scripts/sleep-chapter.ts "Genesis 2-10"');
  mkdirSync(join("lib", "sleep", "chapters"), { recursive: true });
  // New recordings go straight to the R2 bucket the app streams from (when configured).
  const r2 = r2Env();
  if (!r2) console.log("  (R2 not configured: recordings stay in public/ only)");

  for (const { book, chapter } of chaptersFrom(ref)) {
    const slug = slugOf(book, chapter);
    const label = `${book} ${chapter}`;
    const plan = PLANS[book]?.find((p) => p.chapter === chapter);
    // Genesis 1 is hand-made (lib/sleep/genesis-1.ts) and has no plan; it can still get a Walk reading.
    const data = plan ? buildData(plan, book, chapter, slug) : slug === "genesis-1" ? SLEEP_GENESIS_1 : null;
    if (!data) throw new Error(`No plan for ${book} ${chapter} in content/sleep/`);

    if (plan && step("images")) await paint(plan, slug, label);
    if (plan && (step("data") || step("images") || step("voice"))) {
      writeFileSync(join("lib", "sleep", "chapters", `${slug}.json`), JSON.stringify(data, null, 2) + "\n");
    }
    const notes: string[] = [];
    if (plan && step("voice") && (redo || !existsSync(join("public", "sleep", slug, "chapter.mp3")))) {
      notes.push(await voiceClean(data.verses, "sleep", slug, label));
      if (r2 && (await uploadToR2(r2, join("public", "sleep", slug, "chapter.mp3"), true))) notes.push("sleep on R2");
    }
    if (step("walk") && (redo || !existsSync(join("public", "walk", slug, "chapter.mp3")))) {
      notes.push(await voiceClean(data.verses, "walk", slug, label));
      if (r2 && (await uploadToR2(r2, join("public", "walk", slug, "chapter.mp3"), true))) notes.push("walk on R2");
    }
    console.log(`\r  ${label}: ${data.verses.length} verses${notes.length ? `, ${notes.join("; ")}` : ", nothing new"}`);
  }
  writeIndex();
  if (problems.length) {
    console.log(`\nWords skipped or added by the narrator (re-voice these with --only=voice or --only=walk and --redo):\n${problems.join("\n")}`);
  }
}

main().catch((e) => {
  console.error(`\n${e instanceof Error ? e.message : e}`);
  process.exit(1);
});
