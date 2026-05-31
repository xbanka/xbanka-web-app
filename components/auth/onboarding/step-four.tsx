"use client";

import LivenessDetector from "../../ui/LivenessDetector";

interface Step4Props {
  setStep: (n: number) => void;
  step: number;
}

function Step4({ setStep }: Step4Props) {
  return (
    <div className="max-sm:flex max-sm:min-h-0 max-sm:flex-1 max-sm:flex-col">
      <div className="text-center space-y-2 max-sm:mb-6 max-sm:text-left">
        <h1 className="text-[26px] font-bold text-card-text leading-tight max-sm:text-[34px] max-sm:leading-10">
          Almost Done!
          <br />
          Let&apos;s take a Selfie
        </h1>
        <p className="text-sm text-text leading-relaxed max-sm:text-[18px] max-sm:leading-7">
          We&apos;ll match your photo with your ID to confirm it&apos;s really you.
        </p>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-4">
        <LivenessDetector
          onBack={() => setStep(2)}
          onSuccess={() => setStep(4)}
          brandColor="#36b6ab"
        />
      </div>
    </div>
  );
}

export default Step4;
