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