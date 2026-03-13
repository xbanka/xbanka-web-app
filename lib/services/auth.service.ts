import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { login, resendEmailVerification, signup, verifyEmail, } from "../actions/auth";
import { handleApiError } from "../errors/error";
import { SignupFormData } from "../types/auth-types";

export const useSignup = () => {
//   const router = useRouter();
  const mutate = useMutation({
    mutationFn: (data: SignupFormData) => signup(data.email, data.password, data.referralCode || ""),
    onSuccess: (result) => {
        toast.success(result.data.message)
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
  return mutate;
};

export const useLogin = () => {
//   const router = useRouter();
  const mutate = useMutation({
    mutationFn: (data: SignupFormData) => login(data.email, data.password),
    onSuccess: (result) => {
        toast.success(result.data.message)
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
        toast.success(result.data.message)
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
        toast.success(result.data.message)
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
  return mutate;
};
