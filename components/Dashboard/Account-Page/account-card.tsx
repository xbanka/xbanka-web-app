import { AccountCardProps } from "@/lib/types/card-types";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export const AccountCard = ({ className, tier, label, description, time }: AccountCardProps) => {
  return (
    <div className={cn("py-3 px-4 bg-border border-3", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h1>{tier}</h1>
          <p>{label}</p>
          <p>{description}</p>
        </div>
        <div>
          <div className="bg-[#37703F] w-5 h-5 p-0.75 rounded-[360px] flex items-center justify-center">
            <Check className="h-1.5 w-2.25 text-[#FFFFFF]" />
          </div>
        </div>
      </div>
      <p className="">{time}</p>
    </div>
  );
};
