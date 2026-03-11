"use client";

import { useVerifySelfie } from "@/lib/services/onboarding.service";
import { useUserStore } from "@/store/verify-id.store";
import LivenessDetector from "../ui/LivenessDetector";
import { base64ToFile } from "@/lib/base64ToFile";

interface Step4Props {
  setStep: (n: number) => void;
  step: number;
}

function Step4({ setStep }: Step4Props) {

  return (
    <>
      <div className="text-center space-y-2">
        <h1 className="text-[26px] font-bold text-card-text leading-tight">
          Almost Done!
          <br />
          Let's take a Selfie
        </h1>
        <p className="text-sm text-text leading-relaxed">
          We'll match your photo with your ID to confirm it's really you.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <LivenessDetector
          setStep={setStep}
          brandColor="#36b6ab"
        />
        <p className="text-xs text-text text-center">
          Good lighting. Neutral background. No hats or glasses.
        </p>
      </div>
    </>
  );
}

export default Step4;
