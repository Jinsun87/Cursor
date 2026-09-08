import { describe, expect, it } from "vitest";
import { ezoicAdsEnabled } from "./ezoic";

describe("Ezoic flag", () => {
  it("stays off unless NEXT_PUBLIC_EZOIC_ADS is true", () => {
    expect(ezoicAdsEnabled()).toBe(false);
  });
});
