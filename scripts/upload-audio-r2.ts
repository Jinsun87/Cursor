/**
 * Uploads the Walk and Sleep narration (public/walk and public/sleep MP3s) to
 * the Cloudflare R2 bucket, at the same paths (e.g. sleep/genesis-1/chapter.mp3),
 * so the app can stream them from NEXT_PUBLIC_AUDIO_BASE_URL instead of the
 * deployment. Skips files already there with the same size unless --force.
 * timing.json files stay in the repo and are served by the site.
 *
 *   npx tsx scripts/upload-audio-r2.ts             # everything new or changed
 *   npx tsx scripts/upload-audio-r2.ts genesis-3   # only paths containing this
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export function r2Env() {
  const env = existsSync(".env.local")
    ? Object.fromEntries(
        readFileSync(".env.local", "utf8")
          .split(/\r?\n/)
          .filter((l) => /^[A-Z0-9_]+=/.test(l))
          .map((l) => [l.split("=")[0], l.slice(l.indexOf("=") + 1).trim()]),
      )
    : {};
  const get = (k: string) => process.env[k] || env[k];
  const [account, keyId, secret, bucket] = ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET"].map(get);
  if (!account || !keyId || !secret || !bucket) return null;
  return {
    bucket,
    client: new S3Client({
      region: "auto",
      endpoint: `https://${account}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId: keyId, secretAccessKey: secret },
    }),
  };
}

function mp3sUnder(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? mp3sUnder(join(dir, d.name)) : d.name.endsWith(".mp3") ? [join(dir, d.name)] : [],
  );
}

/** Upload one public/ file to R2 at its path under public/. Returns false when skipped. */
export async function uploadToR2(r2: NonNullable<ReturnType<typeof r2Env>>, file: string, force = false): Promise<boolean> {
  const key = relative("public", file).split("\\").join("/");
  const size = statSync(file).size;
  if (!force) {
    try {
      const head = await r2.client.send(new HeadObjectCommand({ Bucket: r2.bucket, Key: key }));
      if (head.ContentLength === size) return false;
    } catch {
      // not there yet
    }
  }
  await r2.client.send(
    new PutObjectCommand({
      Bucket: r2.bucket,
      Key: key,
      Body: readFileSync(file),
      ContentType: "audio/mpeg",
      // A day in the browser cache: re-recorded chapters reach listeners within a day.
      CacheControl: "public, max-age=86400",
    }),
  );
  return true;
}

async function main() {
  const r2 = r2Env();
  if (!r2) throw new Error("R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY and R2_BUCKET are needed in .env.local");
  const only = process.argv.slice(2).find((a) => !a.startsWith("--"));
  const force = process.argv.includes("--force");
  const files = [...mp3sUnder(join("public", "sleep")), ...mp3sUnder(join("public", "walk"))].filter((f) => !only || f.includes(only));
  let sent = 0;
  for (const f of files) {
    if (await uploadToR2(r2, f, force)) sent++;
    process.stdout.write(`\r  ${sent} uploaded, ${files.indexOf(f) + 1}/${files.length} checked   `);
  }
  console.log(`\nDone: ${sent} uploaded, ${files.length - sent} already up to date.`);
}

if (process.argv[1]?.includes("upload-audio-r2")) main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
