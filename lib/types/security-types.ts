export interface CreatePinPayload {
  pin: string;
  otp: string;
}

export interface UpdatePinPayload {
  oldPin: string;
  newPin: string;
  otp: string;
}

export interface passwordChangePayload {
  oldPassword: string;
  newPassword: string;
  otp: string;
}

export interface passwordChangePayload {
  oldPassword: string;
  newPassword: string;
  otp: string;
}
