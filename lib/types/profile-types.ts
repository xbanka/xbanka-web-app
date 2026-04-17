export interface UserProfileTypes {
  userId: string; // UUID

  email: string;
  isEmailVerified: boolean;

  currentStep: string; // e.g. "BVN"
  referralCode: string;

  isTwoFactorEnabled: boolean;
  hasTransactionPin: boolean;

  firstName: string;
  lastName: string;
  phoneNumber: string;

  dateOfBirth: string; // ISO 8601
  gender: string;

  country: string;
  state: string;

  avatarUrl: string | null;

  kycStatus: {
    bvnVerified: boolean;
    // idStatus: "PENDING" | "VERIFIED" | "REJECTED";
    idStatus: string;
    // addressStatus: "PENDING" | "VERIFIED" | "REJECTED";
    addressStatus: string;
  };

  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  gender: string;
  country: string;
};

export interface OnboardingStep {
  id: string;
  label: string;
  status: "completed" | "current" | "pending";
  isCompleted: boolean;
}

/**
 * The main user verification and onboarding state.
 */
export interface UserOnboardingState {
  currentStep: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  kycStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NONE'; // Added common variations
  tierLevel: number;
  progress: OnboardingStep[];
}