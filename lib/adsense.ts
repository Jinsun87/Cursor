/** Publisher ID already on live mediareferee.com (AdSense Auto ads / adsbygoogle). */
export const MEDIAREFEREE_ADSENSE_CLIENT = "ca-pub-3795330167795048";

export function adsenseClient() {
  const fromEnv = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();
  if (fromEnv) return /^ca-pub-\d+$/.test(fromEnv) ? fromEnv : "";
  return "";
}

export function adsenseEnabled() {
  return Boolean(adsenseClient());
}

export function adsenseSlot() {
  const slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT?.trim();
  return slot || "";
}
