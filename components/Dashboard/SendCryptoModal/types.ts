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
  /** The UUID. Sent as `targetUserId` on transfers; never shown to users. */
  id: string;
  /** Short, readable ID ("xb-" + 5 characters) shown and searched in the UI. */
  xbId: string;
  createdAt: string;
  profile: XbankaUserProfile | null;
  email: string;
  /** Display name computed by the API — see `xbankaUserName`. */
  username: string;
}