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
    onSuccess: (res) => {
      const result = res.data;

      console.log("successful", result);

      if (result.data.status === "DEVICE_VERIFICATION_REQUIRED") {
        // store temporarily
        localStorage.setItem("verifyUserId", result.data.userId);
        localStorage.setItem("verifyDeviceId", result.data.deviceId);

        router.push("/verify-device");
      } else {
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
