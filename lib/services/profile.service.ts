import { useMutation, useQuery } from "@tanstack/react-query";
import { UpdateProfileData, UserProfileTypes } from "../types/profile-types";
import { updateProfile, UserProfile } from "../actions/profile";
import { toast } from "sonner";
import { handleApiError } from "../errors/error";
import { useUserStore } from "@/store/user.store";

export const userProfile = () => {
  const userData = useUserStore((state) => state.setUser);
  const mutate = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      try {
        const response = await UserProfile();
        console.log("profile response", response);
        userData(response);
        return response;
      } catch (err) {
        handleApiError(err);
      }
    },
  });
  return mutate;
};

export const useUpdateProfile = () => {
  const userData = useUserStore((state) => state.updateUser);
  const mutate = useMutation({
    mutationFn: (data: UpdateProfileData) => updateProfile(data),
    onSuccess: (result) => {
      toast.success(result?.message);
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
  return mutate;
};
