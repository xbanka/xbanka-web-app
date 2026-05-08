import { useMutation, useQuery } from "@tanstack/react-query";
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
  return useMutation({
    mutationFn: (data: XbankaUserPayload) => transferFiatToXbankaUsers(data),

    onSuccess: () => {
      toast.success("OTP sent to your email");
    },

    onError: (err) => {
      handleApiError(err);
    },
  });
};