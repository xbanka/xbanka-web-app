import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteFiatWalletSavedCard,
  executeConversion,
  fundFiatWallet,
  fundFiatWalletSavedCard,
  fundFiatWalletSavedCards,
  getAllWalletBalances,
  getBankAcounts,
  getCryptoWallet,
  getCurrency,
  getDepositCrypto,
  getFiatWallet,
  getGroupedPair,
  getRateConversion,
  getSingleWalletBalance,
  getTransactionHistory,
  quoteConversion,
  verifyFund,
} from "../actions/wallet";
import { handleApiError } from "../errors/error";
import {
  ConvertExecutePayload,
  QuoteExecutePayload,
} from "../types/crypto-types";
import { toast } from "sonner";
import { fundWalletPayload, fundWalletSavedCardPayload } from "../types/transaction-types";

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

export const UseGetFiatWalletSavedCards = () => {
  return useQuery({
    queryKey: ["fiat-wallet-saved-cards"],
    queryFn: async () => {
      try {
        const response = await fundFiatWalletSavedCards();
        return response;
      } catch (err) {
        handleApiError(err);
      }
    },
    staleTime: 1000 * 60 * 5, // ✅ 5 mins cache
    gcTime: 1000 * 60 * 10,
  });
};

export const UseFundFiatWalletSavedCard = () => {
  return useMutation({
    mutationFn: (data: fundWalletSavedCardPayload) => fundFiatWalletSavedCard(data),
    onSuccess: (result) => {
      toast.success("Funded Successfully");
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
};

export const UseDeleteFiatWalletSavedCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: string) => deleteFiatWalletSavedCard(data),
    onSuccess: (result) => {
      toast.success("Deleted Successfully");
      queryClient.invalidateQueries({ queryKey: ["fiat-wallet-saved-cards"] });
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
};

// export const UseDepositCrypto = () => {
//   return useMutation({
//     mutationFn: (data: string) => getDepositCrypto(data),
//     onSuccess: (result) => {
//       toast.success("Conversion successful");
//     },
//     onError: (err) => {
//       handleApiError(err);
//     },
//   });
// };

export const UseVerifyFund = () => {
  return useMutation({
    mutationFn: (data: string) => verifyFund(data),
    onSuccess: (result) => {
      toast.success("Conversion successful");
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
};

export const UseFundFiatWallet = () => {
  return useMutation({
    mutationFn: (data: fundWalletPayload) => fundFiatWallet(data),
    onSuccess: (result) => {
      console.log("FULL result", result);

      const payload = result?.data || result; // 🔥 safe fallback

      const url = payload?.authorization_url;
      const ref = payload?.reference;

      if (!url) {
        console.error("No authorization_url found", result);
        toast.error("Payment initialization failed");
        return;
      }

      localStorage.setItem("fund_ref", ref);

      window.location.href = url;
    },
    onError: (err) => {
      handleApiError(err);
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

export const useGetRateConversion = () => {
  return useMutation({
    mutationFn: (data: QuoteExecutePayload) => getRateConversion(data),
    onSuccess: (result) => {
      toast.success("Conversion successful");
    },
    onError: (err) => {
      handleApiError(err);
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
