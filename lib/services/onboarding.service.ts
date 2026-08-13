import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  address,
  getLivenessSessionStatus,
  identity,
  initiateLivenessSession,
  profile,
  selfie,
  skipStep,
  verifyBvn,
} from "../actions/onboarding";
import { handleApiError } from "../errors/error";
import { toast } from "sonner";
import { apiMessage } from "../toastMessage";
import { profilePayload, verifyBvnPayload } from "../types/onboarding-types";

export const useUserProfile = () => {
  const queryClient = useQueryClient();
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
      toast.success(apiMessage(result, "Profile saved"));
      queryClient.invalidateQueries({
        queryKey: ["user-profile"],
      });
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
  return mutate;
};

export const useSkipStep = () => {
  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationFn: (data: string) => skipStep(data),
    onSuccess: (result) => {
      toast.success(apiMessage(result, "Step skipped"));
      queryClient.invalidateQueries({ queryKey: ["verification-status"] });
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
  return mutate;
};

export const useVerifyBvn = () => {
  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationFn: (data: verifyBvnPayload) => verifyBvn(data.userId, data.bvn),
    onSuccess: (result) => {
      toast.success(apiMessage(result, "BVN verified"));
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      queryClient.invalidateQueries({ queryKey: ["verification-status"] });
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
  return mutate;
};

export const useIdentity = () => {
  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationFn: (formData: FormData) => identity(formData),
    onSuccess: (result) => {
      toast.success(apiMessage(result, "Identity document submitted"));
      queryClient.invalidateQueries({ queryKey: ["verification-status"] });
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
  return mutate;
};

export const useAddressProof = () => {
  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationFn: (formData: FormData) => address(formData),
    onSuccess: (result) => {
      toast.success(apiMessage(result, "Proof of address submitted"));
      queryClient.invalidateQueries({ queryKey: ["verification-status"] });
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
  return mutate;
};

export const useVerifySelfie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => selfie(formData),

    onSuccess: (result) => {
      toast.success(apiMessage(result, "Selfie verified"));
      queryClient.invalidateQueries({ queryKey: ["verification-status"] });
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },

    onError: (err) => {
      handleApiError(err);
    },
  });
};

export const useInitiateLivenessSession = () => {
  return useMutation({
    mutationFn: (userId: string) => initiateLivenessSession(userId),
    onError: (err) => {
      handleApiError(err);
    },
  });
};

export const useLivenessSessionStatus = (
  sessionId: string | undefined,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ["liveness-session-status", sessionId],
    queryFn: () => getLivenessSessionStatus(sessionId as string),
    enabled: !!sessionId && enabled,
    refetchInterval: (query) => {
      const status = query.state.data?.data?.status;
      return status === "PENDING" ? 3000 : false;
    },
  });
};
