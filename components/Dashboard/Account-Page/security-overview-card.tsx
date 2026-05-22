import Image from "next/image";
import { securityOverviewCardProps } from "./types";

export const SecurityOverviewCard = ({
  label,
  statusColor,
  status,
  statusLabel,
  icon: Icon,
  key,
}: securityOverviewCardProps) => {
  return (
    <div
      key={key}
      className="w-full min-w-[144px] bg-border border border-border rounded-xl p-5 space-y-3 max-sm:w-[144px] max-sm:shrink-0 max-sm:p-4"
    >
      <div className="flex items-center justify-between">
        <Icon className="w-4 h-4 text-text" />
        {}
        {status && <Image alt="seal-check" width={16} height={16} src="/SealCheck.svg" />}
      </div>
      <div className="">
        <p className="text-[14px] leading-5 font-medium text-card-text">{label}</p>
        <span className={`text-[12px] font-normal leading-4 ${statusColor}`}>
          {statusLabel}
        </span>
      </div>
      {/* {label === "Google Authenticator" && (
        <div className="w-2 h-2 rounded-full bg-yellow-400" />
      )} */}
    </div>
  );
};
