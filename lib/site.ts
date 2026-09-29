/** Live domain for Lampstand. */
export const APEX_HOST = "lampstandbible.com";
export const QUIZ_HOST = "lampstandbible.com";
export const DEFAULT_SITE_URL = `https://${QUIZ_HOST}`;

export function siteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  return fromEnv || DEFAULT_SITE_URL;
}

