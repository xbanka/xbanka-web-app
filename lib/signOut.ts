import { authTokens } from "@/lib/authToken";
import { tokenStore } from "@/store/token.store";

/** Forgets this device's session. The caller sends the user to sign-in. */
export const clearSession = () => {
  tokenStore.clear();
  authTokens.clear();
  document.cookie = "accessToken=; Max-Age=0; path=/";
};
