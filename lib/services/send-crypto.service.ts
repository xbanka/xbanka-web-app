import { useMutation } from "@tanstack/react-query";
import { transferCryptoToXbankaUsers, XbankaCryptoUserPayload } from "../actions/send-crypto-to-users";
import { handleApiError } from "../errors/error";
import { toast } from "sonner";

export const useTransferCryptoToXbankaUsers = () => {
  return useMutation({
    mutationFn: (data: XbankaCryptoUserPayload) => transferCryptoToXbankaUsers(data),

    onSuccess: () => {
      toast.success("OTP sent to your email");
    },

    onError: (err) => {
      handleApiError(err);
    },
  });
};