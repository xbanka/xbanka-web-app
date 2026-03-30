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