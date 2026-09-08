export function ezoicAdsEnabled() {
  return process.env.NEXT_PUBLIC_EZOIC_ADS === "true";
}

export function runEzoic(fn: () => void) {
  if (typeof window === "undefined") return;
  const ez = (window.ezstandalone ??= { cmd: [] });
  ez.cmd ??= [];
  ez.cmd.push(fn);
}
