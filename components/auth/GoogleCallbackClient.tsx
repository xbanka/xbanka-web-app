"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserStore } from "@/store/user.store";
import Cookies from "js-cookie";

export default function GoogleCallbackClient() {
  const router = useRouter();
  const params = useSearchParams();
  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    const token = params.get("token");
    console.log("Received token:", token); // Debug log

    if (!token) {
      router.replace("/sign-in");
      return;
    }

    // store token securely
    Cookies.set("access_token", token, {
      expires: 7, // days
      sameSite: "lax",
      // secure: process.env.NODE_ENV === "production",
      secure: true,
    });

    router.replace("/");
  }, [params, router]);

  return <p>Signing you in...</p>;
}