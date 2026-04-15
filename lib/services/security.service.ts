import { useMutation } from "@tanstack/react-query";
import { createPin, passwordChange, requesOtp, updatePin } from "../actions/security";
import { toast } from "sonner";
import { handleApiError } from "../errors/error";
import { CreatePinPayload, passwordChangePayload, UpdatePinPayload } from "../types/security-types";

export const useCreatePin = () => {
    const mutate = useMutation({
    mutationFn: (data: CreatePinPayload) => createPin(data),
    onSuccess: (result) => {
      toast.success(result.data.message);
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
  return mutate;
}

export const useRequestOtp = () => {
  return useMutation({
    mutationFn: () => requesOtp(),

    onSuccess: () => {
      toast.success("OTP sent to your email");
    },

    onError: (err) => {
      handleApiError(err);
    },
  });
};

export const useUpdatePin = () => {
    const mutate = useMutation({
    mutationFn: (data: UpdatePinPayload) => updatePin(data),
    onSuccess: (result) => {
      toast.success(result.data.message);
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
  return mutate;
}

export const useChangePassword = () => {
    const mutate = useMutation({
    mutationFn: (data: passwordChangePayload) => passwordChange(data),
    onSuccess: (result) => {
      toast.success(result.data.message);
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
  return mutate;
}