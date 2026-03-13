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
      // store token if needed
      router.push("/dashboard");
    } else {
      router.push("/sign-in");
    }
  }, [params, router]);

  return <p>Signing you in...</p>;
}