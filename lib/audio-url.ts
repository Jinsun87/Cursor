/**
 * Where narration MP3s are streamed from. With NEXT_PUBLIC_AUDIO_BASE_URL set
 * (the Cloudflare R2 bucket's public address), "/sleep/genesis-1/chapter.mp3"
 * becomes "<base>/sleep/genesis-1/chapter.mp3"; without it, the site serves
 * the file itself. Upload new recordings with scripts/upload-audio-r2.ts.
 */
export function audioUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_AUDIO_BASE_URL?.trim().replace(/\/+$/, "");
  return base ? `${base}${path.startsWith("/") ? path : `/${path}`}` : path;
}
