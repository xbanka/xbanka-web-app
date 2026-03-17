import { cardProps } from "@/lib/types/card-types";
import { cn } from "@/lib/utis";
import { ReactNode } from "react";

export const DashboardCard = ({ children, className }: cardProps) => {
  return (
    <div
      className={cn(
        "bg-card-background border border-border rounded-xl p-5 space-y-4",
        className,
      )}
    >
      {children}
    </div>
  );
};
