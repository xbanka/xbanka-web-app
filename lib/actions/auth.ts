import { redirect } from "next/dist/server/api-utils";
import AxiosInstance from "../AxiosInstance/AxiosInstance"

export const signup = async (email: string, password: string, referralCode: string) => {
    const response = await AxiosInstance.post("/auth/signup", {
      email,
      password,
      referralCode,
      redirectUrl: process.env.NEXT_PUBLIC_REDIRECT_BASE_URL + "verify-email"
    })
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
}

export const resendEmailVerification = async (email: string) => {
    const response = await AxiosInstance.post("/auth/signup", {
      email,
      redirectUrl: process.env.NEXT_PUBLIC_REDIRECT_BASE_URL + "verify-email"
    })
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
}

export const login = async (email: string, password: string) => {
    const response = await AxiosInstance.post("/auth/login", {
      email,
      password,
    })
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
}

export const verifyEmail = async (token: string) => {
    const response = await AxiosInstance.post("/auth/verify-email", {
      token
    })
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
}

export const googleSignin = async (email: string) => {
    const response = await AxiosInstance.post("/auth/google", {
      email
    })
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
}