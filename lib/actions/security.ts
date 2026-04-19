import AxiosInstance from "../AxiosInstance/AxiosInstance";
import { CreatePinPayload, passwordChangePayload, UpdatePinPayload } from "../types/security-types";

export const requesOtp = async () => {
    const response = await AxiosInstance.post("/security/request-otp")
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
}

export const passwordChange = async (data: passwordChangePayload) => {
    const response = await AxiosInstance.post("/security/password/change", data)
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
}

export const createPin = async (data: CreatePinPayload) => {
    const response = await AxiosInstance.post("/security/pin/create", data)
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
}

export const updatePin = async (data: UpdatePinPayload) => {
    const response = await AxiosInstance.post("/security/pin/update", data)
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
}

export const validatePin = async (token: string) => {
    const response = await AxiosInstance.post("/security/pin/validate", {
      token
    })
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
}

export const twoFactorAuthenticationGenerate = async () => {
    const response = await AxiosInstance.post("/security/2fa/generate")
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
}

export const twoFactorAuthenticationEnable = async (token: string, code: string) => {
    const response = await AxiosInstance.post("/security/2fa/enable", {
      token
    })
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
}

export const twoFactorAuthenticationDisable = async (token: string, code: string) => {
    const response = await AxiosInstance.post("/security/2fa/disable", {
      token
    })
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
}
