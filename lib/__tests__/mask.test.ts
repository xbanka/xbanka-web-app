import { describe, expect, it } from "vitest";
import { maskAccountNumber, maskAddress } from "../mask";

describe("maskAccountNumber", () => {
  it("keeps only the last 4 digits", () => {
    expect(maskAccountNumber("0123456789")).toBe("******6789");
  });
  it("returns short values and empty input unchanged", () => {
    expect(maskAccountNumber("1234")).toBe("1234");
    expect(maskAccountNumber("")).toBe("");
    expect(maskAccountNumber(null)).toBe("");
    expect(maskAccountNumber(undefined)).toBe("");
  });
});

describe("maskAddress", () => {
  it("keeps the first 6 and last 4 characters", () => {
    expect(maskAddress("TXk3abcdefghijklmn9fQz")).toBe("TXk3ab****9fQz");
    expect(maskAddress("0x71C7656EC7ab88b098defB751B7401B5f6d8976F")).toBe(
      "0x71C7****976F",
    );
  });
  it("never shows the middle of the address", () => {
    expect(maskAddress("TXk3abcdefghijklmn9fQz")).not.toContain("cdefghijklmn");
  });
  it("returns short values and empty input unchanged", () => {
    expect(maskAddress("abc")).toBe("abc");
    expect(maskAddress(null)).toBe("");
  });
});
