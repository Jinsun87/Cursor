/** Live domain for Lampstand. */
export const APEX_HOST = "lampstandbible.com";
export const QUIZ_HOST = "lampstandbible.com";
export const DEFAULT_SITE_URL = `https://${QUIZ_HOST}`;

/**
 * Origin used for every SEO signal (canonical tags, sitemap, robots, Open
 * Graph). Fixed in code rather than read from NEXT_PUBLIC_SITE_URL so a
 * staging or misconfigured deployment can never point search engines at
 * another domain.
 */
export const CANONICAL_ORIGIN = DEFAULT_SITE_URL;

/** Hosts that serve this app for testing only; they send `X-Robots-Tag: noindex`. */
export const STAGING_HOSTS = ["quiz.mediareferee.com"];

export function siteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  return fromEnv || DEFAULT_SITE_URL;
}
