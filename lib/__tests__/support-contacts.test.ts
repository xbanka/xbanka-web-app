import { describe, expect, it } from "vitest";
import { formatPhoneNumber, mailtoLink } from "@/lib/supportContacts";

describe("support contacts", () => {
  it("formats a Nigerian number for people to read", () => {
    expect(formatPhoneNumber("2349039716418")).toBe("+234 903 971 6418");
  });

  it("falls back to + and the digits for other numbers", () => {
    expect(formatPhoneNumber("447700900123")).toBe("+447700900123");
  });

  it("builds a mailto link with subject and body, spaces as %20", () => {
    expect(mailtoLink("support@xbankang.com")).toBe("mailto:support@xbankang.com");
    expect(
      mailtoLink("support@xbankang.com", { subject: "Support request", body: "UID: u1" }),
    ).toBe("mailto:support@xbankang.com?subject=Support%20request&body=UID%3A%20u1");
  });
});
