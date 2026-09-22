/**
 * Seed script for creating the Lampstand Pro catalog in Paddle.
 *
 * Usage:
 *   # For Live / Production:
 *   $env:PADDLE_API_KEY="your_live_api_key"
 *   $env:PADDLE_ENV="production"
 *   npx tsx scripts/seed-paddle-catalog.ts
 *
 *   # For Sandbox:
 *   $env:PADDLE_API_KEY="your_pdl_sdbx_key"
 *   $env:PADDLE_ENV="sandbox"
 *   npx tsx scripts/seed-paddle-catalog.ts
 */

import { Environment, Paddle } from "@paddle/paddle-node-sdk";

let rawKey = process.env.PADDLE_API_KEY?.trim() || "";
// Strip surrounding quotes if any
if ((rawKey.startsWith('"') && rawKey.endsWith('"')) || (rawKey.startsWith("'") && rawKey.endsWith("'"))) {
  rawKey = rawKey.slice(1, -1).trim();
}
// Strip accidental "Bearer " prefix if user added it
if (/^bearer\s+/i.test(rawKey)) {
  console.log("ℹ️  Stripped leading 'Bearer ' prefix from PADDLE_API_KEY.");
  rawKey = rawKey.replace(/^bearer\s+/i, "").trim();
}

const envSetting = process.env.PADDLE_ENV?.toLowerCase();
const isProduction = envSetting === "production" || process.argv.includes("--live");

if (!rawKey) {
  console.error("❌ ERROR: PADDLE_API_KEY environment variable is not set.");
  console.error("Please set PADDLE_API_KEY in your environment before running this script.");
  console.error("Example in PowerShell:");
  console.error('  $env:PADDLE_API_KEY="your_live_api_key"');
  console.error('  $env:PADDLE_ENV="production"');
  console.error("  npx tsx scripts/seed-paddle-catalog.ts\n");
  process.exitCode = 1;
  process.exit();
}

if (rawKey.startsWith("live_") || rawKey.startsWith("test_")) {
  console.error("\n❌ ERROR: Invalid API key format!");
  console.error(`Your key starts with "${rawKey.slice(0, 5)}", which is a Paddle Client-Side Token, NOT an API Key.`);
  console.error("Paddle has two different types of credentials:");
  console.error("  1. API Keys (starts with pdl_live_apikey_... or pdl_sdbx_apikey_...) -> Used for backend scripts and SDKs.");
  console.error("  2. Client-side tokens (starts with live_... or test_...) -> Used only in frontend browsers for Paddle.js.\n");
  console.error("To fix this:");
  console.error("  1. Log into your Paddle dashboard (vendors.paddle.com for live, or sandbox-vendors.paddle.com for sandbox).");
  console.error("  2. Go to: Developer tools > Authentication > API keys.");
  console.error("  3. Click 'Generate API key' with 'product.write' and 'price.write' permissions.");
  console.error("  4. Copy the key (starts with pdl_...) and set $env:PADDLE_API_KEY.\n");
  process.exitCode = 1;
  process.exit();
}

const environment = isProduction ? Environment.production : Environment.sandbox;
const paddle = new Paddle(rawKey, { environment });

console.log(`\n🚀 Initializing Paddle Catalog setup in [${isProduction ? "LIVE / PRODUCTION" : "SANDBOX"}] environment...\n`);

async function seedCatalog() {
  // 1. Create Product
  console.log("📦 Creating product: Lampstand Pro...");
  const product = await paddle.products.create({
    name: "Lampstand Pro",
    taxCategory: "saas",
    description: "Lampstand Pro subscription — unlimited access with 7-day free trial",
  });
  console.log(`   ✅ Product created: ${product.id} (${product.name})`);

  // 2. Create Monthly Price ($4.99 USD / month with 7-day trial and regional overrides)
  console.log("\n💳 Creating Monthly Price: USD 4.99 / month (7-day trial)...");
  const monthly = await paddle.prices.create({
    productId: product.id,
    description: "Lampstand Pro Monthly",
    unitPrice: { amount: "499", currencyCode: "USD" },
    billingCycle: { interval: "month", frequency: 1 },
    trialPeriod: { interval: "day", frequency: 7 },
    unitPriceOverrides: [
      { countryCodes: ["GB"], unitPrice: { amount: "399", currencyCode: "GBP" } },
      { countryCodes: ["IE"], unitPrice: { amount: "449", currencyCode: "EUR" } },
      { countryCodes: ["AU"], unitPrice: { amount: "699", currencyCode: "AUD" } },
    ],
  });
  console.log(`   ✅ Monthly Price created: ${monthly.id}`);

  // 3. Create Annual Price ($49.99 USD / year with 7-day trial and regional overrides)
  console.log("\n💳 Creating Annual Price: USD 49.99 / year (7-day trial, 2 months free)...");
  const annual = await paddle.prices.create({
    productId: product.id,
    description: "Lampstand Pro Annual (2 months free)",
    unitPrice: { amount: "4999", currencyCode: "USD" },
    billingCycle: { interval: "year", frequency: 1 },
    trialPeriod: { interval: "day", frequency: 7 },
    unitPriceOverrides: [
      { countryCodes: ["GB"], unitPrice: { amount: "3999", currencyCode: "GBP" } },
      { countryCodes: ["IE"], unitPrice: { amount: "4499", currencyCode: "EUR" } },
      { countryCodes: ["AU"], unitPrice: { amount: "6999", currencyCode: "AUD" } },
    ],
  });
  console.log(`   ✅ Annual Price created: ${annual.id}`);

  console.log("\n=======================================================");
  console.log("🎉 PADDLE CATALOG SETUP COMPLETE!");
  console.log("=======================================================");
  console.log(
    JSON.stringify(
      {
        environment: isProduction ? "production" : "sandbox",
        productId: product.id,
        monthlyPriceId: monthly.id,
        annualPriceId: annual.id,
      },
      null,
      2
    )
  );
  console.log("\nAdd these to your .env.local file:");
  console.log(`NEXT_PUBLIC_PADDLE_MONTHLY_PRICE_ID=${monthly.id}`);
  console.log(`NEXT_PUBLIC_PADDLE_ANNUAL_PRICE_ID=${annual.id}`);
  console.log("=======================================================\n");
}

seedCatalog().catch((error) => {
  console.error("❌ Failed to seed Paddle catalog:", error);
  process.exitCode = 1;
});
