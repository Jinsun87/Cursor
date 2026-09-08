/** Placement IDs from EzoicAds → Placeholders for mediareferee.com (not examples). */
export const EZOIC_PLACEHOLDERS = {
  inQuizSecret: 645,
  betweenCourse: 646,
  postQuiz: 647,
  quietRoom: 648,
} as const;

/** Same Ads.txt Manager URL the live apex already 301s to (WordPress on mediareferee.com). */
export const MEDIAREFEREE_ADS_TXT_MANAGER =
  "https://srv.adstxtmanager.com/85097/mediareferee.com";

export function ezoicAdsEnabled() {
  return process.env.NEXT_PUBLIC_EZOIC_ADS === "true";
}

export function adsTxtRedirects() {
  const destination = process.env.EZOIC_ADS_TXT_URL?.trim() || MEDIAREFEREE_ADS_TXT_MANAGER;
  return [{ source: "/ads.txt", destination, permanent: true as const }];
}

export function runEzoic(fn: () => void) {
  if (typeof window === "undefined") return;
  const ez = (window.ezstandalone ??= { cmd: [] });
  ez.cmd ??= [];
  ez.cmd.push(fn);
}
