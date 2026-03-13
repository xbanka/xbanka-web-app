"use client";
import { useState } from "react";
import Step1 from "./step-one";
import Step2 from "./step-two";
import Step3 from "./step-three";
import Step4 from "./step-four";
import Step5 from "./step-five";
import { Card } from "../../ui/Card";

const STEPS = [
  { label: "Basic Information" },
  { label: "BVN Verification" },
  { label: "Identity Verification" },
  { label: "Selfie Verification" },
  { label: "Proof of Address" },
];

export default function OnboardingForm() {
  const [step, setStep] = useState(4);

  const TOTAL = 5;
  const progress = ((step + 1) / TOTAL) * 100;

  const StepComponents = [Step1, Step2, Step3, Step4, Step5];
  const StepComp = StepComponents[step];

  return (
    <div className="">
      {/* Progress */}
      <div className="w-full mx-auto max-w-175 mb-8 space-y-2">
        <div className="w-full h-4 bg-border rounded-full overflow-hidden mb-2.5">
          <div
            className="h-full bg-Green rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[16px] font-normal leading-6 text-card-text">
            {STEPS[step]?.label}
          </span>
          <span className="text-[14px] font-normal leading-6 text-text">
            {step + 1} of {TOTAL}
          </span>
        </div>
      </div>

      {/* Card */}
      <Card>
          {StepComp && <StepComp step={step} setStep={setStep} />}
      </Card>
    </div>
  );
}
