"use client";
import { useState } from "react";
import Step2 from "./step-two";
import Step3 from "./step-three";
import Step4 from "./step-four";
import Step5 from "./step-five";
import { Card } from "../../ui/FormCard";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/** Short names for the progress strip. */
const STEP_NAMES = ["BVN", "ID document", "Selfie"];

const STEPS = [
  { label: "BVN Verification" },
  { label: "Identity Verification" },
  { label: "Selfie Verification" },
  // { label: "Proof of Address" },
];

export default function OnboardingForm() {
  const [step, setStep] = useState(0);

  // Personal details are collected at sign-up, so KYC starts at BVN.
  const TOTAL = STEPS.length;

  // const StepComponents = [Step1, Step2, Step3, Step4, Step5];
  const StepComponents = [Step2, Step3, Step4];
  const StepComp = StepComponents[step];

  return (
    <div className="mx-auto w-full max-w-[480px] max-sm:flex max-sm:min-h-dvh max-sm:max-w-none max-sm:flex-col max-sm:bg-background">
      {/* Progress: the three checks by name, the current one highlighted */}
      <div className="mb-6 space-y-3 max-sm:mb-0 max-sm:px-5 max-sm:pt-8 max-sm:pb-6">
        <div className="flex items-center justify-between text-xs text-text">
          <span className="sr-only">{STEPS[step]?.label}</span>
          <span aria-hidden="true" />
          <span>
            Step {step + 1} of {TOTAL}
          </span>
        </div>
        <ol className="flex items-center justify-between gap-2 rounded-lg border border-teal-border bg-teal-light px-3.5 py-3">
          {STEP_NAMES.map((name, i) => (
            <li
              key={name}
              aria-current={i === step ? "step" : undefined}
              className={cn(
                "flex items-center gap-2 text-xs sm:text-[13px]",
                i === step ? "font-semibold text-card-text" : "text-teal-text",
              )}
            >
              <span
                className={cn(
                  "grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px]",
                  i < step
                    ? "bg-teal-border text-white"
                    : i === step
                      ? "bg-Green text-white"
                      : "border border-teal-border",
                )}
              >
                {i < step ? <Check className="h-3 w-3" strokeWidth={3} /> : i + 1}
              </span>
              {name}
            </li>
          ))}
        </ol>
      </div>

      {/* Card */}
      <Card className="text-left max-sm:min-h-0 max-sm:flex-1 max-sm:justify-start max-sm:space-y-0 max-sm:border-0 max-sm:bg-background max-sm:px-5 max-sm:py-0 lg:border-0 lg:bg-transparent lg:p-0">
        {StepComp && <StepComp step={step} setStep={setStep} />}
      </Card>
    </div>
  );
}
