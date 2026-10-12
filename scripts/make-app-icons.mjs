/**
 * App icons: the lit clay lamp (the same drawing as the lamp streak) on the
 * dark Lampstand background, rendered to PNG with Playwright's Chromium.
 *
 *   node scripts/make-app-icons.mjs
 *
 * Writes public/icon-192.png, public/icon-512.png, public/icon-maskable-512.png
 * (lamp kept inside the safe circle Android crops to) and
 * public/apple-touch-icon.png (180 px).
 */
import { chromium } from "@playwright/test";
import { join } from "node:path";

const LAMP = `
  <defs>
    <radialGradient id="glow">
      <stop offset="0%" stop-color="#ffd98a" stop-opacity="0.6" />
      <stop offset="60%" stop-color="#e4a53c" stop-opacity="0.18" />
      <stop offset="100%" stop-color="#e4a53c" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="clay" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#c99a55" />
      <stop offset="100%" stop-color="#7a5427" />
    </linearGradient>
    <linearGradient id="flame" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="#fff4cf" />
      <stop offset="45%" stop-color="#ffc955" />
      <stop offset="100%" stop-color="#e2731f" stop-opacity="0.9" />
    </linearGradient>
  </defs>
  <circle cx="146" cy="70" r="70" fill="url(#glow)" />
  <g transform="translate(146 96) scale(1.15)">
    <path d="M0 0 C -11 -10 -9 -28 0 -46 C 9 -28 11 -10 0 0 Z" fill="url(#flame)" />
    <path d="M0 -2 C -4 -8 -3 -16 0 -24 C 3 -16 4 -8 0 -2 Z" fill="#fffbea" opacity="0.9" />
  </g>
  <path d="M40 112 C 40 92 70 84 100 84 C 124 84 136 88 146 96 C 152 100 152 108 146 112 C 132 122 112 128 100 128 C 66 128 40 126 40 112 Z" fill="url(#clay)" />
  <path d="M44 110 C 28 108 24 96 34 92" fill="none" stroke="#9c6d33" stroke-width="6" stroke-linecap="round" />
  <ellipse cx="96" cy="96" rx="14" ry="5" fill="#4a3216" opacity="0.8" />
  <path d="M60 128 L 140 128 L 132 140 L 68 140 Z" fill="#6b4a22" />
  <rect x="54" y="140" width="92" height="6" rx="3" fill="#5a3d1b" />`;

// The lamp's drawing spans roughly x 24-152, y 44-146; centre it at (88, 95).
function icon(size, lampScale) {
  const s = (size / 512) * lampScale;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <radialGradient id="bg" cx="50%" cy="42%" r="70%">
      <stop offset="0%" stop-color="#2a1f12" />
      <stop offset="100%" stop-color="#0c0a09" />
    </radialGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#bg)" />
  <g transform="translate(${size / 2} ${size * 0.52}) scale(${s}) translate(-88 -95)">${LAMP}</g>
</svg>`;
}

const out = [
  ["icon-192.png", 192, 2.9],
  ["icon-512.png", 512, 2.9],
  ["icon-maskable-512.png", 512, 2.1], // inside Android's 80% safe circle
  ["apple-touch-icon.png", 180, 2.6],
];

const browser = await chromium.launch();
const page = await browser.newPage();
for (const [file, size, scale] of out) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<html><body style="margin:0">${icon(size, scale)}</body></html>`);
  await page.screenshot({ path: join("public", file), clip: { x: 0, y: 0, width: size, height: size } });
  console.log(`public/${file}`);
}
await browser.close();
