import { describe, expect, it } from "vitest";
import { APEX_HOST, DEFAULT_SITE_URL, QUIZ_HOST, siteUrl } from "./site";

describe("live host", () => {
  it("puts Lampstand on a mediareferee.com subdomain, not the apex", () => {
    expect(APEX_HOST).toBe("mediareferee.com");
    expect(QUIZ_HOST).toBe("quiz.mediareferee.com");
    expect(DEFAULT_SITE_URL).toBe("https://quiz.mediareferee.com");
    expect(siteUrl()).toMatch(/^https:\/\//);
  });
});
