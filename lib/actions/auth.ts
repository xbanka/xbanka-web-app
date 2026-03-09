import AxiosInstance from "../AxiosInstance/AxiosInstance"

export const signup = async (email: string, password: string, referralCode: string) => {
    const response = await AxiosInstance.post("/auth/signup", {
      email,
      password,
      referralCode
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

export const verifyEmail = async (email: string) => {
    const response = await AxiosInstance.post("/auth/verify-email", {
      email
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