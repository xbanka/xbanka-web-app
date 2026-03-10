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