import { describe, expect, it } from "vitest";
import { isWeakPin, WEAK_PIN_MESSAGE } from "@/lib/pin-strength";
import {
  pinSchema,
  resetPinSchema,
  updatePinSchema,
} from "@/lib/schema/bvn-schema";

// QA case PIN-03: 0000, 1111, 1234, 4321 must each be rejected with a clear message.
const QA_REJECTED = ["0000", "1111", "1234", "4321"];

describe("isWeakPin", () => {
  it.each(QA_REJECTED)("rejects QA pattern %s", (pin) => {
    expect(isWeakPin(pin)).toBe(true);
  });

  it.each(["2222", "9999", "0123", "9876", "1357", "5821", "1212", "12345"])(
    "accepts %s",
    (pin) => expect(isWeakPin(pin)).toBe(false),
  );

  it("blocks exactly the 4 QA PINs out of all 10,000", () => {
    const weak = Array.from({ length: 10000 }, (_, i) =>
      String(i).padStart(4, "0"),
    ).filter(isWeakPin);
    expect(weak).toEqual(QA_REJECTED);
  });
});

describe("PIN-setting schemas", () => {
  const firstError = (r: { success: boolean; error?: { issues: { path: PropertyKey[]; message: string }[] } }, field: string) =>
    r.error?.issues.find((i) => i.path[0] === field)?.message;

  it.each(QA_REJECTED)("create PIN rejects %s with the message", (pin) => {
    const r = pinSchema.safeParse({ otp: "123456", pin });
    expect(r.success).toBe(false);
    expect(firstError(r, "pin")).toBe(WEAK_PIN_MESSAGE);
  });

  it.each(QA_REJECTED)("update PIN rejects new PIN %s", (newPin) => {
    const r = updatePinSchema.safeParse({ otp: "123456", oldPin: "5821", newPin });
    expect(r.success).toBe(false);
    expect(firstError(r, "newPin")).toBe(WEAK_PIN_MESSAGE);
  });

  it.each(QA_REJECTED)("reset PIN rejects new PIN %s", (newPin) => {
    const r = resetPinSchema.safeParse({ otp: "123456", newPin });
    expect(r.success).toBe(false);
    expect(firstError(r, "newPin")).toBe(WEAK_PIN_MESSAGE);
  });

  it("still lets a user with a weak existing PIN change it", () => {
    const r = updatePinSchema.safeParse({ otp: "123456", oldPin: "1234", newPin: "5821" });
    expect(r.success).toBe(true);
  });

  it("accepts a strong PIN everywhere", () => {
    expect(pinSchema.safeParse({ otp: "123456", pin: "5821" }).success).toBe(true);
    expect(resetPinSchema.safeParse({ otp: "123456", newPin: "5821" }).success).toBe(true);
  });
});
