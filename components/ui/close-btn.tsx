import { X } from "lucide-react";

export function CloseBtn({ onClose }: { onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      className="w-10 h-10 absolute top-4 right-4 rounded-[36px] flex items-center justify-center text-text bg-border border border-disabled-background hover:bg-border/70 hover:text-card-text transition-colors"
    >
      <X className="w-5 h-5 text-text" />
    </div>
  );
}