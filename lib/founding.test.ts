import { describe, expect, it } from "vitest";
import { FOUNDING_LADDER, MEMBERS_PER_LANGUAGE, MEMBERS_PER_MONTH, membersToFundBible } from "./founding";

describe("founding-member numbers", () => {
  it("about eleven members fund the whole Bible", () => {
    expect(membersToFundBible()).toBe(11);
  });

  it("starts the ladder with the whole Bible", () => {
    expect(FOUNDING_LADDER[0]).toMatchObject({ title: "The whole Bible", members: membersToFundBible() });
  });

  it("counts every earlier step, so each costed step needs more members than the last", () => {
    const costed = FOUNDING_LADDER.filter((m) => m.members !== null).map((m) => m.members!);
    expect(costed).toEqual([11, 16, 18, 25]);
  });

  it("leaves ongoing work without a member count", () => {
    expect(FOUNDING_LADDER.filter((m) => m.cost === null).every((m) => m.members === null)).toBe(true);
    expect(MEMBERS_PER_LANGUAGE).toBe(7);
  });

  it("about twelve members keep it running for a month, wage included", () => {
    expect(MEMBERS_PER_MONTH).toBe(12);
  });
});
