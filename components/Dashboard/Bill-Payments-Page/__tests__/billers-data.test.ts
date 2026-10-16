import { describe, expect, it } from "vitest";
import { billerFromText, discoBiller } from "../billers-data";

// Descriptions as they come back from the payments API, lower-cased and
// naming the disco by city rather than by acronym — the shape that used to
// leave Recent Transactions showing an initials badge instead of a logo.
describe("billerFromText", () => {
  it.each([
    ["ikeja prepaid electricity for 1234567890", "ikedc"],
    ["eko prepaid electricity for 1234567890", "ekedc"],
    ["kano prepaid electricity token", "kedco"],
    ["enugu postpaid electricity", "eedc"],
    ["abuja electricity payment", "aedc"],
    ["jos prepaid electricity", "jed"],
    ["benin prepaid electricity", "bedc"],
    ["yola prepaid electricity", "yedc"],
    ["ibadan prepaid electricity", "ibedc"],
  ])("%s -> %s", (note, id) => {
    expect(billerFromText(note)?.id).toBe(id);
  });

  it("still matches the id and the full display name", () => {
    expect(billerFromText("IKEDC prepaid electricity")?.id).toBe("ikedc");
    expect(billerFromText("Ikeja Electric (IKEDC) prepaid")?.id).toBe("ikedc");
  });

  it("matches the display name without its acronym", () => {
    expect(billerFromText("Ikeja Electric prepaid")?.id).toBe("ikedc");
  });

  it("matches non-electricity billers from their description", () => {
    expect(billerFromText("MTN data 2.5GB for 08100000000")?.id).toBe("mtn");
    expect(billerFromText("DStv Compact subscription")?.id).toBe("dstv");
  });

  it("returns nothing when no biller is named", () => {
    expect(billerFromText("bill payment")).toBeUndefined();
    expect(billerFromText("")).toBeUndefined();
  });
});

describe("discoBiller", () => {
  it("resolves the provider codes the API returns", () => {
    expect(discoBiller("IKEJA_ELECTRIC")?.id).toBe("ikedc");
    expect(discoBiller("IKEDC")?.id).toBe("ikedc");
    expect(discoBiller("EKO")?.id).toBe("ekedc");
  });
});
