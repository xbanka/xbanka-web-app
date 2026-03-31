export interface UserProfileTypes {
  userId: string; // UUID
  email?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string; // E.164 format
  avatarUrl?: string; // URL string
  createdAt?: string; // ISO 8601 date
};

export interface UpdateProfileData {
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  gender: string;
  country: string;
  profilePicture?: FileList; 
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