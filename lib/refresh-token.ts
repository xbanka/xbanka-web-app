import axios from "axios";
import { tokenStore } from "@/store/token.store";
import { authTokens } from "./authToken";

let refreshPromise: Promise<string> | null = null;

export async function refreshAccessToken(): Promise<string> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const refreshToken = authTokens.getRefreshToken();

    // DIAGNOSTIC: a missing refresh token guarantees a failed refresh and a
    // forced sign-out. Surface it explicitly during investigation.
    if (!refreshToken) {
      console.error("[auth] refreshAccessToken: no refresh token in storage");
    }

    let data;
    try {
      ({ data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
        {
          refresh_token: refreshToken,
        },
      ));
    } catch (err) {
      const status = (err as { response?: { status?: number } })?.response
        ?.status;
      const body = (err as { response?: { data?: unknown } })?.response?.data;
      console.error("[auth] /auth/refresh failed", { status, body });
      throw err;
    }

    authTokens.setTokens(data.access_token, data.refresh_token);
    tokenStore.set(data.access_token);

    if (typeof document !== "undefined") {
      document.cookie = `accessToken=${data.access_token}; path=/`;
    }

    return data.access_token;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}
