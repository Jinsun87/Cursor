/** Only allow same-site relative paths after sign-in, to avoid open redirects. */
export function safeNext(next: string | null | undefined, fallback = "/profile"): string {
  return next && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : fallback;
}
