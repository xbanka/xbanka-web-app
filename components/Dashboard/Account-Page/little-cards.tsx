import React from "react";
import { littleCardProps } from "./types";
import { Button } from "@/components/ui/button";

const LittleCards = ({key, Icon, action, label, desc, status}: littleCardProps) => {
  return (
    <div
      key={key}
      className="flex items-center justify-between px-3 py-2 bg-border gap-3 rounded-lg"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 p-2 rounded-[36px] bg-[#042F2E] flex items-center justify-center">
          <Icon className="w-4 h-4 text-Green" />
        </div>
        <div>
          <p className="text-sm leading-5 font-medium text-card-text">{label}</p>
          {desc && <p className="text-xs font-normal leading-4.5 text-text">{desc}</p>}
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {
            status &&
            <span className={`text-xs font-medium`}>
            {status}
            </span>
        }
        <Button
        variant="outline"
        size="sm"
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors border border-disabled-background ${
            action === "Enable"
              ? "text-Green hover:bg-Green/10"
              : "text-error-text hover:bg-border"
          }`}
        >
          {action}
        </Button>
      </div>
    </div>
  );
};

export default LittleCards;
