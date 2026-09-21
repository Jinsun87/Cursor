#!/usr/bin/env tsx
/**
 * Vertex AI (Gemini Image) Story Artwork Pipeline
 *
 * Generates 24 vertical (9:16) story slides for the Illuminated Story Reader.
 * Chapters:
 *  - genesis-1 (s1..s4)
 *  - genesis-12 (s1..s4)
 *  - exodus-3 (s1..s4)
 *  - psalms-23 (s1..s4)
 *  - matthew-5 (s1..s4)
 *  - john-1 (s1..s4)
 *
 * Usage:
 *   npx tsx scripts/generate-story-images.ts [options]
 *
 * Options:
 *   --dry-run           Preview prompts and output paths without calling Vertex AI
 *   --chapter <slug>    Generate images for a specific chapter (e.g. genesis-1)
 *   --all               Generate images for all 6 chapters (24 images)
 *   --overwrite         Regenerate and overwrite existing images
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleAuth } from "google-auth-library";
import { getVertexEndpoint, STYLE_PRESETS } from "../lib/ai/vertex-imagen";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, "..");
const PUBLIC_STORIES_DIR = path.join(ROOT_DIR, "public/images/stories");

// Load .env.local and .env
function loadEnv() {
  for (const envFile of [".env.local", ".env"]) {
    const fullPath = path.join(ROOT_DIR, envFile);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx > 0) {
          const key = trimmed.slice(0, eqIdx).trim();
          const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  }
}
loadEnv();

export interface StorySlideInstruction {
  slideId: string;
  filename: string;
  title: string;
  prompt: string;
  negativePrompt?: string;
}

export interface ChapterStoryManifest {
  chapterSlug: string;
  bookTitle: string;
  chapterNumber: number;
  slides: StorySlideInstruction[];
}

export const STORY_MANIFEST: ChapterStoryManifest[] = [
  {
    chapterSlug: "genesis-1",
    bookTitle: "Genesis",
    chapterNumber: 1,
    slides: [
      {
        slideId: "gen1-s1",
        filename: "s1.png",
        title: "The Birth of the Cosmos",
        prompt:
          "Vertical 9:16 composition. The Spirit of God hovering over the primordial dark cosmic deep waters. Mysterious, ethereal golden divine light beginning to radiate and pierce the churning chaotic ocean of the early universe. Cosmic nebulae dust, solemn reverence, dramatic chiaroscuro oil painting in the style of Rembrandt and William Blake.",
      },
      {
        slideId: "gen1-s2",
        filename: "s2.png",
        title: "Let There Be Light",
        prompt:
          "Vertical 9:16 composition. 'Let there be light': A glorious, blinding burst of warm golden divine light shattering deep cosmic darkness and celestial void. Beams of luminous golden particles radiating across the black sky, separating day from night. Epic sacred classical fine art painting.",
      },
      {
        slideId: "gen1-s3",
        filename: "s3.png",
        title: "Creation of Humanity (Imago Dei)",
        prompt:
          "Vertical 9:16 composition. Adam and Eve standing in awe in a lush, verdant Garden of Eden illuminated by ethereal vertical shafts of sunlight through ancient canopy trees. Dignified, sacred, clothed in modesty and light, reflecting the divine image, fine art museum quality painting.",
      },
      {
        slideId: "gen1-s4",
        filename: "s4.png",
        title: "The Finished Creation (Very Good)",
        prompt:
          "Vertical 9:16 composition. The majestic harmony of the newly formed earth under a pristine starry cosmos. Crystal-clear waters reflecting glowing celestial bodies, blooming ancient flora, a tranquil paradise basking in divine approval. Dramatic romantic oil landscape in the style of Albert Bierstadt.",
      },
    ],
  },
  {
    chapterSlug: "genesis-12",
    bookTitle: "Genesis",
    chapterNumber: 12,
    slides: [
      {
        slideId: "gen12-s1",
        filename: "s1.png",
        title: "The Leap of Faith",
        prompt:
          "Vertical 9:16 composition. An ancient bearded Hebrew patriarch, Abram, standing alone outside his desert tent at night, looking up in quiet wonder at a breathtaking, infinite canopy of glittering stars in the Arabian night sky. Golden lantern at his feet, deep Caravaggio chiaroscuro, solemn faith.",
      },
      {
        slideId: "gen12-s2",
        filename: "s2.png",
        title: "The Call to Journey",
        prompt:
          "Vertical 9:16 composition. An ancient patriarchal desert caravan with pack camels, sheep, and nomadic travelers journeying into the golden expanse of the Canaan wilderness at dawn. Long cast shadows across sand dunes, warm amber sunrise, epic biblical journey painting.",
      },
      {
        slideId: "gen12-s3",
        filename: "s3.png",
        title: "The Covenant Blessing",
        prompt:
          "Vertical 9:16 composition. Abram with hands outstretched in humble thanksgiving toward a radiant, glowing heavenly sky. Golden divine light pouring through parting clouds, symbolizing generational blessing for all nations, classical Renaissance oil masterpiece.",
      },
      {
        slideId: "gen12-s4",
        filename: "s4.png",
        title: "The Nomad's Altar",
        prompt:
          "Vertical 9:16 composition. A rugged altar of unhewn desert stones built upon a hill between Bethel and Ai in ancient Canaan. Gentle white smoke of sacrifice ascending straight into the twilight sky. Lone kneeling nomad in deep devotion, classical biblical landscape.",
      },
    ],
  },
  {
    chapterSlug: "exodus-3",
    bookTitle: "Exodus",
    chapterNumber: 3,
    slides: [
      {
        slideId: "ex3-s1",
        filename: "s1.png",
        title: "The Unconsumed Flame",
        prompt:
          "Vertical 9:16 composition. A desert thornbush blazing furiously with brilliant golden, amber, and white supernatural fire on a rugged slope of Mount Horeb. The green leaves and thorny branches remain completely unburnt within the roaring flame. Dramatic twilight atmosphere, glowing embers.",
      },
      {
        slideId: "ex3-s2",
        filename: "s2.png",
        title: "Holy Ground",
        prompt:
          "Vertical 9:16 composition. Moses as an 80-year-old shepherd kneeling on rocky desert ground, taking off his leather sandals with trembling hands. His face is shielded from the blinding holy light of the burning bush before him. Intense chiaroscuro, deep reverence, museum oil painting.",
      },
      {
        slideId: "ex3-s3",
        filename: "s3.png",
        title: "I AM WHO I AM",
        prompt:
          "Vertical 9:16 composition. The awe-inspiring divine manifestation of God at Mount Horeb. Ethereal cloud of glory and blinding divine light hovering over the desert peak, radiating sacred authority and eternal presence, classical masterwork.",
      },
      {
        slideId: "ex3-s4",
        filename: "s4.png",
        title: "The Cry of the Oppressed",
        prompt:
          "Vertical 9:16 composition. In the distance beneath towering Egyptian stone monuments, enslaved Hebrew people lifting weary hands in prayer. Overhead, dramatic rays of golden divine light break through storm clouds, answering their affliction. Biblical historical epic.",
      },
    ],
  },
  {
    chapterSlug: "psalms-23",
    bookTitle: "Psalms",
    chapterNumber: 23,
    slides: [
      {
        slideId: "ps23-s1",
        filename: "s1.png",
        title: "I Shall Not Want",
        prompt:
          "Vertical 9:16 composition. Young David the shepherd boy sitting on an emerald Judean hillside playing a wooden harp. A peaceful flock of white sheep resting beside him under a golden morning sky with dew on the grass. Peaceful, serene, classical masterpiece.",
      },
      {
        slideId: "ps23-s2",
        filename: "s2.png",
        title: "Green Pastures & Quiet Waters",
        prompt:
          "Vertical 9:16 composition. A crystal-clear, glassy stream meandering through lush, rolling green pastures in an ancient fertile valley. Sheep drinking peacefully from the quiet still waters under soft morning sunlight, landscape painting in the style of John Constable.",
      },
      {
        slideId: "ps23-s3",
        filename: "s3.png",
        title: "Valley of the Shadow of Death",
        prompt:
          "Vertical 9:16 composition. A faithful shepherd carrying a wooden staff and a glowing warm oil lantern, guiding a flock of sheep through a deep, misty, towering rocky gorge. The radiant lantern light dispels the ominous shadows along the narrow path. Dramatic Rembrandt lighting.",
      },
      {
        slideId: "ps23-s4",
        filename: "s4.png",
        title: "Anointed Head & Overflowing Cup",
        prompt:
          "Vertical 9:16 composition. An ornate golden chalice overflowing with rich red wine and olive oil resting on a rustic stone banquet table set in the wilderness. Grapes, figs, and olive branches surround the cup under heavenly shafts of divine light, opulent classical still life.",
      },
    ],
  },
  {
    chapterSlug: "matthew-5",
    bookTitle: "Matthew",
    chapterNumber: 5,
    slides: [
      {
        slideId: "mat5-s1",
        filename: "s1.png",
        title: "The Sermon on the Mount",
        prompt:
          "Vertical 9:16 composition. Jesus in simple flowing white and blue robes seated on a grassy hillside overlooking the blue waters of the Sea of Galilee. A diverse crowd of humble disciples and common folk sitting attentively around Him, morning sunlight warming the landscape.",
      },
      {
        slideId: "mat5-s2",
        filename: "s2.png",
        title: "The Beatitudes (Blessed Are the Meek)",
        prompt:
          "Vertical 9:16 composition. Heavenly golden light descending gently upon humble, weary, and mourning people, anointing them with comfort, peace, and divine grace. Classical Renaissance oil painting in the style of Raphael.",
      },
      {
        slideId: "mat5-s3",
        filename: "s3.png",
        title: "City on a Hill",
        prompt:
          "Vertical 9:16 composition. An ancient fortified stone city perched high atop a rugged mountain crest at twilight. Golden candlelight and oil lamps glow from every window, casting a warm beacon across the darkening valley below. A city that cannot be hidden, dramatic atmosphere.",
      },
      {
        slideId: "mat5-s4",
        filename: "s4.png",
        title: "The Lamp upon the Lampstand",
        prompt:
          "Vertical 9:16 composition. An ancient terracotta oil lamp burning with a luminous, steady golden flame, set atop an elevated bronze and olive wood lampstand. The warm light fills every corner of a rustic stone dwelling, casting out shadows. Caravaggio chiaroscuro.",
      },
    ],
  },
  {
    chapterSlug: "john-1",
    bookTitle: "John",
    chapterNumber: 1,
    slides: [
      {
        slideId: "jn1-s1",
        filename: "s1.png",
        title: "The Uncreated Word (Logos)",
        prompt:
          "Vertical 9:16 composition. The cosmic Logos: A radiant, divine figure of light emanating at the foundation of eternity before creation. Deep sapphire, indigo, and molten gold nebulas swirling around the eternal Word. Majestic, transcendent, sacred fine art.",
      },
      {
        slideId: "jn1-s2",
        filename: "s2.png",
        title: "The Light Shines in the Darkness",
        prompt:
          "Vertical 9:16 composition. A single, triumphant pillar of pure golden divine light piercing straight through deep obsidian cosmic darkness. The surrounding darkness swirls yet cannot comprehend or extinguish the brilliant flame. High contrast masterpiece.",
      },
      {
        slideId: "jn1-s3",
        filename: "s3.png",
        title: "The Word Made Flesh",
        prompt:
          "Vertical 9:16 composition. The holy incarnation: Mary and Joseph in quiet awe over the newborn Christ in a rustic stone manger in Bethlehem. The infant glows with an inner celestial golden light that illuminates the humble stable. Intimate, sacred, masterwork by Georges de La Tour.",
      },
      {
        slideId: "jn1-s4",
        filename: "s4.png",
        title: "Grace Upon Grace",
        prompt:
          "Vertical 9:16 composition. An overflowing celestial fountain of living crystal water and radiant heavenly light pouring down ancient stone terraces, surrounded by olive branches and white lilies. Representing boundless divine mercy and truth, classical spiritual allegory.",
      },
    ],
  },
];

// CLI arguments
const args = process.argv.slice(2);
function getArg(flag: string, defaultValue: string | null = null): string | null {
  const idx = args.indexOf(flag);
  if (idx !== -1 && args[idx + 1] && !args[idx + 1].startsWith("--")) {
    return args[idx + 1];
  }
  return defaultValue;
}

const isDryRun = args.includes("--dry-run");
const isOverwrite = args.includes("--overwrite");
const targetChapter = getArg("--chapter");

const projectId = process.env.GCP_PROJECT_ID || "nascar-auto";
const location = process.env.VERTEX_LOCATION || process.env.GCP_REGION || "global";
const model = process.env.VERTEX_MODEL || "gemini-3.1-flash-image";

console.log("=========================================================");
console.log("📖 Lampstand Story Artwork Pipeline (Option A: 24 Images)");
console.log("=========================================================");
console.log(`GCP Project : ${projectId}`);
console.log(`Location    : ${location}`);
console.log(`Model       : ${model}`);
console.log(`Aspect Ratio: 9:16 (Vertical Story Card Format)`);
console.log(`Mode        : ${isDryRun ? "DRY RUN (preview only)" : "LIVE GENERATION"}`);
console.log(`Overwrite   : ${isOverwrite}`);
if (targetChapter) console.log(`Target      : Chapter ${targetChapter}`);
console.log("=========================================================\n");

async function callVertexImagen(prompt: string, negativePrompt = ""): Promise<Buffer> {
  const auth = new GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });
  const client = await auth.getClient();
  const token = (await client.getAccessToken()).token;

  if (!token) {
    throw new Error("Could not acquire GCP access token. Run: gcloud auth application-default login");
  }

  const endpoint = getVertexEndpoint(projectId, location, model);
  const styleDescription = STYLE_PRESETS["biblical-classical"];
  const fullPromptText = `${prompt}. Style: ${styleDescription}. Desired aspect ratio: 9:16. Avoid: modern clothing, technology, watermarks, text, blurry, distorted anatomy, cartoonish, low quality, ${negativePrompt}.`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: fullPromptText }],
      },
    ],
    generationConfig: {
      responseModalities: ["IMAGE"],
    },
  };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Vertex AI error (${res.status} ${res.statusText}): ${err}`);
  }

  const data = (await res.json()) as any;
  const parts = data?.candidates?.[0]?.content?.parts || [];
  const imgPart = parts.find((p: any) => p.inlineData?.data);
  if (!imgPart?.inlineData?.data) {
    throw new Error("No image data returned from Gemini Image model.");
  }
  return Buffer.from(imgPart.inlineData.data, "base64");
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function callVertexWithRetry(prompt: string, negativePrompt = "", retries = 5): Promise<Buffer> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await callVertexImagen(prompt, negativePrompt);
    } catch (err: any) {
      const is429 = err.message.includes("429") || err.message.includes("RESOURCE_EXHAUSTED");
      if (is429 && attempt < retries) {
        const waitSec = attempt * 15;
        console.log(`    ⏳ Rate limit (429). Waiting ${waitSec}s for quota window to reset (attempt ${attempt}/${retries})...`);
        await sleep(waitSec * 1000);
      } else {
        throw err;
      }
    }
  }
  throw new Error("Failed after retries.");
}

async function main() {
  const chaptersToProcess = targetChapter
    ? STORY_MANIFEST.filter((c) => c.chapterSlug === targetChapter)
    : STORY_MANIFEST;

  if (chaptersToProcess.length === 0) {
    console.error(`❌ Chapter '${targetChapter}' not found in manifest.`);
    console.error(`Available chapters: ${STORY_MANIFEST.map((c) => c.chapterSlug).join(", ")}`);
    process.exit(1);
  }

  let totalGenerated = 0;
  let totalSkipped = 0;

  for (const chapter of chaptersToProcess) {
    const chapterDir = path.join(PUBLIC_STORIES_DIR, chapter.chapterSlug);
    if (!fs.existsSync(chapterDir)) {
      fs.mkdirSync(chapterDir, { recursive: true });
    }

    console.log(`\n======================================================`);
    console.log(`📜 Chapter: ${chapter.bookTitle} ${chapter.chapterNumber} [${chapter.chapterSlug}]`);
    console.log(`📁 Directory: ${chapterDir}`);
    console.log(`======================================================`);

    for (const slide of chapter.slides) {
      const destPathJpg = path.join(chapterDir, slide.filename.replace(/\.png$/, ".jpg"));
      const exists = fs.existsSync(destPathJpg) || fs.existsSync(path.join(chapterDir, slide.filename));

      console.log(`\n  ▶ Slide [${slide.slideId}] -> ${path.basename(destPathJpg)}`);
      console.log(`    Title       : ${slide.title}`);
      console.log(`    Exists      : ${exists ? "Yes" : "No"}`);
      console.log(`    Prompt      : "${slide.prompt.slice(0, 100)}..."`);

      if (exists && !isOverwrite) {
        console.log(`    ⏭️  Skipping existing file (pass --overwrite to recreate).`);
        totalSkipped++;
        continue;
      }

      if (isDryRun) {
        console.log(`    🔍 [DRY RUN] Would write to: ${destPathJpg}`);
        continue;
      }

      console.log(`    🎨 Generating via Vertex AI (gemini-3.1-flash-image)...`);
      const startMs = Date.now();
      try {
        const buffer = await callVertexWithRetry(slide.prompt, slide.negativePrompt || "");
        fs.writeFileSync(destPathJpg, buffer);
        const durationSec = ((Date.now() - startMs) / 1000).toFixed(1);
        const sizeKb = Math.round(buffer.length / 1024);
        console.log(`    ✅ Saved ${path.basename(destPathJpg)} (${sizeKb} KB) in ${durationSec}s`);
        totalGenerated++;

        // Brief delay between generation requests to prevent hitting concurrency burst limits
        await sleep(2000);
      } catch (err: any) {
        console.error(`    ❌ Failed generating ${slide.filename}:`, err.message);
      }
    }
  }

  console.log("\n=======================================================");
  console.log("🏁 Pipeline Complete!");
  console.log(`   Generated: ${totalGenerated}`);
  console.log(`   Skipped  : ${totalSkipped}`);
  console.log("=======================================================\n");
}

main().catch((err) => {
  console.error("Pipeline fatal error:", err);
  process.exit(1);
});
