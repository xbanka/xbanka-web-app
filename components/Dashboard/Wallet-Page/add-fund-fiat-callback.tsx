"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { UseVerifyFund } from "@/lib/services/wallet.service";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/spinner";
import { LucideArrowLeftRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function FundCallbackPage() {
  const params = useSearchParams();
  const router = useRouter();

  const reference = params?.get("paymentReference");

  const { mutate, error, isSuccess } = UseVerifyFund();

  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    "loading",
  );

  useEffect(() => {
    if (!reference) return;

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
  }, [reference, mutate, router]);

  if (isSuccess || status === "success")
  return (
    <div className="flex items-center justify-center h-screen">
      <Modal className="pt-6 space-y-6" onClose={() => {}}>
        {isSuccess && (
          <div className="text-center space-y-6">
            <Image
              className="mx-auto flex justify-center"
              src="/badge 2.svg"
              alt="badge"
              width={60}
              height={60}
            />
            <div className="space-y-2">
              <h2 className="text-Green text-xl font-bold">
                Payment Successful
              </h2>
              <p>Redirecting to wallet...</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );

  if(error || status === "failed") {
    return (
      <div className="flex items-center justify-center h-screen">
        <Modal className="pt-6 space-y-6" onClose={() => {}}>
            <div className="text-center space-y-6">
              <p className="text-2xl">❌</p>
              <h2 className="text-error-text text-xl font-bold">
                {error?.message || "Payment Failed"}
              </h2>
              <Button onClick={() => router.push("/wallet")} className="w-full">
                View Wallet
              </Button>
            </div>
        </Modal>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <Modal className="pt-6 space-y-6" onClose={() => {}}>
        <div className="text-center">
          <div className="flex justify-center items-center mb-6">
            <Spinner icon={LucideArrowLeftRight} size={52} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold leading-8 text-card-text">
              Confirming your payment...
            </h3>
            <p className="text-base font-normal leading-6 text-text">
              This usually takes a few seconds. Please don't close this window
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
