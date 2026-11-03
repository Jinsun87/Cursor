/**
 * Records the screens for the POV demo ads (video/pov.ts): lampstandbible.com at iPhone size,
 * as a Premium listener opening Psalm 23, setting the sleep timer and rain, and listening.
 *
 *   node video/pov-shoot.mjs
 *
 * The Premium listener is pretend and lives only in this browser: Supabase calls are answered
 * here, the session cookie is stripped before requests reach the site, and analytics, the Meta
 * pixel, Paddle and /api are blocked, so nothing is counted or stored. No password is used.
 * Writes video/.work/pov/shots/*.png (1170×2532) and taps.json (where each tap lands, in CSS px).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const { chromium } = await import(pathToFileURL(join(ROOT, "node_modules", "playwright", "index.mjs")).href);
const OUT = join(ROOT, "video", ".work", "pov", "shots");
mkdirSync(OUT, { recursive: true });

const SITE = "https://lampstandbible.com";
const REF = "teaajkzxuwgngqkfqoby";
const PSALM_23 = [1.64, 11.1, 18.9, 27.58, 42.6, 54.26]; // verse starts, public/sleep/psalm-23/timing.json

const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
const exp = Math.floor(Date.now() / 1000) + 86400;
const user = {
  id: "00000000-0000-4000-8000-00000000d3e0",
  aud: "authenticated",
  role: "authenticated",
  email: "listener@example.com",
  app_metadata: { provider: "email" },
  user_metadata: {},
  created_at: "2026-10-01T00:00:00Z",
};
const jwt = `${b64({ alg: "HS256", typ: "JWT" })}.${b64({ sub: user.id, exp, role: "authenticated", aud: "authenticated" })}.demo`;
const session = { access_token: jwt, token_type: "bearer", expires_in: 86400, expires_at: exp, refresh_token: "demo", user };

const browser = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  colorScheme: "dark",
  timezoneId: "America/Chicago",
  userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
});
// 11:48 pm on a night whose "Verse for today" suits sleep (Matthew 11:28, "I will give you rest").
await context.clock.setFixedTime(new Date("2026-11-16T23:48:00-06:00"));
await context.addCookies([{ name: `sb-${REF}-auth-token`, value: `base64-${b64(session)}`, domain: "lampstandbible.com", path: "/" }]);
await context.addInitScript(() => {
  try {
    localStorage.setItem("lampstand-ad-consent", "denied");
    localStorage.setItem("lampstand-onboarding", JSON.stringify({ done: true }));
  } catch {}
});

const json = (route, body) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(body) });
await context.route(/googletagmanager|google-analytics|connect\.facebook|facebook\.com\/tr|_vercel\/insights|_vercel\/speed|pagead|doubleclick|paddle\.com/, (r) => r.abort());
await context.route(`${SITE}/api/**`, (r) => r.fulfill({ status: 204 }));
await context.route(`https://${REF}.supabase.co/**`, (route) => {
  const req = route.request();
  const url = req.url();
  if (url.includes("/auth/v1/user")) return json(route, user);
  if (url.includes("/auth/v1/")) return json(route, session);
  if (req.method() !== "GET" && req.method() !== "HEAD") return route.fulfill({ status: 201, body: "" });
  const single = (req.headers()["accept"] ?? "").includes("vnd.pgrst.object");
  if (url.includes("/rest/v1/profiles")) return json(route, single ? { username: "listener", newsletter: false, created_at: user.created_at } : []);
  if (url.includes("/rest/v1/subscriptions"))
    return json(route, [{ status: "active", price_id: "demo", current_period_end: "2099-01-01T00:00:00Z", scheduled_change: null, paddle_updated_at: "2026-11-01T00:00:00Z" }]);
  return json(route, single ? null : []);
});
await context.route(`${SITE}/**`, (route) => {
  const headers = { ...route.request().headers() };
  delete headers.cookie;
  return route.fallback({ headers });
});

const page = await context.newPage();
page.on("pageerror", (e) => console.log("page error:", e.message));
const taps = {};
const shot = (name) => page.screenshot({ path: join(OUT, `${name}.png`) });
/** Remembers where a tap on this element lands, then taps it. */
async function tap(name, locator) {
  const box = await locator.first().boundingBox();
  taps[name] = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  await locator.first().click();
}

await page.goto(`${SITE}/?tab=sleep`, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await shot("a-home");

// Scroll down to the shelf, one screenshot per video frame, eased like a thumb flick.
const psalms = page.locator("button:has-text('Poetry and Wisdom')");
const target = Math.round((await psalms.boundingBox()).y - 380);
const FRAMES = 30;
for (let i = 0; i <= FRAMES; i++) {
  const p = i / FRAMES;
  const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
  await page.evaluate((y) => window.scrollTo(0, y), Math.round(target * eased));
  await page.waitForTimeout(40);
  await shot(`scroll-${String(i).padStart(2, "0")}`);
}

await tap("psalms", psalms);
await page.waitForTimeout(1500);
await shot("c-psalms");
await tap("p23", page.locator('text="23"'));
await page.waitForTimeout(900);
await shot("d-card");
await tap("play", page.locator("button:has-text('Play')"));
await page.waitForTimeout(1200);
await shot("e-controls");
await tap("options", page.locator("[aria-label='Options: sleep timer, speed and sound']"));
await page.waitForTimeout(1000);
await shot("f-options");
await tap("timer", page.locator("button:text-is('30 min')"));
await page.waitForTimeout(600);
await shot("g-timer");

// The rain slider: drag its thumb from 0 to 60%.
const rain = (await page.locator("input[type=range]").nth(2).boundingBox());
taps.rainFrom = { x: rain.x + 8, y: rain.y + rain.height / 2 };
taps.rainTo = { x: rain.x + rain.width * 0.6, y: rain.y + rain.height / 2 };
for (let i = 1; i <= 12; i++) {
  await page.evaluate((v) => {
    const r = document.querySelectorAll("input[type=range]")[2];
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(r, String(v));
    r.dispatchEvent(new Event("input", { bubbles: true }));
    r.dispatchEvent(new Event("change", { bubbles: true }));
  }, (0.6 * i) / 12);
  await page.waitForTimeout(80);
  await shot(`rain-${String(i).padStart(2, "0")}`);
}
await tap("close", page.locator("[aria-label='Close options']"));
await page.waitForTimeout(900);
await shot("i-closed");

// Each verse once the controls have faded away.
for (const [i, t] of PSALM_23.entries()) {
  await page.evaluate((s) => (document.querySelector("audio").currentTime = s), t + 0.6);
  await page.waitForTimeout(i === 0 ? 6000 : 1800);
  await shot(`verse-${i + 1}`);
}

writeFileSync(join(OUT, "taps.json"), JSON.stringify(taps, null, 1));
await browser.close();
console.log(`Screens and taps written to ${OUT}`);
