export const EZOIC_PLACEHOLDERS = {
  inQuizSecret: 101,
  betweenCourse: 102,
  postQuiz: 103,
  quietRoom: 104,
} as const;

export function ezoicAdsEnabled() {
  return process.env.NEXT_PUBLIC_EZOIC_ADS === "true";
}

export function adsTxtRedirects() {
  const destination = process.env.EZOIC_ADS_TXT_URL?.trim();
  if (!destination) return [];
  return [{ source: "/ads.txt", destination, permanent: true as const }];
}

export function runEzoic(fn: () => void) {
  if (typeof window === "undefined") return;
  const ez = (window.ezstandalone ??= { cmd: [] });
  ez.cmd ??= [];
  ez.cmd.push(fn);
}
