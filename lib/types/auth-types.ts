/** Body of POST /auth/signup. */
export interface SignupPayload {
  email: string;
  password: string;
  redirectUrl: string;
  referralCode?: string;
  firstName: string;
  lastName: string;
  /** ISO 8601, midnight UTC, e.g. "1990-01-01T00:00:00.000Z". */
  dateOfBirth: string;
  phoneNumber: string;
  gender: "Male" | "Female" | "Other";
  country: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface VerifyEmailData {
  email: string;
}

export interface VerifyDeviceData {
  userId: string;
  deviceId: string;
  code: string;
}

export interface VerifyTwoFactorData {
  userId: string;
  code: string;
}

export interface VerifyEmailData {
  id: string;
  email: string;
  googleId: string | null;
  access_token: string;
  refresh_token: string;
  completedOnboardingSteps: string; // Stored as a JSON string stringified array (e.g., '["SIGNUP","EMAIL_VERIFIED"]')
  currentStep: string;
  isEmailVerified: boolean;
  isTwoFactorEnabled: boolean;
  referralCode: string;
  referredBy: string;
  securityOtp: string | null;
  securityOtpExpiresAt: string | null; // ISO Date string or null
  transactionPin: string | null;
  twoFactorSecret: string | null;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  verificationToken: string | null;
  verificationTokenExpiresAt: string | null; // ISO Date string or null
}

export interface VerifyEmailApiResponse {
  message: string;
  details: string;
  errorGroup: string;
  data: VerifyEmailData;
}
