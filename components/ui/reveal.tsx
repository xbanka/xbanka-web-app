import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/** Rises its content in on mount. Wrap whatever takes a skeleton's place. */
export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("motion-safe:animate-fade-up", className)}>
      {children}
    </div>
  );
}
