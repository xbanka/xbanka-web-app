import AxiosInstance from "../AxiosInstance/AxiosInstance";
import { sumWallets } from "../sumBalances";

export const getAllWalletBalances = async() => {
  const response = await AxiosInstance.get("/wallets");
  const total = sumWallets(response.data);

  return {
    success: true,
    data: response.data,
    totalBalance: total,
    status: response.status,
  };
};

export const getSingleWalletBalance = async(walletId: string) => {
  const response = await AxiosInstance.get(`/wallets/${walletId}`);

  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};

export const getCryptoWallet = async() => {
  const response = await AxiosInstance.get("/wallets/crypto");

  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};

export const getFiatWallet = async() => {
  const response = await AxiosInstance.get("/wallets/fiat");

  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};

export const getBankAcounts = async() => {
  const response = await AxiosInstance.get("/wallets/banks");

  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};

export const getTransactionHistory = async({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
}) => {
  const response = await AxiosInstance.get("/wallets/transactions", {
    params: { page, limit },
  });

  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};
