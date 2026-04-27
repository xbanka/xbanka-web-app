"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { tokenStore } from "@/store/token.store";

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
    // store token securely
    // Cookies.set("access_token", token, {
    //   expires: 7, // days
    //   sameSite: "lax",
    //   // secure: process.env.NODE_ENV === "production",
    //   secure: true,
    // });

    router.replace("/");
  }, [params, router]);
  // useEffect(() => {
  //   const initAuth = async () => {
  //     try {
  //       // call backend — refresh token cookie is automatically sent
  //       const res = await axios.get("/auth/refresh", {
  //         withCredentials: true,
  //       });

  //       const accessToken = res.data.accessToken;

  //       tokenStore.set(accessToken);

  //       router.replace("/");
  //     } catch (err) {
  //       router.replace("/sign-in");
  //     }
  //   };

  //   initAuth();
  // }, [router]);

  return <p>Signing you in...</p>;
}