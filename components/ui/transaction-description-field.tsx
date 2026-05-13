import { cn } from "@/lib/utils";
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
  sourceLabel,
  isAccount,
  amount,
  loading,
  className,
}: TransactionDescriptionFieldProps) => {
  console.log("TransactionDescriptionField props:", {
    label,
    value,
    sourceLabel,
    isAccount,
    amount,
    loading,
  });
  return (
    <div className={cn("flex items-center justify-between text-xs", className)}>
      <Label className="text-text" label={label} />
      {isAccount ? (
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center text-white text-[8px] font-bold">
            {value ? value[0] : "-"}
          </div>
          <span className="font-medium text-card-text">{value}</span>
        </div>
      ) : (
        <div>
          {loading ? (
            <span className="text-card-text bg-border h-2 w-[10%] animate-pulse">
              -
            </span>
          ) : (
            <span
              className={cn(
                "font-normal text-sm leading-6",
                amount ? "text-Green" : "text-card-text",
                // row.bold && "font-semibold",
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
