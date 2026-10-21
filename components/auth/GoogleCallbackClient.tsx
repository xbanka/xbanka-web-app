"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { tokenStore } from "@/store/token.store";
import { authTokens } from "@/lib/authToken";
import { PageLoader } from "@/components/ui/page-loader";

export default function GoogleCallbackClient() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    // The backend documents this redirect as carrying `access_token`; earlier
    // builds sent `token`. Accept both so a rename on the backend does not
    // bounce every Google sign-in straight back to /sign-in.
    const token = params.get("token") ?? params.get("access_token");
    // Keep the refresh token when the backend sends one. Without it the first
    // 401 makes the Axios interceptor's refresh fail and force a sign-out,
    // which is what "logged in, then logged out immediately" looks like.
    const refreshToken =
      params.get("refresh_token") ?? params.get("refreshToken") ?? undefined;

    if (!token) {
      router.replace("/sign-in");
      return;
    }

    authTokens.setTokens(token, refreshToken);
    tokenStore.set(token);
    document.cookie = `accessToken=${token}; path=/`;

    router.replace("/");
  }, [params, router]);

  return (
    <PageLoader
      title="Signing you in..."
      description="Hang tight while we finish setting up your session."
    />
  );
}
