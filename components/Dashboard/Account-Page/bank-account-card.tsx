import { Copy, EllipsisVertical } from "lucide-react";

export interface BankAccountCardProp {
    index: number, 
    label: string, 
    status: string, 
    bank: string, 
    number: number | string, 
    name: string
}

export const BankAccountCard = ({index, label, status, bank, number, name}: BankAccountCardProp) => {
  return (
    <div key={index} className="bg-border rounded-lg p-2 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium text-text leading-5 tracking-wide">
          {label}
        </span>
        <div className="flex gap-3 items-center">
          {status === "Verified" && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
              Verified
            </span>
          )}
          {status === "Under Review" && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
              Under Review
            </span>
          )}
          <EllipsisVertical className="w-4 h-4 text-text" />
        </div>
      </div>
      {bank && (
        <p className="text-sm font-medium leading-5 text-card-text">{bank}</p>
      )}
      <div className="flex justify-between bg-card-background rounded-lg p-2">
        <div>
          <p className="text-[12px] font-medium leading-5 text-text">
            Account Number
          </p>
          <div className="flex items-center gap-1.5">
            <p className="text-[14px] font-normal leading-6 text-card-text">
              {number}
            </p>
            <button className="text-text hover:text-Green transition-colors">
              <Copy className="w-3 h-3" />
            </button>
          </div>
        </div>
        <div>
          <p className="text-[12px] font-medium leading-5 text-text">
            Account Name
          </p>
          <p className="text-[14px] font-normal leading-6 text-card-text">
            {name}
          </p>
        </div>
      </div>
    </div>
  );
};
