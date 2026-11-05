import axios from "axios";
import { describe, expect, it } from "vitest";
import { buildSignupPayload } from "../signupPayload";

// Opt-in: creates a real account. Set XBANKA_EVAL_SIGNUP_URL (e.g. the
// staging API base) and XBANKA_EVAL_SIGNUP_EMAIL_DOMAIN to a catch-all inbox.
const base = process.env.XBANKA_EVAL_SIGNUP_URL;
const domain = process.env.XBANKA_EVAL_SIGNUP_EMAIL_DOMAIN;

describe.skipIf(!base || !domain)("live POST /auth/signup", () => {
  it("accepts the new body with personal details", async () => {
    const body = buildSignupPayload(
      {
        email: `eval+${Date.now()}@${domain}`,
        password: "StrongP@ssw0rd123!",
        firstName: "Eval",
        lastName: "User",
        dateOfBirth: "1990-01-01",
        phoneNumber: "+2348012345678",
        gender: "male",
        country: "Nigeria",
      },
      "https://app.xbankang.com",
    );
    const res = await axios.post(`${base}/auth/signup`, body, { validateStatus: () => true });
    expect(res.status, JSON.stringify(res.data)).toBeLessThan(300);
  });
});
