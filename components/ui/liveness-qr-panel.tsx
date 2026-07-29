"use client";

import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { QrCode } from "lucide-react";
import { Button } from "./button";
import { ErrorLayout } from "./error-layout";
import {
  useInitiateLivenessSession,
  useLivenessSessionStatus,
} from "@/lib/services/onboarding.service";

export function LivenessQrPanel({
  userId,
  onCompleted,
}: {
  userId: string;
  onCompleted: () => void;
}) {
  const [sessionId, setSessionId] = useState<string | null>(null);

  const {
    mutate: initiate,
    isPending: isInitiating,
    error: initiateError,
  } = useInitiateLivenessSession();

  const { data: statusData } = useLivenessSessionStatus(
    sessionId ?? undefined,
  );
  const status = statusData?.data?.status;

  const startSession = () => {
    if (!userId) return;
    setSessionId(null);
    initiate(userId, {
      onSuccess: (result) => {
        console.log("session id :", result?.data?.data?.sessionId)
        setSessionId(result?.data?.data?.sessionId);
      },
    });
  };

  useEffect(() => {
    startSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (status === "COMPLETED") {
      onCompleted();
    }
  }, [status, onCompleted]);

  const qrUrl =
    sessionId && typeof window !== "undefined"
      ? `${window.location.origin}/onboarding/liveness/${sessionId}?uid=${encodeURIComponent(userId)}`
      : "";
  console.log("qrUrl", qrUrl);

  if (status === "FAILED") {
    return (
      <div className="rounded-2xl border border-border bg-card-background p-6 w-full text-center space-y-4">
        <p className="text-sm text-text">
          This QR code has expired. Generate a new one to continue.
        </p>
        <Button onClick={startSession} disabled={isInitiating}>
          {isInitiating ? "Generating..." : "Generate New QR Code"}
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card-background p-6 w-full flex flex-col items-center space-y-4">
      {isInitiating || !qrUrl ? (
        <div className="h-full w-[180px] flex items-center justify-center">
          <QrCode className="h-full w-full text-text animate-pulse" />
        </div>
      ) : (
        <div className="bg-white p-3 rounded-xl">
          <QRCode value={qrUrl} size={180} />
        </div>
      )}
      <p className="text-sm text-text text-center">
        Scan this QR code with your phone to take your selfie. This screen
        will update automatically once you&apos;re done.
      </p>
      {initiateError && <ErrorLayout message={initiateError?.message} />}
    </div>
  );
}
