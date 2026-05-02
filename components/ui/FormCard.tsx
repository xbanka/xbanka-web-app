import { cardProps } from "@/lib/types/card-types";
import { cn } from "@/lib/utils";

export const Card = ({ className, children }: cardProps) => {
  return (
    <div
      className={cn(
        "relative w-full max-w-150 mx-auto space-y-6 rounded-lg border border-border bg-card-background p-10 text-center max-sm:flex max-sm:min-h-dvh max-sm:max-w-none max-sm:flex-col max-sm:space-y-6 max-sm:rounded-none max-sm:border-0 max-sm:px-7 max-sm:py-8",
        className,
      )}
    >
      {children}
    </div>
  );
};
