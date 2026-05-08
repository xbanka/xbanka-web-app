import AxiosInstance from "../AxiosInstance/AxiosInstance";

export interface XbankaCryptoUserPayload {
  targetUserId: string;
  amount: number;
}

export const transferCryptoToXbankaUsers = async (payload: XbankaCryptoUserPayload) => {
  const response = await AxiosInstance.post("/transfer/crypto/xbanka-user", payload);

  return response.data;
};