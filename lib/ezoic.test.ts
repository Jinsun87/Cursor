import { describe, expect, it } from "vitest";
import { adsTxtRedirects, ezoicAdsEnabled, EZOIC_PLACEHOLDERS } from "./ezoic";

describe("Ezoic flag", () => {
  it("stays off unless NEXT_PUBLIC_EZOIC_ADS is true", () => {
    expect(ezoicAdsEnabled()).toBe(false);
  });
});

describe("ads.txt redirect", () => {
  it("is off until EZOIC_ADS_TXT_URL is set", () => {
    expect(adsTxtRedirects()).toEqual([]);
  });
});

describe("placeholder ids", () => {
  it("keeps the four dashboard slots in one map", () => {
    expect(EZOIC_PLACEHOLDERS).toEqual({
      inQuizSecret: 101,
      betweenCourse: 102,
      postQuiz: 103,
      quietRoom: 104,
    });
  });
});
