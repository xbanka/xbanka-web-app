import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transferCryptoToXbankaUsers, XbankaCryptoUserPayload } from "../actions/send-crypto-to-users";
import { handleApiError } from "../errors/error";

export const useTransferCryptoToXbankaUsers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: XbankaCryptoUserPayload) => transferCryptoToXbankaUsers(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-wallet-balances"] });
      queryClient.invalidateQueries({ queryKey: ["crypto-wallet"] });
      queryClient.invalidateQueries({ queryKey: ["transaction-history"] });
      queryClient.invalidateQueries({ queryKey: ["get-notifications"] });
    },

    onError: (err) => {
      handleApiError(err);
    },
  });
};