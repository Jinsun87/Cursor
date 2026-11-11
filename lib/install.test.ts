import { describe, expect, it } from "vitest";
import { afterSignUpPath, detectPlatform, devicePlatform, installUrl } from "./install";

const IPHONE_SAFARI =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";
const IPHONE_FACEBOOK =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/FBIOS;FBAV/480.0.0.0;FBBV/1]";
const ANDROID_INSTAGRAM =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/130.0 Mobile Safari/537.36 Instagram 350.0.0.0";
const ANDROID_CHROME =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36";
const WINDOWS_CHROME = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";
const IPAD_AS_MAC = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15";

describe("detectPlatform", () => {
  it("knows the home-screen app", () => {
    expect(detectPlatform(IPHONE_SAFARI, true)).toBe("installed");
  });

  it("sends Facebook and Instagram visitors to a real browser first", () => {
    expect(detectPlatform(IPHONE_FACEBOOK, false)).toBe("in-app");
    expect(detectPlatform(ANDROID_INSTAGRAM, false)).toBe("in-app");
  });

  it("tells iPhone, Android and desktop apart", () => {
    expect(detectPlatform(IPHONE_SAFARI, false)).toBe("ios");
    expect(detectPlatform(ANDROID_CHROME, false)).toBe("android");
    expect(detectPlatform(WINDOWS_CHROME, false)).toBe("desktop");
  });

  it("treats an iPad that reports itself as a Mac as iOS", () => {
    expect(detectPlatform(IPAD_AS_MAC, false, true)).toBe("ios");
    expect(detectPlatform(IPAD_AS_MAC, false, false)).toBe("desktop");
  });
});

describe("devicePlatform", () => {
  it("reports the device even inside an in-app browser", () => {
    expect(devicePlatform(IPHONE_FACEBOOK)).toBe("ios");
    expect(devicePlatform(ANDROID_INSTAGRAM)).toBe("android");
    expect(devicePlatform(WINDOWS_CHROME)).toBe("desktop");
  });
});

describe("installUrl", () => {
  it("carries where to go next", () => {
    expect(installUrl("/?tab=sleep")).toBe("/install?next=%2F%3Ftab%3Dsleep");
  });
});

describe("afterSignUpPath", () => {
  it("shows the install page to new accounts", () => {
    expect(afterSignUpPath("/profile")).toBe("/install?next=%2Fprofile");
    expect(afterSignUpPath("/?tab=sleep")).toBe("/install?next=%2F%3Ftab%3Dsleep");
  });

  it("sends people on their way to checkout straight there", () => {
    expect(afterSignUpPath("/premium")).toBe("/premium");
    expect(afterSignUpPath("/pricing?plan=lifetime")).toBe("/pricing?plan=lifetime");
    expect(afterSignUpPath("/plan/read?day=1&part=0&voice=walk")).toBe("/plan/read?day=1&part=0&voice=walk");
  });

  it("does not mistake look-alike paths for checkout", () => {
    expect(afterSignUpPath("/pricingfaq")).toBe("/install?next=%2Fpricingfaq");
  });

  it("leaves a path already bound for the install page alone", () => {
    expect(afterSignUpPath("/install?next=%2Fplan%2Fread")).toBe("/install?next=%2Fplan%2Fread");
    expect(afterSignUpPath("/installer")).toBe("/install?next=%2Finstaller");
  });
});
