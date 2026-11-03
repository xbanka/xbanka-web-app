import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildSupportMessage,
  DEFAULT_SUPPORT_WHATSAPP,
  normaliseWhatsAppNumber,
  supportWhatsAppNumber,
  whatsAppLink,
} from "@/lib/supportWhatsApp";

describe("support WhatsApp", () => {
  it("normalises the formats people paste", () => {
    expect(normaliseWhatsAppNumber("+234 801 234 5678")).toBe("2348012345678");
    expect(normaliseWhatsAppNumber("002348012345678")).toBe("2348012345678");
    expect(normaliseWhatsAppNumber("08012345678")).toBe("2348012345678");
    expect(normaliseWhatsAppNumber("(234) 801-234-5678")).toBe("2348012345678");
  });

  it("rejects a missing or nonsensical number", () => {
    expect(normaliseWhatsAppNumber(undefined)).toBeNull();
    expect(normaliseWhatsAppNumber("")).toBeNull();
    expect(normaliseWhatsAppNumber("12345")).toBeNull();
    expect(normaliseWhatsAppNumber("[WHATSAPP NUMBER]")).toBeNull();
  });

  describe("support number", () => {
    afterEach(() => vi.unstubAllEnvs());

    it("falls back to the support line when the env var is unset or unusable", () => {
      vi.stubEnv("NEXT_PUBLIC_SUPPORT_WHATSAPP", "");
      expect(supportWhatsAppNumber()).toBe(DEFAULT_SUPPORT_WHATSAPP);
      expect(DEFAULT_SUPPORT_WHATSAPP).toBe("2349039716418");
    });

    it("uses the env var when it holds a valid number", () => {
      vi.stubEnv("NEXT_PUBLIC_SUPPORT_WHATSAPP", "+234 801 234 5678");
      expect(supportWhatsAppNumber()).toBe("2348012345678");
    });
  });

  it("builds the message with topic, text and UID", () => {
    expect(
      buildSupportMessage({ topic: "Deposit", message: "  Transfer not received  ", uid: "465f97b6" }),
    ).toBe("Hi Xbanka, I need help with: Deposit\nTransfer not received\n\nUID: 465f97b6");
    expect(buildSupportMessage({ topic: "Crypto", message: "Hi" })).toBe(
      "Hi Xbanka, I need help with: Crypto\nHi",
    );
  });

  it("encodes the text into a wa.me link", () => {
    expect(whatsAppLink("2348012345678", "a & b\nc")).toBe(
      "https://wa.me/2348012345678?text=a%20%26%20b%0Ac",
    );
  });
});
