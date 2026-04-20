import { ChevronLeft, X } from "lucide-react";

export function ModalHeader({
  title,
  onBack,
  onClose,
}: {
  title: string;
  onBack?: () => void;
  onClose: () => void;
}) {
  return (
    <div className="flex items-center gap-2 pt-8 pb-5">
      {onBack && (
        <button
          onClick={onBack}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-text hover:bg-border hover:text-card-text transition-colors shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}
      <h3 className="text-lg font-semibold text-card-text flex-1">{title}</h3>
      <button
        onClick={onClose}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-text hover:bg-border hover:text-card-text transition-colors shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}