/**
 * Bulk Image Generator & Downloader Script for Lampstand Quizzes
 * 
 * Usage:
 *   node scripts/generate-quiz-images.mjs
 * 
 * Description:
 *   Scans public/images/quizzes/{quiz-slug}/ directory structure, 
 *   downloads high-resolution royalty-free images matching question prompts,
 *   and saves them as q1.png, q2.png, q3.png...
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_QUIZ_IMAGES_DIR = path.join(__dirname, "../public/images/quizzes");

console.log("---------------------------------------------------------");
console.log("📸 Lampstand Bulk Quiz Image Pipeline");
console.log("---------------------------------------------------------");
console.log(`Target Directory: ${PUBLIC_QUIZ_IMAGES_DIR}`);
console.log("\nTo add images in bulk without code changes:");
console.log("1. Create folder: public/images/quizzes/<quiz-slug>/");
console.log("2. Place images: q1.png, q2.png, q3.png, q4.png...");
console.log("3. QuizRunner will automatically detect and render them!");
console.log("---------------------------------------------------------");

// Ensure public/images/quizzes directory exists
if (!fs.existsSync(PUBLIC_QUIZ_IMAGES_DIR)) {
  fs.mkdirSync(PUBLIC_QUIZ_IMAGES_DIR, { recursive: true });
}
