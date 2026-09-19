#!/usr/bin/env tsx
/**
 * Vertex AI (Imagen 3) Quiz Artwork Batch Pipeline
 * 
 * Generates custom, stylistically consistent artwork for quiz questions using
 * the centralized instructions manifest in lib/quizzes/image-instructions.ts.
 * 
 * Usage:
 *   npx tsx scripts/generate-quiz-images.ts [options]
 * 
 * Options:
 *   --list              List all quizzes configured with image instructions
 *   --quiz <slug>       Target a specific quiz (default: look-at-the-picture-bible)
 *   --all               Process all quizzes configured in the manifest
 *   --question <number> Target a specific question (1-based index)
 *   --overwrite         Overwrite existing images
 *   --dry-run           Preview prompts, composition, lighting, and paths without calling Vertex AI
 *   --help, -h          Show help message
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleAuth } from "google-auth-library";
import {
  QUIZ_IMAGE_INSTRUCTIONS,
  listConfiguredQuizzes,
  getQuizImageEntry,
  resolveImagePrompt,
} from "../lib/quizzes/image-instructions";
import { getVertexEndpoint } from "../lib/ai/vertex-imagen";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, "..");
const PUBLIC_QUIZ_DIR = path.join(ROOT_DIR, "public/images/quizzes");

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

// Parse CLI flags
const args = process.argv.slice(2);
function getArg(flag: string, defaultValue: string | null = null): string | null {
  const idx = args.indexOf(flag);
  if (idx !== -1 && args[idx + 1] && !args[idx + 1].startsWith("--")) {
    return args[idx + 1];
  }
  return defaultValue;
}

const isHelp = args.includes("--help") || args.includes("-h");
const isList = args.includes("--list");
const isAll = args.includes("--all");
const isDryRun = args.includes("--dry-run");
const isOverwrite = args.includes("--overwrite");
const targetQuiz = getArg("--quiz", "look-at-the-picture-bible")!;
const targetQuestion = getArg("--question") ? parseInt(getArg("--question")!, 10) : null;

if (isHelp) {
  console.log(`
🎨 Lampstand Vertex AI (Imagen 3) Quiz Image Pipeline

Usage:
  npm run generate:images -- [options]

Options:
  --list              List all quizzes configured with image instructions
  --quiz <slug>       Target a specific quiz (default: look-at-the-picture-bible)
  --all               Generate images for ALL configured quizzes
  --question <num>    Generate only a specific question number (e.g. 3)
  --overwrite         Regenerate and overwrite existing image files
  --dry-run           Preview prompts and output paths without calling Vertex AI
  --help, -h          Show this help message
`);
  process.exit(0);
}

if (isList) {
  console.log("\n=========================================================");
  console.log("📋 Configured Quiz Image Instructions");
  console.log("=========================================================");
  for (const slug of listConfiguredQuizzes()) {
    const entry = getQuizImageEntry(slug)!;
    console.log(`\n• Quiz Slug   : ${entry.quizSlug}`);
    console.log(`  Category    : ${entry.category}`);
    console.log(`  Questions   : ${entry.questions.length} configured`);
    console.log(`  Aspect Ratio: ${entry.imageConfig?.aspectRatio || "16:9"}`);
    console.log(`  Output Path : public/images/quizzes/${slug}/q<index>.png`);
  }
  console.log("\n=========================================================\n");
  process.exit(0);
}

const projectId = process.env.GCP_PROJECT_ID || "nascar-auto";
const location = process.env.VERTEX_LOCATION || process.env.GCP_REGION || "global";

const model = process.env.VERTEX_MODEL || "gemini-3.1-flash-image";

console.log("=========================================================");
console.log("🎨 Lampstand Vertex AI (Gemini Image) Quiz Pipeline");
console.log("=========================================================");
console.log(`GCP Project : ${projectId}`);
console.log(`Location    : ${location}`);
console.log(`Model       : ${model}`);
console.log(`Mode        : ${isDryRun ? "DRY RUN (preview only)" : "LIVE GENERATION"}`);
console.log(`Overwrite   : ${isOverwrite}`);
console.log("=========================================================\n");

async function callVertexImagen(prompt: string, negativePrompt: string, aspectRatio: string): Promise<Buffer> {
  const auth = new GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });
  const client = await auth.getClient();
  const token = (await client.getAccessToken()).token;

  if (!token) {
    throw new Error("Could not acquire GCP access token. Run: gcloud auth application-default login");
  }

  const endpoint = getVertexEndpoint(projectId, location, model);
  const fullPromptText = `${prompt}. Desired aspect ratio: ${aspectRatio}. Avoid: ${negativePrompt}.`;

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

async function callVertexWithRetry(prompt: string, negativePrompt: string, aspectRatio: string, retries = 4): Promise<Buffer> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await callVertexImagen(prompt, negativePrompt, aspectRatio);
    } catch (err: any) {
      const is429 = err.message.includes("429") || err.message.includes("RESOURCE_EXHAUSTED");
      if (is429 && attempt < retries) {
        const waitSec = attempt * 15;
        console.log(`    ⏳ Rate limit reached. Waiting ${waitSec}s for quota window to reset (attempt ${attempt}/${retries})...`);
        await sleep(waitSec * 1000);
      } else {
        throw err;
      }
    }
  }
  throw new Error("Failed after retries.");
}

async function processQuiz(quizSlug: string) {
  const entry = getQuizImageEntry(quizSlug);
  if (!entry) {
    console.error(`❌ No image instructions found for quiz "${quizSlug}".`);
    console.error(`Available quizzes: ${listConfiguredQuizzes().join(", ")}`);
    return;
  }

  const quizDir = path.join(PUBLIC_QUIZ_DIR, quizSlug);
  if (!fs.existsSync(quizDir)) {
    fs.mkdirSync(quizDir, { recursive: true });
  }

  console.log(`\n▶ Processing Quiz: [${quizSlug}] (Category: ${entry.category})`);
  console.log(`  Target Folder: ${quizDir}`);

  const questions = targetQuestion
    ? entry.questions.filter((q) => q.qIndex === targetQuestion)
    : entry.questions;

  if (questions.length === 0) {
    console.log(`  No questions matching criteria.`);
    return;
  }

  for (const q of questions) {
    const filename = `q${q.qIndex}.png`;
    const destPath = path.join(quizDir, filename);
    const exists = fs.existsSync(destPath);
    const resolved = resolveImagePrompt(quizSlug, q.qIndex);

    if (!resolved) {
      console.warn(`  [Q${q.qIndex}] Warning: Unable to resolve prompt.`);
      continue;
    }

    console.log(`\n  [Q${q.qIndex}] -> ${filename}`);
    console.log(`    File exists     : ${exists ? "Yes" : "No"}`);
    console.log(`    Aspect Ratio    : ${resolved.aspectRatio}`);
    console.log(`    Subject Prompt  : "${q.instruction.subject.slice(0, 90)}..."`);
    if (q.instruction.composition) {
      console.log(`    Composition     : ${q.instruction.composition}`);
    }
    if (q.instruction.lighting) {
      console.log(`    Lighting        : ${q.instruction.lighting}`);
    }

    if (exists && !isOverwrite) {
      console.log(`    ⏭️  Skipping (file exists). Pass --overwrite to regenerate.`);
      continue;
    }

    if (isDryRun) {
      console.log(`    🔍 [DRY RUN] Output Path: ${destPath}`);
      console.log(`    🔍 [DRY RUN] Full Composed Prompt: ${resolved.fullPrompt}`);
      console.log(`    🔍 [DRY RUN] Negative Prompt: ${resolved.negativePrompt}`);
      continue;
    }

    try {
      console.log(`    🚀 Calling Vertex AI (gemini-3.1-flash-image)...`);
      const buffer = await callVertexWithRetry(resolved.fullPrompt, resolved.negativePrompt, resolved.aspectRatio);
      fs.writeFileSync(destPath, buffer);
      console.log(`    ✅ Successfully saved ${buffer.length} bytes to ${filename}`);
      // Polite delay between successful requests to respect RPM quota
      await sleep(3000);
    } catch (err: any) {
      console.error(`    ❌ Generation failed:`, err.message);
    }
  }
}

async function main() {
  const quizzesToProcess = isAll ? listConfiguredQuizzes() : [targetQuiz];
  for (const slug of quizzesToProcess) {
    await processQuiz(slug);
  }
  console.log("\n✨ Pipeline execution finished!");
}

main().catch((err) => {
  console.error("Pipeline fatal error:", err);
  process.exit(1);
});
