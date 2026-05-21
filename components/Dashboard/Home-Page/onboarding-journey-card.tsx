import { OnboardingCardProps } from "@/lib/types/card-types";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

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
        `py-5 px-5 bg-border min-h-42 flex flex-col justify-between transition-colors ${status === "done" ? "border-l-3 border-border-active flex flex-col justify-between" : ""}`,
        className,
      )}
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-medium leading-5 text-success-text uppercase tracking-wide max-sm:text-[12px] max-sm:leading-6">
            {step}
          </span>
          {status === "done" && (
            <div className="bg-green-success-dark border-2 border-green-success-border rounded-full p-0.75">
              <Check className="w-4 h-4 text-input-text max-sm:h-6 max-sm:w-6" />
            </div>
          )}
          {status === "active" && (
            <span className="w-6 h-6 rounded-full bg-yellow-warning-dark border-2 border-yellow-warning-light p-0.75 animate-pulse" />
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
        {label && (
          <p className="text-xs leading-5 text-text max-sm:text-[12px]  font-medium">
            {label}
          </p>
        )}
      </div>
      {/* {status === "done" ? (
        <p className="text-xs text-[#A6F4C5] font-medium max-sm:text-[14px] max-sm:leading-6">
          Account created
        </p>
      ) : status === "active" ? (
        <div className="space-y-5">
          <button onClick={onClick} className="w-full bg-Green text-white text-xs font-semibold py-1.5 rounded-lg hover:opacity-90 transition-opacity max-sm:h-12 max-sm:text-[16px]">
            Continue
          </button>
        </div>
      ) : (
        <p className="text-xs leading-5 text-text font-medium max-sm:text-[16px] max-sm:leading-6 line-clamp-2">
          {desc}
        </p>
      )} */}
      {status === "done" && (
        <p className="text-xs text-success-text font-medium max-sm:text-[14px] max-sm:leading-6">
          Account created
        </p>
      )}
      {status === "active" && (
        <button
          onClick={onClick}
          className="w-full bg-Green text-white text-xs font-semibold py-1.5 rounded-lg hover:opacity-90 transition-opacity max-sm:h-12 max-sm:text-[16px]"
        >
          Continue
        </button>
      )}
    </div>
  );
};
