import { describe, expect, it } from "vitest";
import { rankOptions, scoreOption } from "@/lib/rank-options";

// A slice of the real /accounts/banks list, including the pairs that share
// initials ("gtb" is both Greenwich and Guaranty) so ordering is pinned down.
const BANKS = [
  "Access Bank",
  "Citibank Nigeria",
  "Ecobank Nigeria",
  "Fidelity Bank",
  "First City Monument Bank",
  "Globus Bank",
  "Greenwich Merchant Bank",
  "Guaranty Trust Bank",
  "Keystone Bank",
  "Polaris Bank",
  "Stanbic IBTC Bank",
  "Sterling Bank",
  "United Bank for Africa",
  "Wema Bank",
  "Zenith Bank",
].map((label) => ({ label, value: label }));

const search = (query: string) =>
  rankOptions(BANKS, query).map((option) => option.label);

describe("rankOptions — bank search", () => {
  it("finds Guaranty Trust from its initials", () => {
    expect(search("gt")[0]).toBe("Guaranty Trust Bank");
    expect(search("gtb")[0]).toBe("Guaranty Trust Bank");
  });

  it("finds it from the start of a word too", () => {
    expect(search("gua")[0]).toBe("Guaranty Trust Bank");
    expect(search("guaranty")[0]).toBe("Guaranty Trust Bank");
  });

  it("handles the other acronyms people actually type", () => {
    expect(search("uba")[0]).toBe("United Bank for Africa");
    expect(search("fcmb")[0]).toBe("First City Monument Bank");
    expect(search("zen")[0]).toBe("Zenith Bank");
  });

  it("keeps other similar banks below the best match", () => {
    const results = search("gt");
    expect(results[0]).toBe("Guaranty Trust Bank");
    expect(results).toContain("Greenwich Merchant Bank");
  });

  it("is case and punctuation insensitive", () => {
    expect(search("GTB")[0]).toBe("Guaranty Trust Bank");
    expect(search("  gt  ")[0]).toBe("Guaranty Trust Bank");
  });

  it("returns the untouched list for an empty query", () => {
    expect(rankOptions(BANKS, "")).toHaveLength(BANKS.length);
    expect(rankOptions(BANKS, "   ")[0].label).toBe("Access Bank");
  });

  it("drops options that match nothing", () => {
    expect(search("zzzz")).toEqual([]);
  });

  it("still matches a plain substring", () => {
    expect(search("bank").length).toBeGreaterThan(5);
  });

  it("scores an exact name above an initials hit", () => {
    expect(scoreOption("Access Bank", "access bank")).toBeGreaterThan(
      scoreOption("Guaranty Trust Bank", "gtb"),
    );
  });
});

describe("rankOptions — typos", () => {
  it("finds Guaranty Trust from a misspelling", () => {
    expect(search("guarantee")[0]).toBe("Guaranty Trust Bank");
    expect(search("guarante trust")[0]).toBe("Guaranty Trust Bank");
  });

  it("finds Access and Zenith from near misses", () => {
    expect(search("acess")[0]).toBe("Access Bank");
    expect(search("zenit")[0]).toBe("Zenith Bank");
  });

  it("does not fuzz short queries", () => {
    expect(search("zzz")).toHaveLength(0);
  });
});
