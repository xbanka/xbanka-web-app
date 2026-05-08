import AxiosInstance from "../AxiosInstance/AxiosInstance";

export const getActiveXbankaUsers = async () => {
  const response = await AxiosInstance.get("/users/search");

  return response.data;
};

export interface XbankaUserPayload {
  targetUserId: string;
  amount: number;
}

export const transferFiatToXbankaUsers = async (payload: XbankaUserPayload) => {
  const response = await AxiosInstance.post("/transfer/xbanka-user", payload);

  return response.data;
};