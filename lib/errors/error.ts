import { toast } from "sonner";
import { ApiError } from "../types/error-types";

export function handleApiError(
  error: unknown,
  options?: { showToast?: boolean },
): never {
  const err = error as ApiError & { silent?: boolean };

  const shouldShowToast = options?.showToast ?? !err.silent;

  if (shouldShowToast) {
    toast.error(err.message || "Something went wrong", {
      duration: 3000,
    });
  }

  throw err;
}
