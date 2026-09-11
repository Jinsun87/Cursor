import { describe, expect, it } from "vitest";
import { adsenseClient, adsenseEnabled, MEDIAREFEREE_ADSENSE_CLIENT } from "./adsense";

describe("AdSense", () => {
  it("stays off unless NEXT_PUBLIC_ADSENSE_CLIENT is a ca-pub id", () => {
    expect(adsenseEnabled()).toBe(false);
    expect(adsenseClient()).toBe("");
  });

  it("records the approved apex publisher id for Vercel config", () => {
    expect(MEDIAREFEREE_ADSENSE_CLIENT).toMatch(/^ca-pub-\d+$/);
  });
});
