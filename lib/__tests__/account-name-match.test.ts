import { describe, expect, it } from "vitest";
import { accountNameMatchesProfile } from "@/lib/accountNameMatch";

const profile = { firstName: "Oluwaseun", lastName: "Adeyemi" };

describe("accountNameMatchesProfile", () => {
  it("matches the bank's ordering, casing and extra middle name", () => {
    expect(
      accountNameMatchesProfile("ADEYEMI OLUWASEUN DANIEL", profile),
    ).toBe("match");
    expect(accountNameMatchesProfile("Oluwaseun Adeyemi", profile)).toBe(
      "match",
    );
  });

  it("matches hyphenated and apostrophised names part by part", () => {
    expect(
      accountNameMatchesProfile("MARY JANE O'BRIEN", {
        firstName: "Mary-Jane",
        lastName: "O'Brien",
      }),
    ).toBe("match");
  });

  it("flags an account in someone else's name", () => {
    expect(accountNameMatchesProfile("ADA OBI", profile)).toBe("mismatch");
    // Sharing a surname is not enough.
    expect(accountNameMatchesProfile("ADEYEMI TOLU", profile)).toBe(
      "mismatch",
    );
  });

  it("cannot judge without both names", () => {
    expect(accountNameMatchesProfile("ADA OBI", { firstName: "Ada" })).toBe(
      "unknown",
    );
    expect(accountNameMatchesProfile("", profile)).toBe("unknown");
  });
});
