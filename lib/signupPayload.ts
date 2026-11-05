import type { SignupFormData } from "./schema/auth-schema";
import type { SignupPayload } from "./types/auth-types";

const GENDER: Record<SignupFormData["gender"], SignupPayload["gender"]> = {
  male: "Male",
  female: "Female",
  other: "Other",
};

/** "1990-01-01" from a date input -> "1990-01-01T00:00:00.000Z". */
export const toIsoDate = (date: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`Invalid date of birth: ${date}`);
  }
  const iso = new Date(`${date}T00:00:00.000Z`);
  // Rejects calendar overflow such as 1990-02-31.
  if (Number.isNaN(iso.getTime()) || iso.toISOString().slice(0, 10) !== date) {
    throw new Error(`Invalid date of birth: ${date}`);
  }
  return iso.toISOString();
};

/** Maps the sign-up form to the POST /auth/signup body. */
export const buildSignupPayload = (
  form: SignupFormData,
  origin: string,
): SignupPayload => {
  const referralCode = form.referral?.trim();
  return {
    email: form.email.trim(),
    password: form.password,
    redirectUrl: `${origin}/verify-email`,
    ...(referralCode ? { referralCode } : {}),
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    dateOfBirth: toIsoDate(form.dateOfBirth),
    phoneNumber: form.phoneNumber.trim(),
    gender: GENDER[form.gender],
    country: form.country,
  };
};
