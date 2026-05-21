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
      console.log(res);
      const token = getAccessToken(result);
      console.log(variables)

      if (result.status === "DEVICE_VERIFICATION_REQUIRED") {
        localStorage.removeItem("accessToken");
        tokenStore.clear();
        // store temporarily
        localStorage.setItem("verifyUserId", result.userId);
        localStorage.setItem("verifyDeviceId", result.deviceId);
        localStorage.setItem("verifyEmail", variables.email);

        router.push("/verify-device");
      } else {
        if (token) {
          localStorage.setItem("accessToken", token);
          tokenStore.set(token);
        }

        console.log("token", token);
        console.log("successful", result);
        router.push("/");
      }
    },
    onError: (err) => {
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
      const token = getAccessToken(result.data);
      console.log(token);
      if (token) {
        localStorage.setItem("accessToken", token);
        tokenStore.set(token);
      }
      localStorage.removeItem("verifyEmail");
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
      console.log(result)
      toast.success(result.data.message);
      const token = result.access_token;
      localStorage.setItem("accessToken", token);
      tokenStore.set(token);
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
