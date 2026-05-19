import { cn } from "@/lib/utils";
import { bankColor, bankInitials } from "@/lib/wallet-page";
import { Label } from "./label";

export interface TransactionDescriptionFieldProps {
  label: string;
  value: string;
  sourceLabel?: string;
  isAccount?: boolean;
  amount?: boolean;
  loading?: boolean;
  className?: string;
}

export const TransactionDescriptionField = ({
  label,
  value,
  isAccount,
  amount,
  loading,
  className,
}: TransactionDescriptionFieldProps) => {
  const bankName = value?.split(/\s+/)[0] || value || "";
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 text-xs",
        className,
      )}
    >
      <Label className="text-text shrink-0" label={label} />
      {isAccount ? (
        <div className="flex items-center gap-1.5 min-w-0">
          <div
            className={cn(
              "w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-bold shrink-0",
              bankColor(bankName),
            )}
          >
            {bankInitials(bankName).slice(0, 1) || "-"}
          </div>
          <span className="font-medium text-card-text truncate">{value}</span>
        </div>
      ) : (
        <div className="min-w-0">
          {loading ? (
            <span className="text-card-text bg-border h-2 w-[10%] animate-pulse">
              -
            </span>
          ) : (
            <span
              className={cn(
                "font-normal text-sm leading-6 truncate block text-right max-sm:text-[13px]",
                amount ? "text-Green" : "text-card-text",
              )}
            >
              {value}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
