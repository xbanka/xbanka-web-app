import { useMutation } from "@tanstack/react-query";
import { profile, selfie, verifyBvn } from "../actions/onboarding";
import { handleApiError } from "../errors/error";
import { toast } from "sonner";
import { profilePayload, verifyBvnPayload } from "../types/onboarding-types";

export const useUserProfile = () => {
  const mutate = useMutation({
    mutationFn: (data: profilePayload) =>
      profile(
        data.userId,
        data.firstName,
        data.lastName,
        data.dateOfBirth,
        data.phoneNumber,
        data.gender,
        data.country,
      ),
    onSuccess: (result) => {
      toast.success(result.data.message);
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
  return mutate;
};

export const useVerifyBvn = () => {
  const mutate = useMutation({
    mutationFn: (data: verifyBvnPayload) => verifyBvn(data.userId, data.bvn),
    onSuccess: (result) => {
      toast.success(result.data.message);
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
  return mutate;
};

export const useVerifySelfie = () => {
  const mutate = useMutation({
    mutationFn: (data: any) => selfie(data.userId, data.selfieUrl),
    onSuccess: (result) => {
      toast.success(result.data.message);
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
  return mutate;
};
