import { describe, expect, it } from "vitest";
import { APEX_HOST, CANONICAL_ORIGIN, DEFAULT_SITE_URL, QUIZ_HOST, STAGING_HOSTS, siteUrl } from "./site";
import { pageMetadata } from "./seo";

describe("live host", () => {
  it("puts Lampstand on lampstandbible.com", () => {
    expect(APEX_HOST).toBe("lampstandbible.com");
    expect(QUIZ_HOST).toBe("lampstandbible.com");
    expect(DEFAULT_SITE_URL).toBe("https://lampstandbible.com");
    expect(siteUrl()).toMatch(/^https:\/\//);
  });

  it("points SEO at the production domain whatever NEXT_PUBLIC_SITE_URL says", () => {
    const original = process.env.NEXT_PUBLIC_SITE_URL;
    process.env.NEXT_PUBLIC_SITE_URL = "https://quiz.mediareferee.com";
    expect(CANONICAL_ORIGIN).toBe("https://lampstandbible.com");
    if (original === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
    else process.env.NEXT_PUBLIC_SITE_URL = original;
  });

  it("treats the old quiz host as staging, never production", () => {
    expect(STAGING_HOSTS).toContain("quiz.mediareferee.com");
    expect(STAGING_HOSTS).not.toContain(APEX_HOST);
  });
});

describe("pageMetadata", () => {
  it("sets a per-page canonical path and Open Graph url", () => {
    const meta = pageMetadata({ title: "Bible Quizzes", description: "d", path: "/quizzes" });
    expect(meta.alternates?.canonical).toBe("/quizzes");
    expect(meta.openGraph).toMatchObject({ url: "/quizzes", title: "Bible Quizzes" });
    expect(meta.robots).toBeUndefined();
  });

  it("marks private pages noindex", () => {
    expect(pageMetadata({ title: "Profile", path: "/profile", noindex: true }).robots).toEqual({
      index: false,
      follow: true,
    });
  });
});
