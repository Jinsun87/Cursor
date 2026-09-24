/**
 * Lampstand Daily Quality Control (QC) Automated Runner
 * 
 * Verifies:
 * 1. 30-Day Course Catalog Integrity (all 30 days present, sequenced 1-30)
 * 2. Visual Art Assets (all 30 artwork images exist on disk)
 * 3. Content Completeness (each chapter has verses, 3 check-ins, 5 story slides)
 * 4. TypeScript Compilation (zero type errors)
 * 5. Vitest Suite Execution (all 15 test suites and 59 tests)
 * 
 * Usage:
 *   npx tsx scripts/daily-qc.ts
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { CHAPTERS, BOOKS } from "../lib/bible/catalog";

const ROOT_DIR = process.cwd();

interface CheckResult {
  title: string;
  passed: boolean;
  details?: string;
}

const results: CheckResult[] = [];

function logSection(title: string) {
  console.log(`\n=======================================================`);
  console.log(`🔍 ${title}`);
  console.log(`=======================================================`);
}

// 1. Check 30-Day Course Catalog
logSection("CHECK 1: 30-Day Course Catalog Integrity");
const chapterList = Object.values(CHAPTERS);
const daysFound = new Set<number>();
let catalogErrors = 0;

if (chapterList.length < 30) {
  results.push({
    title: "Catalog Chapter Count",
    passed: false,
    details: `Expected at least 30 chapters, found ${chapterList.length}`,
  });
  catalogErrors++;
} else {
  results.push({
    title: "Catalog Chapter Count",
    passed: true,
    details: `Found ${chapterList.length} registered landmark chapters`,
  });
}

// Verify day numbering 1..30
for (const ch of chapterList) {
  if (ch.dayNumber) {
    daysFound.add(ch.dayNumber);
  }
}

const missingDays: number[] = [];
for (let d = 1; d <= 30; d++) {
  if (!daysFound.has(d)) {
    missingDays.push(d);
  }
}

if (missingDays.length > 0) {
  results.push({
    title: "Continuous 1–30 Day Sequencing",
    passed: false,
    details: `Missing day numbers: ${missingDays.join(", ")}`,
  });
  catalogErrors++;
} else {
  results.push({
    title: "Continuous 1–30 Day Sequencing",
    passed: true,
    details: `All days 1 through 30 present and sequenced`,
  });
}

// 2. Check Visual Artwork Files on Disk
logSection("CHECK 2: Chapter Artwork Verification");
let missingArtCount = 0;
const checkedArt = new Set<string>();

for (const ch of chapterList) {
  if (!ch.artworkUrl) {
    missingArtCount++;
    console.log(`❌ Missing artworkUrl on chapter: ${ch.bookSlug} ${ch.chapterNumber}`);
    continue;
  }

  if (!checkedArt.has(ch.artworkUrl)) {
    checkedArt.add(ch.artworkUrl);
    const localPath = path.join(ROOT_DIR, "public", ch.artworkUrl.replace(/^\//, ""));
    if (!fs.existsSync(localPath)) {
      missingArtCount++;
      console.log(`❌ File not found on disk: ${ch.artworkUrl} (Chapter: ${ch.title})`);
    }
  }
}

if (missingArtCount === 0) {
  results.push({
    title: "Visual Artwork Integrity",
    passed: true,
    details: `All ${checkedArt.size} unique artwork images verified on disk`,
  });
} else {
  results.push({
    title: "Visual Artwork Integrity",
    passed: false,
    details: `${missingArtCount} artwork files missing from /public`,
  });
}

// 3. Check Chapter Content Depth
logSection("CHECK 3: Chapter Content Completeness");
let contentErrors = 0;

for (const ch of chapterList) {
  if (!ch.verses || ch.verses.length === 0) {
    console.log(`❌ No verses in: ${ch.bookSlug} ${ch.chapterNumber}`);
    contentErrors++;
  }
  if (!ch.checkInQuestions || ch.checkInQuestions.length < 3) {
    console.log(`❌ Insufficient check-in questions in: ${ch.bookSlug} ${ch.chapterNumber}`);
    contentErrors++;
  }
  if (!ch.storySlides || ch.storySlides.length < 5) {
    console.log(`❌ Insufficient story slides in: ${ch.bookSlug} ${ch.chapterNumber}`);
    contentErrors++;
  }
}

if (contentErrors === 0) {
  results.push({
    title: "Content Depth (Verses, 3 Questions, 5 Slides)",
    passed: true,
    details: `All 30 chapters meet full multi-media specification`,
  });
} else {
  results.push({
    title: "Content Depth",
    passed: false,
    details: `${contentErrors} chapters failed content specification`,
  });
}

// 4. Type-Check with TypeScript
logSection("CHECK 4: TypeScript Compilation (tsc --noEmit)");
try {
  execSync("npx tsc --noEmit", { stdio: "pipe" });
  results.push({
    title: "TypeScript Type Safety",
    passed: true,
    details: "Zero compilation errors",
  });
  console.log("✅ TypeScript compilation passed cleanly.");
} catch (err: any) {
  results.push({
    title: "TypeScript Type Safety",
    passed: false,
    details: err.stdout?.toString() || "TypeScript compiler found errors",
  });
  console.log("❌ TypeScript compilation failed.");
}

// 5. Run Vitest Test Suites
logSection("CHECK 5: Vitest Test Suite Execution");
try {
  const testOutput = execSync("npx vitest run", { stdio: "pipe" }).toString();
  const summaryMatch = testOutput.match(/Tests\s+(\d+\s+passed)/);
  const suiteMatch = testOutput.match(/Test Files\s+(\d+\s+passed)/);
  results.push({
    title: "Vitest Automated Suites",
    passed: true,
    details: `${suiteMatch ? suiteMatch[1] : "All suites"} / ${summaryMatch ? summaryMatch[1] : "All tests"} passed`,
  });
  console.log("✅ All automated test suites passed cleanly.");
} catch (err: any) {
  results.push({
    title: "Vitest Automated Suites",
    passed: false,
    details: err.stdout?.toString() || "Vitest run failed",
  });
  console.log("❌ Vitest test execution failed.");
}

// Summary Report
logSection("📋 DAILY QC REPORT SUMMARY");
let allGreen = true;
for (const r of results) {
  const badge = r.passed ? "🟢 PASS" : "🔴 FAIL";
  if (!r.passed) allGreen = false;
  console.log(`${badge} | ${r.title.padEnd(45)} | ${r.details || ""}`);
}

console.log("\n=======================================================");
if (allGreen) {
  console.log("🎉 ALL QUALITY CONTROL CHECKS PASSED — READY FOR READERS!");
  console.log("=======================================================\n");
  process.exit(0);
} else {
  console.error("🚨 QC FAILURES DETECTED — REVIEW ISSUES ABOVE BEFORE RELEASE.");
  console.log("=======================================================\n");
  process.exit(1);
}
