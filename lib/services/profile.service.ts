import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UpdateProfileData, UserProfileTypes } from "../types/profile-types";
import { updateProfile, UserProfile, VerificationStatus } from "../actions/profile";
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
  });
  return mutate;
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
      console.log(result, variables);
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
