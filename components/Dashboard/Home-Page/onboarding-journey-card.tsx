import { OnboardingCardProps } from "@/lib/types/card-types";
import { cn } from "@/lib/utils";
import { Check, Clock, Lock } from "lucide-react";

const STATUS_BORDER: Record<OnboardingCardProps["status"], string> = {
  done: "border-l-3 border-border-active",
  active: "border-l-3 border-yellow-warning-dark",
  pending: "border-l-3 border-text/20",
};

export const OnboardingJourneyCard = ({
  className,
  status,
  step,
  title,
  desc,
  label,
  onClick,
}: OnboardingCardProps) => {
  return (
    <div
      className={cn(
        "py-5 px-5 bg-border min-h-42 flex flex-col justify-between transition-colors",
        STATUS_BORDER[status],
        className,
      )}
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-medium leading-5 text-green-success-text uppercase tracking-wide max-sm:text-[12px] max-sm:leading-6">
            {step}
          </span>
          {status === "done" && (
            <Check className="w-5 h-5 text-green-success-dark max-sm:h-6 max-sm:w-6" />
          )}
          {status === "active" && (
            <div className="bg-yellow-warning-dark border-2 border-yellow-warning-border rounded-full p-0.75 animate-pulse">
              <Clock className="w-4 h-4 text-yellow-warning-text max-sm:h-6 max-sm:w-6" />
            </div>
          )}
          {status === "pending" && (
            <Lock className="w-5 h-5 text-text/50 max-sm:h-6 max-sm:w-6" />
          )}
        </div>
        <p className="text-sm font-semibold text-card-text max-sm:text-[14px] max-sm:leading-5 tracking-[-3%]">
          {title}
        </p>
        {status === "active" && (
          <p className="text-xs text-text leading-5 font-medium max-sm:text-[12px] max-sm:leading-5 line-clamp-2">
            {desc}
          </p>
        )}
      </div>
      {status === "done" && (
        <p className="text-xs text-green-success-text font-medium max-sm:text-[14px] max-sm:leading-6">
          {label}
        </p>
      )}
      {status === "pending" && (
        <p className="text-xs text-text font-medium max-sm:text-[14px] max-sm:leading-6">
          {desc}
        </p>
      )}
      {status === "active" && (
        <button
          onClick={onClick}
          className="w-full rounded-lg bg-Green py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 max-sm:h-9 max-sm:text-[13px]"
        >
          Continue
        </button>
      )}
    </div>
  );
};
