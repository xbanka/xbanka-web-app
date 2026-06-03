import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ActiveNetworksCrypto,
  addBankAcounts,
  deleteFiatWalletSavedCard,
  executeConversion,
  fundFiatWallet,
  FundFiatWalletBank,
  fundFiatWalletBankSavedCard,
  fundFiatWalletSavedCard,
  fundFiatWalletSavedCards,
  generateDepositAddress,
  getAllWalletBalances,
  getBankAcounts,
  getBankAcountsList,
  getCryptoWallet,
  getCurrency,
  getFiatWallet,
  getGroupedPair,
  getMarketPrices,
  getRateConversion,
  getSingleWalletBalance,
  getTransactionHistory,
  getVirtualAccount,
  quoteConversion,
  sendFiatWallet,
  verifyFund,
  withdrawCrypto,
} from "../actions/wallet";
import { handleApiError } from "../errors/error";
import {
  ConvertExecutePayload,
  QuoteExecutePayload,
} from "../types/crypto-types";
import { toast } from "sonner";
import {
  AddBankAccountPayload,
  fundWalletBankPayload,
  fundWalletBankSavedCardPayload,
  fundWalletPayload,
  fundWalletSavedCardPayload,
  sendWalletPayload,
  WithdrawCryptoPayload,
} from "../types/wallet-types";

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

export const UseWithdrawCrypto = () => {
  return useMutation({
    mutationFn: (data: WithdrawCryptoPayload) => withdrawCrypto(data),
    onSuccess: (result) => {
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
};

// export const useGenerateAddress = () => {
//   return useMutation({
//     mutationFn: generateDepositAddress,
//     onSuccess: (result) => {
//       toast.success("Funded Successfully");
//     },
//     onError: (err) => {
//       handleApiError(err);
//     },
//   });
// };

export const useGenerateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      currency,
      network,
    }: {
      currency: string;
      network: string;
    }) => {
      const res = await generateDepositAddress({ currency, network });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crypto-wallet"] });
      queryClient.invalidateQueries({ queryKey: ["get-notifications"] });
    },
    onError: (err) => {
      handleApiError(err);
    },
    gcTime: 1000 * 60 * 30, // keep in cache 30 mins
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

export const UseGetVirtualAccount = () => {
  return useQuery({
    queryKey: ["virtual-account"],
    queryFn: async () => {
      try {
        const response = await getVirtualAccount();
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
    mutationFn: (data: fundWalletSavedCardPayload) =>
      fundFiatWalletSavedCard(data),
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: string) => verifyFund(data),
    onSuccess: (result) => {

      queryClient.invalidateQueries({ queryKey: ["all-wallet-balances"] });
      queryClient.invalidateQueries({ queryKey: ["fiat-wallet"] });
      queryClient.invalidateQueries({ queryKey: ["crypto-wallet"] });
      queryClient.invalidateQueries({ queryKey: ["transaction-history"] });
      queryClient.invalidateQueries({ queryKey: ["get-notifications"] });
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

export const UseFundFiatWalletBank = () => {
  return useMutation({
    mutationFn: (data: fundWalletBankPayload) => FundFiatWalletBank(data),
    onSuccess: (result) => {
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
};

export const UseSendFiatWallet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: sendWalletPayload) => sendFiatWallet(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["all-wallet-balances"] });
      queryClient.invalidateQueries({ queryKey: ["fiat-wallet"] });
      queryClient.invalidateQueries({ queryKey: ["transaction-history"] });
      queryClient.invalidateQueries({ queryKey: ["get-notifications"] });
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
};

export const UseBankAccountList = () => {
  return useQuery({
    queryKey: ["bank-list"],
    queryFn: async () => {
      try {
        const response = await getBankAcountsList();
        return response;
      } catch (err) {
        handleApiError(err);
      }
    },
  });
};

export const UseActiveNetworksCrypto = () => {
  return useQuery({
    queryKey: ["active-networks-crypto"],
    queryFn: async () => {
      try {
        const response = await ActiveNetworksCrypto();
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
    staleTime: 1000 * 60 * 10, // ✅ 10 mins
    gcTime: 1000 * 60 * 30, // keep in cache for 30 mins
  });
};

export const UseAddBankAcounts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AddBankAccountPayload) => addBankAcounts(data),
    onSuccess: (result) => {
      queryClient.refetchQueries({ queryKey: ["bank-accounts"] });
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
};

export const UseFundBankAcounts = () => {
  return useMutation({
    mutationFn: async (data: fundWalletBankSavedCardPayload) => {
      try {
        const response = await fundFiatWalletBankSavedCard(data);
        return response;
      } catch (err) {
        handleApiError(err);
      }
    },
  });
};

export const UseGetTransactionHistory = (
  page = 1,
  limit = 10,
  category?: "FIAT" | "CRYPTO" | "GIFTCARD",
) => {
  return useQuery({
    queryKey: ["transaction-history", page, limit, category],
    queryFn: async () => {
      try {
        const response = await getTransactionHistory({
          page,
          limit,
          category,
        });

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
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
};

export const useExecuteConversion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ConvertExecutePayload) => executeConversion(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["all-wallet-balances"] });
      queryClient.invalidateQueries({ queryKey: ["fiat-wallet"] });
      queryClient.invalidateQueries({ queryKey: ["transaction-history"] });
      queryClient.invalidateQueries({ queryKey: ["crypto-wallet"] });
      queryClient.invalidateQueries({ queryKey: ["get-notifications"] });
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

export const useGetMarketPrices = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["market-prices", page, limit],
    queryFn: async () => {
      try {
        const response = await getMarketPrices();
        return response;
      } catch (err) {
        handleApiError(err);
      }
    },
    staleTime: Infinity,
  });
};
