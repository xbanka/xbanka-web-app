import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import React from "react";

export interface SendCryptoConfirmList {
  title: string;
  icon?: LucideIcon;
  value: string | number;
  subValue?: string;
}

export const SendCryptoConfirmList = ({ title, icon: Icon, value, subValue }: SendCryptoConfirmList) => {
  return (
    <div className="flex items-center justify-between p-3 gap-3">
      <span className="text-xs font-normal leading-5.5 text-text shrink-0">
        {title}
      </span>
      <div className="text-right">
        {Icon ? (
          <div className="flex items-center gap-1.5 justify-end">
            <Icon className="w-6 h-6"/>
            <span className="text-xs font-medium text-card-text">{value}</span>
          </div>
        ) : (
          <p className={cn("text-xs whitespace-pre-line")}>{value}</p>
        )}
        {subValue && <p className="text-[10px] text-text mt-0.5">{subValue}</p>}
      </div>
    </div>
  );
};
