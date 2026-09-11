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

export function requestAdSense() {
  if (typeof window === "undefined") return;
  try {
    window.adsbygoogle = window.adsbygoogle || [];
    window.adsbygoogle.push({});
  } catch {
    /* script may still be loading */
  }
}

export function whenAdSenseReady(fn: () => void) {
  if (typeof window === "undefined") return () => {};
  let tries = 0;
  const id = window.setInterval(() => {
    tries += 1;
    if (window.adsbygoogle) {
      window.clearInterval(id);
      fn();
    } else if (tries > 40) {
      window.clearInterval(id);
    }
  }, 150);
  return () => window.clearInterval(id);
}
