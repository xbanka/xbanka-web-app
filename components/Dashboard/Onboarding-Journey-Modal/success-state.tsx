import { Button } from "@/components/ui/button";
import { ModalHeader } from "@/components/ui/modal-header";
import { cn } from "@/lib/utils";
import { ArrowRight, CheckCircle, Clock, Shield } from "lucide-react";
import Image from "next/image";

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
    <div className="text-center">
      <ModalHeader className="px-8" onClose={onClose} />
      <div className="space-y-6 px-8 pb-8">
        <div className="space-y-4">
          {/* Icon */}
          <div
            className={cn(
              "w-20 h-20 mx-auto rounded-full flex items-center justify-center",
              badge === "review"
                ? "bg-amber-500/15 border border-amber-500/30"
                : "bg-none border-none",
            )}
          >
            {badge === "review" ? (
              <Clock className="w-9 h-9 text-amber-400 text-center" />
            ) : (
              <Image
                src="/badge 2.svg"
                alt="done badge"
                width={60}
                height={60}
              />
            )}
          </div>

          {/* Text */}
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">{title}</h3>
            <p className="text-sm text-[#8b95a8] leading-relaxed max-w-sm mx-auto">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="w-full">
          {ctaLabel && onCta && (
            <Button onClick={onCta} className="w-full">
              {ctaLabel}
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
          <Button
            onClick={onClose}
            className="w-full bg-transparent text-Green border-none hover:bg-[#232838] transition-colors"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
