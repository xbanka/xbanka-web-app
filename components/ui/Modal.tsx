import { cn } from "@/lib/utils";

export function Modal({
  onClose,
  children,
  className
}: {
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-150"
        onClick={onClose}
      />
      <div className={cn("relative z-10 w-full max-w-150 bg-card-background px-10 pb-10 border-8 border-border rounded-[20px] shadow-2xl animate-in fade-in zoom-in-95 duration-150", className)}>
        {children}
      </div>
    </div>
  );
}