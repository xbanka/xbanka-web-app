import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  forgotPassword,
  login,
  resendEmailVerification,
  resetPassword,
  signup,
  verifyDevice,
  verifyEmail,
} from "../actions/auth";
import { handleApiError } from "../errors/error";
import { SignupFormData, VerifyDeviceData } from "../types/auth-types";
import {
  forgotPasswordData,
  logInFormData,
  resetPasswordData,
} from "../schema/auth-schema";
import { useRouter } from "next/navigation";
import { tokenStore } from "@/store/token.store";
import { authTokens } from "../authToken";

type TokenResponse = {
  access_token?: string;
  accessToken?: string;
  token?: string;
  data?: TokenResponse;
};

const getAccessToken = (result: TokenResponse) =>
  result.access_token ||
  result.accessToken ||
  result.token ||
  result.data?.access_token ||
  result.data?.accessToken ||
  result.data?.token;

export const useSignup = () => {
  const mutate = useMutation({
    mutationFn: (data: SignupFormData) =>
      signup(data.email, data.password, data.referralCode || ""),
    onSuccess: (result) => {
      toast.success(result.data.message);
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
  return mutate;
};

export const useResetPassword = () => {
  const mutate = useMutation({
    mutationFn: (data: resetPasswordData) =>
      resetPassword(data.email, data.password, data.otp),
    onSuccess: (result) => {
      toast.success(result.data.message);
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
  return mutate;
};

export const useForgotPassword = () => {
  const mutate = useMutation({
    mutationFn: (data: forgotPasswordData) => forgotPassword(data.email),
    onSuccess: (result) => {
      toast.success(result.data.message);
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
  return mutate;
};

export const useLogin = () => {
  const router = useRouter();
  const mutate = useMutation({
    mutationFn: (data: logInFormData) => login(data.email, data.password),
    onSuccess: (res, variables) => {
      const result = res.data;
      const accessToken = getAccessToken(result);
      const refreshToken = result?.refresh_token;
      console.log(refreshToken);
      console.log(variables);

      if (result.status === "DEVICE_VERIFICATION_REQUIRED") {
        localStorage.removeItem("accessToken");
        tokenStore.clear();
        // store temporarily
        localStorage.setItem("verifyUserId", result.userId);
        localStorage.setItem("verifyDeviceId", result.deviceId);
        localStorage.setItem("verifyEmail", variables.email);

        router.push("/verify-device");
      } else {
        if (accessToken && refreshToken) {
          authTokens.setTokens(accessToken, refreshToken);
          tokenStore.set(accessToken);
          document.cookie = `accessToken=${accessToken}; path=/`;
        }
        router.push("/");
      }
    },
    onError: (err: any) => {
      if (err?.raw?.response?.data?.errorGroup === "EMAIL_VERIFICATION_REQUIRED") {
        return; // Component will handle this specific error
      }
      handleApiError(err);
    },
  });
  return mutate;
};

export const useVerifyDevice = () => {
  const router = useRouter();
  const mutate = useMutation({
    mutationFn: (data: VerifyDeviceData) => verifyDevice(data),
    onSuccess: (result) => {
      const accessToken = result.data.access_token;
      const refreshToken = result.data.refresh_token;

      if (accessToken && refreshToken) {
        authTokens.setTokens(accessToken, refreshToken);
        tokenStore.set(accessToken);
        document.cookie = `accessToken=${accessToken}; path=/`;
      }

      localStorage.removeItem("verifyEmail");
      localStorage.removeItem("verifyUserId");
      localStorage.removeItem("verifyDeviceId");

      toast.success(result.data.message);
      router.push("/");
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
  return mutate;
};

export const useVerifyMail = () => {
  const mutate = useMutation({
    mutationFn: (data: string) => verifyEmail(data),
    onSuccess: (res) => {
      const result = res.data;

      toast.success(result.data.message);

      const accessToken = result.data.access_token;
      const refreshToken = result.data.refresh_token;

      if (accessToken && refreshToken) {
        authTokens.setTokens(accessToken, refreshToken);
        tokenStore.set(accessToken);
        document.cookie = `accessToken=${accessToken}; path=/`;
      }
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
  return mutate;
};

export const useResendVerifyMail = () => {
  //   const router = useRouter();
  const mutate = useMutation({
    mutationFn: (data: string) => resendEmailVerification(data),
    onSuccess: (result) => {
      toast.success(result.data.message);
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
  return mutate;
};
