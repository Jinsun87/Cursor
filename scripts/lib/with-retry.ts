/** Vertex allows only a few images a minute: on "429 Too Many Requests", wait and try again. */
export async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fn();
    } catch (e) {
      // Rate limits and dropped connections are both worth another try.
      const limited = e instanceof Error && /\b429\b|RESOURCE_EXHAUSTED|fetch failed|ECONNRESET|ETIMEDOUT|socket hang up|\b50[234]\b/.test(e.message);
      if (!limited || attempt >= 8) throw e;
      const wait = Math.min(120, 15 * attempt);
      process.stdout.write(`\r  rate limited; waiting ${wait}s   `);
      await new Promise((r) => setTimeout(r, wait * 1000));
    }
  }
}
