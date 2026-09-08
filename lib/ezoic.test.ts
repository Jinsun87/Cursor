import { describe, expect, it } from "vitest";
import { adsTxtRedirects, ezoicAdsEnabled, EZOIC_PLACEHOLDERS, MEDIAREFEREE_ADS_TXT_MANAGER } from "./ezoic";

describe("Ezoic flag", () => {
  it("stays off unless NEXT_PUBLIC_EZOIC_ADS is true", () => {
    expect(ezoicAdsEnabled()).toBe(false);
  });
});

describe("ads.txt redirect", () => {
  it("defaults to the live mediareferee.com Ads.txt Manager URL", () => {
    expect(adsTxtRedirects()).toEqual([
      {
        source: "/ads.txt",
        destination: MEDIAREFEREE_ADS_TXT_MANAGER,
        permanent: true,
      },
    ]);
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
