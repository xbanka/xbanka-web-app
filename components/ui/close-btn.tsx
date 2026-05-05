import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export function CloseBtn({
  onClose,
  className,
}: {
  onClose: () => void;
  className?: string;
}) {
  return (
    <div
      onClick={onClose}
      className={cn(
        "flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-disabled-background bg-border text-text transition-colors hover:bg-border/70 hover:text-card-text max-sm:h-8 max-sm:w-8",
        className,
      )}
    >
      <X className="h-5 w-5 text-text max-sm:h-4 max-sm:w-4" />
    </div>
  );
}
