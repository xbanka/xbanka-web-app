import { useMutation, useQuery } from "@tanstack/react-query";
import {
  executeConversion,
  getAllWalletBalances,
  getBankAcounts,
  getCryptoWallet,
  getCurrency,
  getFiatWallet,
  getGroupedPair,
  getSingleWalletBalance,
  getTransactionHistory,
  quoteConversion,
} from "../actions/wallet";
import { handleApiError } from "../errors/error";
import { ConvertExecutePayload, QuoteExecutePayload } from "../types/crypto-types";
import { toast } from "sonner";

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
    queryKey: ["transaction-history", page, limit],
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

export const useQuoteConversion = () => {
  return useMutation({
    mutationFn: (data: QuoteExecutePayload) => quoteConversion(data),
    onSuccess: (result) => {
      toast.success("Conversion successful");
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
};

export const useExecuteConversion = () => {
  return useMutation({
    mutationFn: (data: ConvertExecutePayload) => executeConversion(data),
    onSuccess: (result) => {
      toast.success("Conversion successful");
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
};

export const useGetCurrency = () => {
  return useQuery({
    queryKey: ["get-currency"],
    queryFn: async () => {
      try {
        const response = await getCurrency();
        return response;
      } catch (err) {
        handleApiError(err);
      }
    },
  });
};

export const useGetGroupedPair = () => {
  return useQuery({
    queryKey: ["get-grouped-pair"],
    queryFn: async () => {
      try {
        const response = await getGroupedPair();
        return response;
      } catch (err) {
        handleApiError(err);
      }
    },
  });
};