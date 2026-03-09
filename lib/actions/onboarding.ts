import AxiosInstance from "../AxiosInstance/AxiosInstance";

export const identity = async (
  userId: string,
  idType: string,
  idNumber: string,
  idImageUrl: string,
) => {
  const response = await AxiosInstance.post("/kyc/identity", {
    userId,
    idType,
    idNumber,
    idImageUrl,
  });
  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};

export const selfie = async (userId: string, selfieUrl: string) => {
  const response = await AxiosInstance.post("/kyc/selfie", {
    userId,
    selfieUrl,
  });

  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};

export const address = async (userId: string, selfieUrl: string) => {
  const response = await AxiosInstance.post("/kyc/address", {
    userId,
    selfieUrl,
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
