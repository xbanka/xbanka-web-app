import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UpdateProfileData, UserProfileTypes } from "../types/profile-types";
import { updateAvatar, updateProfile, UserProfile, VerificationStatus } from "../actions/profile";
import { toast } from "sonner";
import { handleApiError } from "../errors/error";
import { useUserStore } from "@/store/user.store";

export const UseProfileUser = () => {
  const userData = useUserStore((state) => state.setUser);
  const mutate = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      try {
        const response = await UserProfile();
        userData(response.data);
        return response;
      } catch (err) {
        handleApiError(err);
      }
    },
    staleTime: 1000 * 60 * 5, // 5 mins
    gcTime: 1000 * 60 * 10, // optional
    retry: 1,
  });
  return mutate;
};

export const useUpdateAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => updateAvatar(file),

    onSuccess: (data) => {
      // refresh user profile
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
  });
};

export const UseVerificationStatus = () => {
  const mutate = useQuery({
    queryKey: ["verification-status"],
    queryFn: async () => {
      try {
        const response = await VerificationStatus();
        return response;
      } catch (err) {
        handleApiError(err);
      }
    },
    staleTime: 1000 * 60 * 5, // 5 mins
    gcTime: 1000 * 60 * 30, // 30 mins
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  return mutate;
};

export const useUpdateProfile = () => {
  const updateUser = useUserStore((state) => state.updateUser);
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: (data: UpdateProfileData) => updateProfile(data),
    onSuccess: (result, variables) => {
      toast.success(result?.message);
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      updateUser({
        ...variables,
        avatarUrl: result?.data?.profilePicture, // if backend returns it
      });
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
  return mutate;
};
