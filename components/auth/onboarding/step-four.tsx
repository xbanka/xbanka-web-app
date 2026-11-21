"use client";

import { useRouter } from "next/navigation";
import LivenessDetector from "../../ui/LivenessDetector";
import { LivenessQrPanel } from "@/components/ui/liveness-qr-panel";
import { useIsMobileDevice } from "@/hooks/use-IsMobileDevice";
import { useSkipStep } from "@/lib/services/onboarding.service";
import { useUserIdStore } from "@/store/verify-id.store";
import { ErrorField } from "@/components/ui/field-error";
import { ChevronLeft, Glasses, ScanFace, Sun } from "lucide-react";

const TIPS = [
  { icon: Sun, label: "Good light" },
  { icon: Glasses, label: "No glasses or hats" },
  { icon: ScanFace, label: "Fill the oval" },
];

interface Step4Props {
  setStep: (n: number) => void;
  step: number;
}

function Step4({ setStep }: Step4Props) {
  const router = useRouter();

  const isMobileDevice = useIsMobileDevice();

  const {
    isPending: skipPending,
    error: skipError,
    mutate: skipMutate,
  } = useSkipStep();
  const userId = useUserIdStore((s) => s.userId);

  const handleSkip = () => {
    skipMutate(userId, {
      onSuccess: () => {
        router.push("/welcome");
      },
    });
  };

  const header = (
    <>
      <button
        type="button"
        onClick={() => setStep(1)}
        className="mb-4 inline-flex items-center gap-1 text-sm text-text hover:text-card-text"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </button>
      <div className="mb-5 space-y-2">
        <h1 className="font-display text-[28px] font-bold leading-9 tracking-[-0.03em] text-card-text sm:text-[30px]">
          Take a quick selfie
        </h1>
        <p className="text-[15px] leading-6 text-text">
          {isMobileDevice
            ? "We match your face to the photo on your ID. It’s only used to verify you."
            : "Your computer may not have a good front camera, so finish this step on your phone: scan the code with its camera."}
        </p>
      </div>
      <ul className="mb-5 flex flex-wrap gap-2">
        {TIPS.map(({ icon: Icon, label }) => (
          <li
            key={label}
            className="flex h-9 items-center gap-2 rounded-md border border-border bg-input-background px-3 text-[13px] text-card-text"
          >
            <Icon className="h-4 w-4 text-Green" />
            {label}
          </li>
        ))}
      </ul>
    </>
  );

  const skip = (
    <div className="space-y-1">
      <button
        type="button"
        onClick={handleSkip}
        disabled={skipPending}
        className="h-11 w-full text-sm font-medium text-card-text hover:text-Green disabled:opacity-60"
      >
        {skipPending ? "Skipping…" : "Skip for now"}
      </button>
      {skipError && (
        <ErrorField message={skipError?.message || "An error occurred while skipping the step."} />
      )}
    </div>
  );

  if (!isMobileDevice) {
    return (
      <div className="flex flex-1 flex-col">
        {header}
        <div className="flex justify-center rounded-lg border border-border bg-input-background p-6">
          <LivenessQrPanel userId={userId} onCompleted={() => router.push("/welcome")} />
        </div>
        <div className="mt-4">{skip}</div>
      </div>
    );
  }

  return (
    <div className="max-sm:flex max-sm:min-h-0 max-sm:flex-1 max-sm:flex-col">
      {header}
      <div className="flex min-h-0 flex-1 flex-col gap-4">
        <LivenessDetector
          userId={userId}
          onBack={() => setStep(1)}
          onSuccess={() => router.push("/welcome")}
          brandColor="#36b6ab"
        />
        {skip}
      </div>
    </div>
  );
}

export default Step4;
