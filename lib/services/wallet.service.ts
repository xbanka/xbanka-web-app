import { useQuery } from "@tanstack/react-query";
import {
  getAllWalletBalances,
  getBankAcounts,
  getCryptoWallet,
  getFiatWallet,
  getSingleWalletBalance,
  getTransactionHistory,
} from "../actions/wallet";
import { handleApiError } from "../errors/error";

export const UseGetAllWalletBalances = () => {
  return useQuery({
    queryKey: ["all-wallet-balances"],
    queryFn: async () => {
      try {
        const response = await getAllWalletBalances();
        return response;
      } catch (err) {
        handleApiError(err);
      }
    },
  });
};

export const UseGetSingleWalletBalance = (walletId: string) => {
  return useQuery({
    queryKey: ["single-wallet-balances", walletId],
    queryFn: async () => {
      try {
        const response = await getSingleWalletBalance(walletId);
        return response;
      } catch (err) {
        handleApiError(err);
      }
    },
  });
};

export const UseGetCryptoWallet = () => {
  return useQuery({
    queryKey: ["crypto-wallet"],
    queryFn: async () => {
      try {
        const response = await getCryptoWallet();
        return response;
      } catch (err) {
        handleApiError(err);
      }
    },
  });
};

export const UseGetFiatWallet = () => {
  return useQuery({
    queryKey: ["fiat-wallet"],
    queryFn: async () => {
      try {
        const response = await getFiatWallet();
        return response;
      } catch (err) {
        handleApiError(err);
      }
    },
  });
};

export const UseGetBankAcounts = () => {
  return useQuery({
    queryKey: ["bank-accounts"],
    queryFn: async () => {
      try {
        const response = await getBankAcounts();
        return response;
      } catch (err) {
        handleApiError(err);
      }
    },
  });
};

export const UseGetTransactionHistory = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["bank-accounts", page, limit],
    queryFn: async () => {
      try {
        const response = await getTransactionHistory({ page, limit });
        return response;
      } catch (err) {
        handleApiError(err);
      }
    },
  });
};
