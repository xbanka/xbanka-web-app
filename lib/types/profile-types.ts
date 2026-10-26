export interface UserProfileTypes {
  userId: string;
  email: string;
  isEmailVerified: boolean;
  currentStep: string;
  referralCode: string;
  isTwoFactorEnabled: boolean;
  hasTransactionPin: boolean;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  country: string;
  state: string;
  avatarUrl: string | null;
  /** True once a NIN is saved. The NIN itself is never returned. */
  hasNin?: boolean;
  /** Last 4 digits of the saved NIN, for display only. */
  ninMasked?: string | null;

  completedOnboardingSteps: string[];

  kycStatus: {
    bvnVerified: boolean;
    idStatus: string;
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
  profilePicture: null;
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