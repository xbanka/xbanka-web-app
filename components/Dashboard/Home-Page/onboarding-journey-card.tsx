import { Card } from "@/components/ui/FormCard";
import { cardProps } from "@/lib/types/card-types";
import { cn } from "@/lib/utils";

export const OnboardingJourneyCard = ({ className, children }: cardProps) => {
  return <div className={cn("py-3 px-4 bg-border", className)}>{children}</div>;
};
