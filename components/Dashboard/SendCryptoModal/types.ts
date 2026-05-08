export interface RecipientXbankaUsersTypes {
  id: string;
  name: string;
  uid: string;
  amount?: number;
  narration?: string;
}

export interface XbankaUserProfile {
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
}
export interface XbankaUser {
  id: string;
  createdAt: string;
  profile: XbankaUserProfile | null;
  email: string;
}