import { cn } from "@/lib/utils";

export function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-1 rounded-full transition-all duration-300",
            i < current ? "bg-Green" : "bg-border",
            i < current ? "w-8" : "w-4"
          )}
        />
      ))}
      <span className="text-xs text-text ml-2">
        {current} of {total}
      </span>
    </div>
  );
}