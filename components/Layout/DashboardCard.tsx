import { cardProps } from "@/lib/types/card-types";
import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

// Extra attributes (e.g. `data-tour`) go straight onto the card element.
export const DashboardCard = ({
  children,
  className,
  ...rest
}: cardProps & ComponentPropsWithoutRef<"div">) => {
  return (
    <div
      {...rest}
      className={cn(
        "bg-card-background border border-border rounded-xl p-5 max-sm:p-3.5 space-y-4",
        className,
      )}
    >
      {children}
    </div>
  );
};
