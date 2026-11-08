import { describe, expect, it } from "vitest";
import { signUpSchema } from "../schema/auth-schema";
import { buildSignupPayload } from "../signupPayload";

const CONTRACT_KEYS = [
  "email", "password", "redirectUrl", "referralCode", "firstName",
  "lastName", "dateOfBirth", "phoneNumber", "gender", "country",
];

// Every valid form across a grid of dates, genders, referrals and padding
// must produce a body the backend contract accepts.
describe("signup payload matches the backend contract across an input grid", () => {
  it("grid", () => {
    let cases = 0;
    const dates = ["1900-01-01", "1990-01-01", "2000-02-29", "2008-12-31"];
    for (const dateOfBirth of dates)
      for (const gender of ["male", "female", "other"] as const)
        for (const referral of ["", " REF1 ", undefined])
          for (const pad of ["", "  "]) {
            const form = signUpSchema.parse({
              email: `${pad}a@b.co${pad}`, password: "abc$defgh", referral,
              firstName: `${pad}Ada${pad}`, lastName: "Obi", dateOfBirth,
              phoneNumber: `${pad}+2348012345678`, gender, country: "Nigeria",
            });
            const body = buildSignupPayload(form, "https://app.test");
            cases++;
            for (const k of Object.keys(body)) expect(CONTRACT_KEYS).toContain(k);
            expect(body.dateOfBirth).toBe(`${dateOfBirth}T00:00:00.000Z`);
            expect(["Male", "Female", "Other"]).toContain(body.gender);
            expect(body.firstName).toBe("Ada");
            expect(body.email).toBe("a@b.co");
            expect(body.referralCode).toBe(referral?.trim() || undefined);
          }
    expect(cases).toBe(72);
  });
});
