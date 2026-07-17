"use client";

import { useRouter } from "next/navigation";
import LivenessDetector from "../../ui/LivenessDetector";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobileDevice } from "@/hooks/use-IsMobileDevice";
import { useSkipStep } from "@/lib/services/onboarding.service";
import { UseProfileUser } from "@/lib/services/profile.service";
import { ErrorField } from "@/components/ui/field-error";

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
  const { data: profileData } = UseProfileUser();
  const userId = profileData?.data?.userId;

  const handleSkip = () => {
    skipMutate(userId, {
      onSuccess: () => {
        router.push("/welcome");
      },
    });
  };

  if (!isMobileDevice) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center text-center space-y-6">
        <div className="rounded-2xl border border-border bg-card-background p-6 w-full">
          <Camera className="mx-auto h-12 w-12 text-text" />

          <h2 className="mt-4 text-xl font-semibold text-card-text">
            Mobile Device Required
          </h2>

          <p className="mt-2 text-text">
            Selfie verification can only be completed on a mobile device with a
            front-facing camera.
          </p>

          <p className="mt-2 text-sm text-text">
            Please continue this step on your phone.
          </p>
        </div>
        <div className="flex flex-col gap-4 mt-1 md:flex-row max-sm:mt-0 max-sm:grid max-sm:grid-cols-[126px_1fr] max-sm:gap-3.5 w-full">
          <Button
            variant="outline"
            className="flex-1 max-sm:h-[50px] max-sm:text-[16px]"
            onClick={() => setStep(2)}
          >
            Back
          </Button>
          <Button
            size="lg"
            className="hidden flex-3 sm:inline-flex"
            onClick={handleSkip}
            disabled={skipPending}
          >
            {skipPending ? "Skipping..." : "Skip for later"}
          </Button>
          <Button
            size="lg"
            className="h-[50px] text-[16px] sm:hidden"
            onClick={handleSkip}
            disabled={skipPending}
          >
            {skipPending ? "Skipping..." : "Skip for later"}
          </Button>
        </div>
        {
          skipError && (
            <ErrorField message={skipError?.message || "An error occurred while skipping the step."} />
          )
        }
      </div>
    );
  }

  return (
    <div className="max-sm:flex max-sm:min-h-0 max-sm:flex-1 max-sm:flex-col">
      <div className="text-center space-y-2 max-sm:mb-6 max-sm:text-left">
        <h1 className="text-[26px] font-bold text-card-text leading-tight max-sm:text-[34px] max-sm:leading-10">
          Almost Done!
          <br />
          Let&apos;s take a Selfie
        </h1>
        <p className="text-sm text-text leading-relaxed max-sm:text-[18px] max-sm:leading-7">
          We&apos;ll match your photo with your ID to confirm it&apos;s really
          you.
        </p>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-4">
        <LivenessDetector
          onBack={() => setStep(2)}
          onSuccess={() => router.push("/welcome")}
          brandColor="#36b6ab"
        />
      </div>
    </div>
  );
}

export default Step4;
