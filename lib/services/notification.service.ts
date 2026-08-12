import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  readAllNotifications,
  readSingleNotification,
} from "../actions/notifications";
import { handleApiError } from "../errors/error";
import { toast } from "sonner";
import { apiMessage } from "../toastMessage";

export const UseGetNotifications = () => {
  return useQuery({
    queryKey: ["get-notifications"],
    queryFn: async () => {
      try {
        const response = await getNotifications();
        return response;
      } catch (err) {
        handleApiError(err);
      }
    },
  });
};

export const useReadAllNotifications = () => {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: () => readAllNotifications(),
    onSuccess: (result) => {
      toast.success(apiMessage(result, "All notifications marked as read"));
      queryClient.invalidateQueries({
        queryKey: ["get-notifications"],
      });
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
  return mutate;
};

export const useReadSingleNotification = () => {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: (data: string) => readSingleNotification(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: ["get-notifications"],
      });
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
  return mutate;
};
