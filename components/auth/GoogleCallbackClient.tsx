"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserStore } from "@/store/user.store";

export default function GoogleCallbackClient() {
  const router = useRouter();
  const params = useSearchParams();
  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
    //   router.push("https://app.xbankang.com");

    window.location.href = process.env.NEXT_PUBLIC_DASHBOARD_URL!;
    } else {
      router.push("/sign-in");
    }
  }, [params, router]);

  return <p>Signing you in...</p>;
}