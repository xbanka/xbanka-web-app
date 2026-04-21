import { cn } from "@/lib/utils";
import { ChevronLeft, X } from "lucide-react";
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
    <div className={cn("flex items-center justify-between gap-2 px-10 py-6", className)}>
      <div className="flex items-center gap-4">
        {onBack && (
          <button
            onClick={onBack}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-text hover:bg-border hover:text-card-text transition-colors shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
        <div className="">
          <h3 className="text-2xl font-semibold leading-8 text-card-text flex-1">
            {title}
          </h3>
          <p className="text-sm font-normal leading-6 text-text mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>
      <CloseBtn onClose={onClose} />
    </div>
  );
}
