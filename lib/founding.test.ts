import { describe, expect, it } from "vitest";
import { chaptersFundedPerMember, membersToFundBible } from "./founding";

describe("founding-member numbers", () => {
  it("one member funds about 200 chapters", () => {
    expect(chaptersFundedPerMember()).toBe(200);
  });
  it("about five members fund the whole Bible", () => {
    expect(membersToFundBible()).toBe(5);
  });
});
