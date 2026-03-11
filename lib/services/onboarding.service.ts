import { useMutation, useQuery } from "@tanstack/react-query";
import { address, identity, profile, selfie, verifyBvn } from "../actions/onboarding";
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

export const useIdentity = () => {
  const mutate = useMutation({
    mutationFn: (formData: FormData) => identity(formData),
    onSuccess: (result) => {
      toast.success(result.data.message);
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
  return mutate;
};

 

export const useAddressProof = () => {
  const mutate = useMutation({
    mutationFn: (formData: FormData) => address(formData),
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
  return useMutation({
    mutationFn: (formData: FormData) => selfie(formData),

    onSuccess: (result) => {
      toast.success(result.data.message);
    },

    onError: (err) => {
      handleApiError(err);
    },
  });
};