import { describe, expect, it } from "vitest";
import { signUpSchema, type SignupFormData } from "../schema/auth-schema";
import { buildSignupPayload, toIsoDate } from "../signupPayload";

const form: SignupFormData = {
  email: " user@example.com ",
  password: "StrongP@ssw0rd123!",
  referral: "OPTIONAL",
  firstName: "John",
  lastName: "Doe",
  dateOfBirth: "1990-01-01",
  phoneNumber: "+2348012345678",
  gender: "male",
  country: "Nigeria",
};

describe("buildSignupPayload", () => {
  it("builds the exact POST /auth/signup body from the backend contract", () => {
    expect(buildSignupPayload(form, "https://app.xbankang.com")).toEqual({
      email: "user@example.com",
      password: "StrongP@ssw0rd123!",
      redirectUrl: "https://app.xbankang.com/verify-email",
      referralCode: "OPTIONAL",
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: "1990-01-01T00:00:00.000Z",
      phoneNumber: "+2348012345678",
      gender: "Male",
      country: "Nigeria",
    });
  });

  // Regression: the form field is `referral` but the old code read
  // `referralCode`, so referral codes were silently dropped.
  it("sends the referral the user typed", () => {
    expect(buildSignupPayload(form, "x").referralCode).toBe("OPTIONAL");
  });

  it("omits referralCode when blank", () => {
    const body = buildSignupPayload({ ...form, referral: "  " }, "x");
    expect("referralCode" in body).toBe(false);
  });

  it.each([
    ["male", "Male"],
    ["female", "Female"],
    ["other", "Other"],
  ] as const)("maps gender %s to %s", (input, expected) => {
    expect(buildSignupPayload({ ...form, gender: input }, "x").gender).toBe(expected);
  });
});

describe("toIsoDate", () => {
  it("keeps the calendar day in UTC", () => {
    expect(toIsoDate("2000-12-31")).toBe("2000-12-31T00:00:00.000Z");
  });

  it.each(["", "01/01/1990", "1990-02-31", "1990-13-01"])("rejects %j", (bad) => {
    expect(() => toIsoDate(bad)).toThrow();
  });
});

describe("signUpSchema", () => {
  const valid = { ...form, email: "user@example.com" };

  it("accepts a complete form", () => {
    expect(signUpSchema.safeParse(valid).success).toBe(true);
  });

  it.each(["firstName", "lastName", "dateOfBirth", "phoneNumber", "gender", "country"] as const)(
    "requires %s",
    (field) => {
      const result = signUpSchema.safeParse({ ...valid, [field]: "" });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].path).toEqual([field]);
    },
  );

  it("rejects a short phone number", () => {
    expect(signUpSchema.safeParse({ ...valid, phoneNumber: "080" }).success).toBe(false);
  });

  it("requires an uppercase letter in the password", () => {
    const result = signUpSchema.safeParse({ ...valid, password: "lowercase$1" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Must include an uppercase letter");
  });

  it("does not collect NIN", () => {
    expect(Object.keys(signUpSchema.shape)).not.toContain("nin");
  });
});
