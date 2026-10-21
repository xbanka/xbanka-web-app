import AxiosInstance from "../AxiosInstance/AxiosInstance";

// Upload + provider lookups (BVN, ID) can take well over the 10s default.
export const KYC_TIMEOUT_MS = 60000;

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
    timeout: KYC_TIMEOUT_MS,
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

export const initiateLivenessSession = async (userId: string) => {
  const response = await AxiosInstance.post("/kyc/liveness-session", {
    userId,
  });
  return {
    success: true,
    data: response.data?.data ?? response.data,
    status: response.status,
  };
};

export const getLivenessSessionStatus = async (sessionId: string) => {
  const response = await AxiosInstance.get(
    `/kyc/liveness-session/${sessionId}`,
  );
  return {
    success: true,
    data: response.data?.data ?? response.data,
    status: response.status,
  };
};

export const verifyBvn = async (userId: string, bvn: string) => {
  const response = await AxiosInstance.post(
    "/kyc/verify-bvn",
    { userId, bvn },
    // The BVN lookup at the provider can take up to ~30s on the server.
    { timeout: KYC_TIMEOUT_MS },
  );
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
