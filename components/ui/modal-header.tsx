import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { CloseBtn } from "./close-btn";

export function ModalHeader({
  title,
  subtitle,
  onBack,
  onClose,
  className,
}: {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  onClose: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 px-10 py-6 max-sm:px-6 max-sm:pt-6 max-sm:pb-8",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-start gap-4 max-sm:gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-text hover:bg-border hover:text-card-text transition-colors shrink-0 max-sm:mt-1"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
        <div className="min-w-0">
          <h3 className="text-2xl font-semibold leading-8 text-card-text max-sm:text-[24px] max-sm:leading-8">
            {title}
          </h3>
          <p className="text-sm font-normal leading-6 text-text mt-1">
            {subtitle}
          </p>
        </div>
      </div>
      <CloseBtn
        onClose={onClose}
        className="max-sm:mt-0"
      />
    </div>
  );
}
