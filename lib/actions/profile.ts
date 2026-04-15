import { da } from "zod/locales"
import AxiosInstance from "../AxiosInstance/AxiosInstance"
import { UpdateProfileData } from "../types/profile-types"

export const UserProfile = async () => {
  const response = await AxiosInstance.get("/users/profile")
    return response.data
}

export const updateProfile = async (data: UpdateProfileData) => {
  
  const response = await AxiosInstance.post("/users/profile", data);

  return response.data;
};

export const VerificationStatus = async () => {
  const response = await AxiosInstance.get("/users/verification-status")

  return response.data
}