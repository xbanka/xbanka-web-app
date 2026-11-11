import { CoinIcon } from "@/components/ui/coin-icon";
import { cn } from "@/lib/utils";
import { statusLabel } from "@/lib/trusted-wallets";
import { AlertTriangle } from "lucide-react";

const STATUS_STYLE: Record<string, string> = {
  ACTIVE: "bg-[#012E03] border-[#037508] text-[#A6F4C5]",
  COOLING_OFF: "bg-[#3E2E00] border-[#A27D00] text-[#FEC84B]",
  SUSPENDED: "bg-error-bg-layout border-error-border-button text-[#FFADAB]",
};

export function WalletStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-normal",
        STATUS_STYLE[status] ?? "bg-border border-input text-card-text",
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {statusLabel(status)}
    </span>
  );
}

/** Coin icon, wallet name and a detail line, e.g. "TRC-20 · TXk4mV…1xGo". */
export function WalletSummaryCard({
  currency,
  title,
  subtitle,
  trailing,
  className,
}: {
  currency: string;
  title: string;
  subtitle: string;
  trailing?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border border-input p-4",
        className,
      )}
    >
      <CoinIcon currency={currency} size={40} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium leading-5 text-card-text">
          {title}
        </p>
        <p className="mt-0.5 truncate text-xs leading-5 text-text">
          {subtitle}
        </p>
      </div>
      {trailing}
    </div>
  );
}

export function WarningNote({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-[#A27D00] bg-[#3E2E00] px-4 py-3 text-[#FEC84B]">
      <AlertTriangle size={16} className="mt-0.5 shrink-0" />
      <div className="space-y-1 text-[12px] font-normal leading-4.5">
        {title && <p className="font-medium">{title}</p>}
        <p>{children}</p>
      </div>
    </div>
  );
}

/** Label/value rows inside a bordered panel, as on the success and detail screens. */
export function DetailRows({
  rows,
}: {
  rows: { label: string; value: React.ReactNode }[];
}) {
  return (
    <div className="w-full space-y-4 rounded-[20px] border border-input bg-border p-5 text-left">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-center justify-between gap-3"
        >
          <span className="shrink-0 text-xs leading-5.5 text-text">
            {row.label}
          </span>
          <span className="min-w-0 truncate text-right text-sm font-medium leading-5 text-card-text">
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Round icon above a centred title, as on the result and blocked screens. */
export function StateIcon({
  tone,
  children,
}: {
  tone: "success" | "warning" | "danger" | "info";
  children: React.ReactNode;
}) {
  const style = {
    success: "bg-[#012E03] border-[#037508] text-[#A6F4C5]",
    warning: "bg-[#3E2E00] border-[#A27D00] text-[#FEC84B]",
    danger: "bg-error-bg-layout border-error-border-button text-[#FFADAB]",
    info: "bg-teal-light border-teal-border text-Green",
  }[tone];
  return (
    <div
      className={cn(
        "mx-auto flex h-14 w-14 items-center justify-center rounded-full border",
        style,
      )}
    >
      {children}
    </div>
  );
}
