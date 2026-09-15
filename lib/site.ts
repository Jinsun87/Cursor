/** Live quiz host. Apex mediareferee.com stays on the existing site. */
export const APEX_HOST = "mediareferee.com";
export const QUIZ_HOST = "quiz.mediareferee.com";
export const DEFAULT_SITE_URL = `https://${QUIZ_HOST}`;

export function siteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  return fromEnv || DEFAULT_SITE_URL;
}
