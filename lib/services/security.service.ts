import { useMutation } from "@tanstack/react-query";
import { createPin } from "../actions/security";
import { toast } from "sonner";
import { handleApiError } from "../errors/error";
import { CreatePinPayload } from "../types/security-types";

export const useCreatePin = () => {
    const mutate = useMutation({
    mutationFn: (data: CreatePinPayload) => createPin(data),
    onSuccess: (result) => {
      toast.success(result.data.message);
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
  return mutate;
}