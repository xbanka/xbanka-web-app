import { useMutation } from "@tanstack/react-query";
import {
  createPin,
  passwordChange,
  requesOtp,
  twoFactorAuthenticationDisable,
  twoFactorAuthenticationEnable,
  twoFactorAuthenticationGenerate,
  twoFactorLogin,
  updatePin,
  validatePin,
} from "../actions/security";
import { toast } from "sonner";
import { handleApiError } from "../errors/error";
import {
  CreatePinPayload,
  passwordChangePayload,
  UpdatePinPayload,
  ValidatePinPayload,
} from "../types/security-types";
import { RemoveDevice, RevokeSessions } from "../actions/sessions";

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
};

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

export const useRevokeSessions = () => {
  return useMutation({
    mutationFn: () => RevokeSessions(),

    onSuccess: () => {
      toast.success("OTP sent to your email");
    },

    onError: (err) => {
      handleApiError(err);
    },
  });
};

export const useRemoveDevice = () => {
  return useMutation({
    mutationFn: () => RemoveDevice(),

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
};

export const useValidatePin = () => {
  const mutate = useMutation({
    mutationFn: (data: ValidatePinPayload) => validatePin(data),
    onSuccess: (result) => {
      toast.success(result.data.message);
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
  return mutate;
};

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
};

export const useTwoFactorAuthenticationGenerate = () => {
  const mutate = useMutation({
    mutationFn: () => twoFactorAuthenticationGenerate(),
    onSuccess: (result) => {
      toast.success(result.data.message);
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
  return mutate;
};

export const useEnable2FA = () => {
  const mutate = useMutation({
    mutationFn: (data: string) => twoFactorAuthenticationEnable(data),
    onSuccess: (result) => {
      toast.success(result.data.message);
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
  return mutate;
};

export const useDisable2FA = () => {
  const mutate = useMutation({
    mutationFn: (data: string) => twoFactorAuthenticationDisable(data),
    onSuccess: (result) => {
      toast.success(result.data.message);
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
  return mutate;
};

export const useVerify2FALogin = () => {
  const mutate = useMutation({
    mutationFn: () => twoFactorLogin(),
    onSuccess: (result) => {
      toast.success(result.data.message);
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
  return mutate;
};
