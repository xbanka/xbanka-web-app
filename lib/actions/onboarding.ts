import axios from "axios";
import AxiosInstance from "../AxiosInstance/AxiosInstance";

export const profile = async (
  userId: string,
  firstName: string,
  lastName: string,
  dateOfBirth: string,
  phoneNumber: string,
  gender: string,
  country: string,
) => {
  const response = await AxiosInstance.post("/users/profile", {
    userId,
    lastName,
    firstName,
    dateOfBirth,
    gender,
    country,
    phoneNumber,
  });
  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};

export const skipStep = async (userId: string) => {
  const response = await AxiosInstance.post("/users/skip-step", {
    userId,
  });
  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};

export const identity = async (formData: FormData) => {
  const response = await AxiosInstance.post("/kyc/identity", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};

export const selfie = async (formData: FormData) => {
  const response = await AxiosInstance.post("/kyc/selfie", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};

export const verifyBvn = async (userId: string, bvn: string) => {
  const response = await AxiosInstance.post("/kyc/verify-bvn", {
    userId,
    bvn,
  });
  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};

export const address = async (formData: FormData) => {
  const response = await AxiosInstance.post("/kyc/address", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};
