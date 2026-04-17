import React from "react";
import { littleCardProps } from "./types";
import { Button } from "@/components/ui/button";
import { date } from "zod";
import { formatDate } from "@/lib/formatDate";
import Image from "next/image";

const LittleCards = ({
  key,
  Icon,
  action,
  label,
  ip,
  status,
  location,
  lastTime,
  date,
  description,
  isSet,
  onClick
}: littleCardProps) => {
  return (
    <div
      key={key}
      className="flex items-center justify-between px-3 py-2 bg-border gap-3 rounded-lg"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 p-2 rounded-[36px] bg-[#042F2E] flex items-center justify-center">
          {Icon && <Icon className="w-4 h-4 text-Green" />}
        </div>
        <div>
          <p className="text-sm leading-5 font-medium text-card-text">
            {label}
          </p>
          {description && (
            <p className="text-xs font-normal leading-5.5 text-text">
              {description}
            </p>
          )}
          {date && (
            <p className="text-xs font-normal leading-5.5 text-text">
              Added: {formatDate(date)}
            </p>
          )}
          {lastTime || ip || location ? (
            <div className="flex items-center">
              {lastTime && (
                <p className="text-xs font-normal leading-5.5 text-text">
                  {lastTime}
                </p>
              )}
              {lastTime && (
                <span className="text-xs text-text h-1.5 w-1.5 bg-text rounded-full mx-2"></span>
              )}
              {ip && (
                <p className="text-xs font-normal leading-5.5 text-text">
                  {ip}
                </p>
              )}
              {ip && (
                <span className="text-xs text-text h-1.5 w-1.5 bg-text rounded-full mx-2"></span>
              )}
              {location && (
                <p className="text-sm font-medium leading-4.5 text-text">
                  {location}
                </p>
              )}
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {isSet && (
          <Image alt="seal-check" width={16} height={16} src="/SealCheck.svg" />
        )}
        {status && <span className={`text-xs font-medium`}>{status}</span>}
        <Button
          variant="outline"
          size="sm"
          onClick={onClick}
          className={`border border-disabled-background ${
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
