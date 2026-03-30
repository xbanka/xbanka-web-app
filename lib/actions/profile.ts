import { da } from "zod/locales"
import AxiosInstance from "../AxiosInstance/AxiosInstance"
import { UpdateProfileData } from "../types/profile-types"

export const UserProfile = async () => {
  const response = await AxiosInstance.get("/users/profile")
    return response.data
}

export const updateProfile = async (data: UpdateProfileData) => {
  const formData = new FormData();

  formData.append("userId", data.userId);
  formData.append("firstName", data.firstName);
  formData.append("lastName", data.lastName);
  formData.append("dateOfBirth", data.dateOfBirth);
  formData.append("phoneNumber", data.phoneNumber);
  formData.append("gender", data.gender);
  formData.append("country", data.country);

  // 👇 file handling
  if (data.profilePicture && data.profilePicture[0]) {
    formData.append("profilePicture", data.profilePicture[0]);
  }

  const response = await AxiosInstance.post("/users/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const VerificationStatus = async () => {
  const response = await AxiosInstance.get("/users/verification-status")

  return response.data
}