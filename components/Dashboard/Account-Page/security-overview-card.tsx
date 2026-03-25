import { securityOverviewCardProps } from "./types";

export const SecurityOverviewCard = ({
  label,
  statusColor,
  status,
  icon: Icon,
  key
}: securityOverviewCardProps) => {
  return (
    <div
      key={key}
      className="w-full bg-background border border-border rounded-xl px-4 py-3"
    >
      <Icon className="w-5 h-5 text-text" />
      <p className="text-xs font-medium text-card-text">{label}</p>
      <span className={`text-[10px] font-semibold ${statusColor}`}>
        {status}
      </span>
      {label === "Google Authenticator" && (
        <div className="w-2 h-2 rounded-full bg-yellow-400" />
      )}
    </div>
  );
};
