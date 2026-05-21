export interface SignupFormData {
    email: string;
    password: string;
    referralCode?: string;
    redirectUrl?: string;
}

export interface LoginFormData {
    email: string;
    password: string;
}

export interface VerifyEmailData {
    email: string;
}

export interface VerifyDeviceData {
  userId: string,
  deviceId: string,
  code: string

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