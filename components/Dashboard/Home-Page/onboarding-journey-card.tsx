import { OnboardingCardProps } from "@/lib/types/card-types";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

export const OnboardingJourneyCard = ({
  className,
  status,
  step,
  title,
  desc,
  label
}: OnboardingCardProps) => {
  return (
    <div
      className={cn(
        ` py-3 px-4 bg-border p-4 min-h-34 transition-colors ${status === "done" ? "border-l-3 border-border-active flex flex-col justify-between" : ""}`,
        className,
      )}
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-medium leading-5 text-[#A6F4C5] uppercase tracking-wide">
            {step}
          </span>
          {status === "done" && (
            <div className="bg-[#37703F1A]/10">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          )}
          {status === "active" && (
            <span className="w-6 h-6 rounded-full bg-[#37703F1A]/80 animate-pulse" />
          )}
        </div>
        <p className={`text-sm font-semibold text-card-text`}>{title}</p>
        {status === "active" && (
          <p className="text-xs text-text leading-5 font-medium">{desc}</p>
        )}
        {label && <p className="text-xs leading-5 text-text font-medium">{label}</p>}
      </div>
      {status === "done" ? (
        <p className="text-xs text-green-500 font-medium">Account created</p>
      ) : status === "active" ? (
        <div className="space-y-5">
          <p className="text-xs text-text leading-relaxed">{desc}</p>
          <button className="w-full bg-Green text-white text-xs font-semibold py-1.5 rounded-lg hover:opacity-90 transition-opacity">
            Continue →
          </button>
        </div>
      ) : (
        <p className="text-xs text-green-500 font-medium">{desc}</p>
      )}
    </div>
  );
};
