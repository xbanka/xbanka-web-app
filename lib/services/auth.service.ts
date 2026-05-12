import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  login,
  resendEmailVerification,
  signup,
  verifyDevice,
  verifyEmail,
} from "../actions/auth";
import { handleApiError } from "../errors/error";
import { SignupFormData, VerifyDeviceData } from "../types/auth-types";
import { logInFormData } from "../schema/auth-schema";
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
  //   const router = useRouter();
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

export const useLogin = () => {
  const router = useRouter();
  const mutate = useMutation({
    mutationFn: (data: logInFormData) => login(data.email, data.password),
    onSuccess: (res, variables) => {
      const result = res.data;
      console.log(res);
      const token = getAccessToken(result);

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
  //   const router = useRouter();
  const mutate = useMutation({
    mutationFn: (data: string) => verifyEmail(data),
    onSuccess: (result) => {
      toast.success(result.data.message);
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
