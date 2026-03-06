"use client"
import { useState } from "react";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import Step1 from "./step-one";
import Step2 from "./step-two";
import Step3 from "./step-three";
import Step4 from "./step-four";
import Step5 from "./step-five";
import { Card } from "../ui/Card";

const STEPS = [
  { label: "Basic Information" },
  { label: "BVN Verification" },
  { label: "Identity Verification" },
  { label: "Selfie Verification" },
  { label: "Proof of Address" },
];

const STEP_FIELDS = [
  ["name", "dob", "phone", "gender", "country"],
  ["bvn"],
  ["idType", "idNumber"],
  [], // selfie — no RHF fields
  ["address", "poaCountry", "state", "docType"],
];

export default function OnboardingForm() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const { register, trigger, control, formState: { errors }, handleSubmit } = useForm({
    mode: "onTouched",
  });

  const TOTAL = 5 

  const progress = ((step + 1) / TOTAL) * 100;
  const isSelfieStep = step === 3;

  const handleNext = async () => {
    const fields = STEP_FIELDS[step];
    const valid = fields.length === 0 || await trigger(fields);
    if (!valid) return;
    step < TOTAL - 1 ? setStep((s) => s + 1) : setDone(true);
  };

  const onSubmit = () => setDone(true);

  const stepProps = { register, errors, control, ...(isSelfieStep ? { onSkip: handleNext } : {}) };

  const StepComponents = [Step1, Step2, Step3, Step4, Step5];
  const StepComp = StepComponents[step];

  if (done) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-lg bg-card-background border border-border rounded-2xl p-14 flex flex-col items-center gap-5 text-center">
          <div className="w-16 h-16 rounded-full bg-Green flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-card-text">You're all set! 🎉</h2>
          <p className="text-sm text-text leading-relaxed">Your XBanka account is being verified. We'll notify you once it's ready.</p>
          <button
            onClick={() => { setStep(0); setDone(false); }}
            className="mt-2 px-10 h-12 rounded-xl bg-Green text-white text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
          >
            Back to Start
          </button>
        </div>
      </div>
    );
  }

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
          <span className="text-[16px] font-normal leading-6 text-card-text">{STEPS[step].label}</span>
          <span className="text-[14px] font-normal leading-6 text-text">{step + 1} of {TOTAL}</span>
        </div>
      </div>

      {/* Card */}
      <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="">
          <StepComp {...stepProps} />

          {!isSelfieStep && (
            <div className="flex flex-col gap-2.5 mt-1">
              <Button
                type={step === TOTAL - 1 ? "submit" : "button"}
                onClick={step === TOTAL - 1 ? undefined : handleNext}
              >
                {step === TOTAL - 1 ? "Submit" : "Continue"}
              </Button>
              <Button onClick={handleNext} />
            </div>
          )}
        </div>
      </form>
      </Card>
    </div>
  );
}