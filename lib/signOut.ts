import { authTokens } from "@/lib/authToken";
import { tokenStore } from "@/store/token.store";
import { forgetPushOnSignOut, setAppBadge } from "@/lib/push/push-notifications";

/** Forgets this device's session. The caller sends the user to sign-in. */
export const clearSession = () => {
  // Before the token goes: stop this account's pushes reaching this device.
  forgetPushOnSignOut(authTokens.getAccessToken());
  setAppBadge(0);
  tokenStore.clear();
  authTokens.clear();
  document.cookie = "accessToken=; Max-Age=0; path=/";
};
