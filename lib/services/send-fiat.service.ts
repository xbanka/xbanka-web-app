import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getActiveXbankaUsers, transferFiatToXbankaUsers, XbankaUserPayload } from "../actions/send-fiat-to-users";
import { handleApiError } from "../errors/error";
import { toast } from "sonner";

export const UseGetActiveXbankaUsers = () => {
  const mutate = useQuery({
    queryKey: ["get-active-xbanka-users"],
    queryFn: async () => {
      try {
        const response = await getActiveXbankaUsers();
        return response;
      } catch (err) {
        handleApiError(err);
      }
    },
  });
  return mutate;
};

export const useTransferFiatToXbankaUsers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: XbankaUserPayload) => transferFiatToXbankaUsers(data),

    onSuccess: () => {
      toast.success("OTP sent to your email");
      queryClient.invalidateQueries({ queryKey: ["all-wallet-balances"] });
      queryClient.invalidateQueries({ queryKey: ["fiat-wallet"] });
      queryClient.invalidateQueries({ queryKey: ["transaction-history"] });
    },

    onError: (err) => {
      handleApiError(err);
    },
  });
};