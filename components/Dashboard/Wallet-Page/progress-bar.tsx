import { SendStep } from "./types";
import { STEP_LABELS, STEP_MAP, TOTAL_STEPS } from "./wallet-mock-data";


export function ProgressBar({ step }: { step: SendStep }) {
  const current = STEP_MAP[step] ?? 0;
  if (!current) return null;
  return (
    <div className="pt-3 pb-1">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-input">
        <div
          className="h-full rounded-full bg-Green transition-all duration-400"
          style={{ width: `${(current / TOTAL_STEPS) * 100}%` }}
        />
      </div>
      <div className="mt-3 flex items-center justify-between max-sm:mt-2">
        <span className="text-[16px] font-medium leading-5 text-card-text max-sm:text-[13px]">
          {STEP_LABELS[step]}
        </span>
        <span className="text-[16px] font-normal leading-5 text-text max-sm:text-[13px]">
          {current} of {TOTAL_STEPS}
        </span>
      </div>
    </div>
  );
}