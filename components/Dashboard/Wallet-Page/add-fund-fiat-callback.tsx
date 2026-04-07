"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { UseVerifyFund } from "@/lib/services/wallet.service";

export default function FundCallbackPage() {
  const params = useSearchParams();
  const router = useRouter();

  const reference = params?.get("reference");
  console.log("reference", reference)

  const { mutate } = UseVerifyFund();

  const [status, setStatus] = useState<
    "loading" | "success" | "failed"
  >("loading");

  useEffect(() => {
    if (!reference) {
      setStatus("failed");
      return;
    }

    mutate(reference, {
      onSuccess: () => {
        setStatus("success");

        // 🔥 delay redirect so user sees success
        setTimeout(() => {
          router.push("/wallet");
        }, 2500);
      },
      onError: () => {
        setStatus("failed");
      },
    });
  }, [reference]);

  return (
    <div className="flex items-center justify-center h-screen">
      {status === "loading" && (
        <p className="text-lg">Confirming your payment...</p>
      )}

      {status === "success" && (
        <div className="text-center">
          <h2 className="text-green-600 text-xl font-bold">
            Payment Successful 🎉
          </h2>
          <p>Redirecting to wallet...</p>
        </div>
      )}

      {status === "failed" && (
        <div className="text-center">
          <h2 className="text-red-600 text-xl font-bold">
            Payment Failed ❌
          </h2>
        </div>
      )}
    </div>
  );
}