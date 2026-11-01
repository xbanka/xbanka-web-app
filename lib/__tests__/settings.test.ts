import { describe, expect, it } from "vitest";
import {
  LANGUAGES,
  isIdleTooLong,
  isLocked,
  languageByCode,
  maskAmounts,
  notificationCategory,
} from "@/lib/settings";

describe("settings helpers", () => {
  it("masks naira, dollar, coded and crypto amounts", () => {
    expect(maskAmounts("You received ₦25,000.00 from Ada")).toBe("You received •••• from Ada");
    expect(maskAmounts("Withdrawal of NGN 5,000 sent")).toBe("Withdrawal of •••• sent");
    expect(maskAmounts("5000 naira credited")).toBe("•••• credited");
    expect(maskAmounts("Bought 0.0012 BTC for $50")).toBe("Bought •••• for ••••");
  });

  it("leaves text without amounts alone", () => {
    expect(maskAmounts("New sign-in on iPhone 15")).toBe("New sign-in on iPhone 15");
    expect(maskAmounts("Your PIN was changed")).toBe("Your PIN was changed");
  });

  it("sorts notifications into categories", () => {
    expect(notificationCategory({ title: "Wallet funded", message: "Deposit received" })).toBe("received");
    expect(notificationCategory({ title: "Withdrawal successful" })).toBe("sent");
    expect(notificationCategory({ title: "Electricity token ready" })).toBe("bills");
    expect(notificationCategory({ title: "Swap completed", message: "USDT to BTC" })).toBe("crypto");
    expect(notificationCategory({ type: "SECURITY", title: "New sign-in" })).toBe("security");
  });

  it("keeps security email on", () => {
    expect(isLocked("security", "email")).toBe(true);
    expect(isLocked("security", "inApp")).toBe(false);
    expect(isLocked("news", "email")).toBe(false);
  });

  it("offers African languages and falls back to English", () => {
    const names = LANGUAGES.map((l) => l.english);
    expect(names).toEqual(expect.arrayContaining(["Yoruba", "Igbo", "Hausa", "Nigerian Pidgin", "Swahili", "Amharic", "Zulu"]));
    expect(languageByCode("nope").code).toBe("en-NG");
  });

  it("signs out only after the chosen idle time", () => {
    const min = 60_000;
    expect(isIdleTooLong(0, 14 * min, 15)).toBe(false);
    expect(isIdleTooLong(0, 15 * min, 15)).toBe(true);
    expect(isIdleTooLong(0, 999 * min, 0)).toBe(false);
  });
});
