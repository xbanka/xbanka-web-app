import { SendStep } from "./types";
import { STEP_LABELS, STEP_MAP, TOTAL_STEPS } from "./wallet-mock-data";


export function ProgressBar({ step }: { step: SendStep }) {
  const current = STEP_MAP[step] ?? 0;
  if (!current) return null;
  return (
    <div className="space-y-1.5 pt-3 pb-1">
      <div className="w-full h-1 bg-border rounded-full overflow-hidden">
        <div className="h-full bg-Green rounded-full transition-all duration-400"
          style={{ width: `${(current / TOTAL_STEPS) * 100}%` }} />
      </div>
      <div className="flex items-center justify-between text-[10px] text-text">
        <span>{STEP_LABELS[step]}</span>
        <span>{current} of {TOTAL_STEPS}</span>
      </div>
    </div>
  );
}