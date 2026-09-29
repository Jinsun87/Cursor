import { describe, expect, it } from "vitest";
import { APEX_HOST, DEFAULT_SITE_URL, QUIZ_HOST, siteUrl } from "./site";

describe("live host", () => {
  it("puts Lampstand on lampstandbible.com", () => {
    expect(APEX_HOST).toBe("lampstandbible.com");
    expect(QUIZ_HOST).toBe("lampstandbible.com");
    expect(DEFAULT_SITE_URL).toBe("https://lampstandbible.com");
    expect(siteUrl()).toMatch(/^https:\/\//);
  });
});

