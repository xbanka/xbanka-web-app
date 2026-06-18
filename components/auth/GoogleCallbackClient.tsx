"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { tokenStore } from "@/store/token.store";
import { authTokens } from "@/lib/authToken";

export default function GoogleCallbackClient() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get("token");
    console.log("Received token:", token); // Debug log

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

  return <p>Signing you in...</p>;
}
