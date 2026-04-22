import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export function CloseBtn({ onClose, className }: { onClose: () => void, className?: string }) {
  return (
    <div
      onClick={onClose}
      className={cn("w-10 h-10 rounded-[36px] flex items-center justify-center text-text bg-border border border-disabled-background hover:bg-border/70 hover:text-card-text transition-colors", className)}
    >
      <X className="w-5 h-5 text-text" />
    </div>
  );
}