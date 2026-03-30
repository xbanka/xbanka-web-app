import AxiosInstance from "../AxiosInstance/AxiosInstance";

export const requesOtp = async (token: string) => {
    const response = await AxiosInstance.post("/security/request-otp", {
      token
    })
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
}

export const passwordChange = async (token: string) => {
    const response = await AxiosInstance.post("/security/password/change", {
      token
    })
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
}

export const createPin = async (token: string) => {
    const response = await AxiosInstance.post("/security/pin/create", {
      token
    })
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

export const twoFactorAuthenticationGenerate = async (token: string) => {
    const response = await AxiosInstance.post("/security/2fa/generate", {
      token
    })
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
}

export const twoFactorAuthenticationValidate = async (token: string, code: string) => {
    const response = await AxiosInstance.post("/security/2fa/validate", {
      token,
      code
    })
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
}
