import { useMutation } from "@tanstack/react-query";
import AxiosInstance from "../AxiosInstance/AxiosInstance";
import type { SupportRequestBody } from "../support/support-request";

/** Thrown shape from AxiosInstance's response interceptor. */
export type SupportSendError = { status?: number; message?: string };

/**
 * Sends a support request to our own /api/support route, which emails it to
 * the support inbox. It goes through AxiosInstance (with the base URL
 * cleared, so it hits this app rather than the backend) to reuse the
 * session token and the refresh-on-401 handling.
 */
export const sendSupportRequest = async (body: SupportRequestBody) => {
  const response = await AxiosInstance.post("/api/support", body, {
    baseURL: "",
    timeout: 20000,
  });
  return response.data as { ok: true };
};

export const UseSendSupportRequest = () =>
  useMutation<{ ok: true }, SupportSendError, SupportRequestBody>({
    mutationFn: sendSupportRequest,
  });
