import { SendStep } from "./types";
import { STEP_LABELS, STEP_MAP, TOTAL_STEPS } from "./wallet-mock-data";

// Either a Send Crypto `step`, or an explicit position for flows with their
// own steps (Add wallet).
type ProgressBarProps =
  | {
      step: SendStep;
      /** Sending to a saved wallet: its network is fixed, so that step is skipped. */
      skipNetwork?: boolean;
      current?: never;
      total?: never;
      label?: never;
    }
  | {
      step?: never;
      skipNetwork?: never;
      current: number;
      total: number;
      label: string;
    };

const NETWORK_POSITION = STEP_MAP.select_network ?? 3;

export function ProgressBar({
  step,
  skipNetwork,
  current,
  total,
  label,
}: ProgressBarProps) {
  let position = current ?? 0;
  let of = total ?? 0;
  let text = label;
  if (step) {
    position = STEP_MAP[step] ?? 0;
    of = TOTAL_STEPS;
    text = STEP_LABELS[step];
    if (skipNetwork) {
      of -= 1;
      if (position > NETWORK_POSITION) position -= 1;
      if (step === "recipient") text = "Select wallet";
    }
  }
  if (!position) return null;
  return (
    <div className="pt-3 pb-1">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-input">
        <div
          className="h-full rounded-full bg-Green transition-all duration-400"
          style={{ width: `${(position / of) * 100}%` }}
        />
      </div>
      <div className="mt-3 flex items-center justify-between max-sm:mt-2">
        <span className="text-[16px] font-medium leading-5 text-card-text max-sm:text-[13px]">
          {text}
        </span>
        <span className="text-[16px] font-normal leading-5 text-text max-sm:text-[13px]">
          {position} of {of}
        </span>
      </div>
    </div>
  );
}
