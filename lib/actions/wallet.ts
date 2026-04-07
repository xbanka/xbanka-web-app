import AxiosInstance from "../AxiosInstance/AxiosInstance";
import { sumWallets } from "../sumBalances";
import {
  ConvertExecutePayload,
  QuoteExecutePayload,
} from "../types/crypto-types";
import { fundWalletPayload } from "../types/transaction-types";

export const getAllWalletBalances = async () => {
  const response = await AxiosInstance.get("/wallets");
  const total = sumWallets(response.data);

  return {
    success: true,
    data: response.data,
    totalBalance: total,
    status: response.status,
  };
};

export const getSingleWalletBalance = async (walletId: string) => {
  const response = await AxiosInstance.get(`/wallets/${walletId}`);

  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};

export const getCryptoWallet = async () => {
  const response = await AxiosInstance.get("/wallets/crypto");

  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};

export const getFiatWallet = async () => {
  const response = await AxiosInstance.get("/wallets/fiat");

  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};

export const fundFiatWallet = async (data: fundWalletPayload) => {
  const response = await AxiosInstance.post("/wallets/fiat/fund/initiate", {
    amount: data.amount,
    callback_url: `${window.location.origin}/wallet/fund-callback`,
  });

  return response.data
};

export const verifyFund = async (reference: string) => {
  const res = await AxiosInstance.get(
    `/wallets/fiat/fund/verify/${reference}`
  );

  return res.data;
};

export const getBankAcounts = async () => {
  const response = await AxiosInstance.get("/wallets/banks");

  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};

export const getTransactionHistory = async ({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
}) => {
  const response = await AxiosInstance.get("/wallet/transactions", {
    params: { page, limit },
  });

  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};

export const getRateConversion = async (data: QuoteExecutePayload) => {
  const response = await AxiosInstance.post("/wallets/convert/check-rate", data);

  return response.data;
};

export const quoteConversion = async (data: QuoteExecutePayload) => {
  const response = await AxiosInstance.post("/wallets/convert/quote", data);

  return response.data;
};

export const executeConversion = async (data: ConvertExecutePayload) => {
  const response = await AxiosInstance.post("/wallets/convert/execute", data);

  return response.data;
};

export const getCurrency = async () => {
  const response = await AxiosInstance.get("/wallet/assets/currencies");

  return response.data;
};

export const getGroupedPair = async () => {
  const response = await AxiosInstance.get("/wallet/assets/grouped-pairs");

  return response.data;
};
