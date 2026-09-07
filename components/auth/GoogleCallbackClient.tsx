"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { tokenStore } from "@/store/token.store";
import { authTokens } from "@/lib/authToken";
import { PageLoader } from "@/components/ui/page-loader";

export default function GoogleCallbackClient() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get("token");

    if (!token) {
      router.replace("/sign-in");
      return;
    }
    tokenStore.set(token);
    localStorage.setItem("accessToken", token);
    authTokens.setTokens(token);
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
