import { cn } from "@/lib/utils";
import { ArrowRight, CheckCircle, Clock, Shield } from "lucide-react";

export function SuccessState({
  title,
  subtitle,
  badge,
  ctaLabel,
  onCta,
  onClose,
}: {
  title: string;
  subtitle: string;
  badge?: "verified" | "review";
  ctaLabel?: string;
  onCta?: () => void;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-5 text-center px-8 py-10">
      {/* Icon */}
      <div
        className={cn(
          "w-20 h-20 rounded-full flex items-center justify-center mb-1",
          badge === "review"
            ? "bg-amber-500/15 border border-amber-500/30"
            : "bg-[#36b6ab]/15 border border-[#36b6ab]/30"
        )}
      >
        {badge === "review" ? (
          <Clock className="w-9 h-9 text-amber-400" />
        ) : (
          <CheckCircle className="w-9 h-9 text-[#36b6ab]" />
        )}
      </div>
 
      {/* Text */}
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        <p className="text-sm text-[#8b95a8] leading-relaxed max-w-xs mx-auto">
          {subtitle}
        </p>
      </div>
 
      {/* Badge pill */}
      {badge && (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium",
            badge === "review"
              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
              : "bg-[#36b6ab]/10 text-[#36b6ab] border border-[#36b6ab]/20"
          )}
        >
          {badge === "review" ? (
            <>
              <Clock className="w-3 h-3" /> Under Review
            </>
          ) : (
            <>
              <Shield className="w-3 h-3" /> Verified
            </>
          )}
        </span>
      )}
 
      {/* Buttons */}
      <div className="w-full space-y-3 mt-2">
        {ctaLabel && onCta && (
          <button
            onClick={onCta}
            className="w-full py-3 rounded-xl bg-[#36b6ab] text-white font-semibold text-sm hover:bg-[#2ea098] transition-colors flex items-center justify-center gap-2"
          >
            {ctaLabel}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl border border-[#2a3040] text-[#8b95a8] font-medium text-sm hover:bg-[#232838] transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}