import { toast } from "sonner";
import { ApiError } from "../types/error-types";

export function handleApiError(error: unknown): ApiError {
  const err = error as ApiError;

  toast.error(err.message || "Something went wrong", {
    duration: 3000,
  });

  throw err;
}
