"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import LivenessDetector from "@/components/ui/LivenessDetector";
import { useLivenessSessionStatus } from "@/lib/services/onboarding.service";

export default function MobileLivenessPage() {
  const params = useParams<{ sessionId: string }>();
  const searchParams = useSearchParams();
  const sessionId = params.sessionId;
  const userId = searchParams.get("uid") ?? "";

  const [done, setDone] = useState(false);

  const { data: statusData, isLoading } = useLivenessSessionStatus(
    sessionId,
    !done,
  );
  const status = statusData?.data?.status;

  if (done || status === "COMPLETED") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
        <CheckCircle2 className="h-12 w-12 text-Green" />
        <h1 className="text-xl font-semibold text-card-text">
          Success! Your selfie has been verified.
        </h1>
        <p className="text-sm text-text">
          You can now close this tab and return to your computer.
        </p>
      </div>
    );
  }

  if (status === "FAILED") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-xl font-semibold text-card-text">
          This link has expired
        </h1>
        <p className="text-sm text-text">
          Please go back to your computer and generate a new QR code.
        </p>
      </div>
    );
  }

  if (!userId || isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <p className="text-sm text-text">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col justify-center px-6 py-10">
      <LivenessDetector
        userId={userId}
        sessionId={sessionId}
        hideBack
        hideSkip
        onSuccess={() => setDone(true)}
        brandColor="#36b6ab"
      />
    </div>
  );
}
