"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ChevronDown, LoaderCircle, X } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BillerLogo } from "./biller-logo";
import { Biller, formatNaira } from "./billers-data";

export type BillTransaction = {
  billerId: string;
  name: string;
  number: string;
  time: string;
  amount: string;
  status: string;
};

/** Dummy checkout: collects the biller details, fakes a short processing
 *  delay, then reports the "payment" back so the recent list can update. */
export function PayBillModal({
  biller,
  onClose,
  onSuccess,
}: {
  biller: Biller;
  onClose: () => void;
  onSuccess: (tx: BillTransaction) => void;
}) {
  const [identifier, setIdentifier] = useState("");
  const [packageIdx, setPackageIdx] = useState<number | "">("");
  const [amount, setAmount] = useState("");
  const [paying, setPaying] = useState(false);

  const selectedPackage =
    packageIdx === "" ? undefined : biller.packages?.[packageIdx];
  const finalAmount = selectedPackage?.price ?? Number(amount);
  const canPay =
    identifier.trim().length >= 3 &&
    !paying &&
    (biller.packages ? !!selectedPackage : finalAmount >= 50);

  const handlePay = () => {
    if (!canPay) return;
    setPaying(true);
    // Dummy flow — no API yet, just simulate a short processing delay.
    setTimeout(() => {
      const label = selectedPackage
        ? selectedPackage.name
        : `${biller.name} ${biller.category === "airtime" ? "Airtime" : "Payment"}`;
      onSuccess({
        billerId: biller.id,
        name: label,
        number: identifier.trim(),
        time: "Just now",
        amount: formatNaira(finalAmount),
        status: "Completed",
      });
      toast.success(`${label} of ${formatNaira(finalAmount)} successful`, {
        description: "This is a demo transaction — no money moved.",
      });
      setPaying(false);
      onClose();
    }, 1200);
  };

  const inputClasses =
    "w-full h-12 px-4 text-sm border border-input rounded-xl bg-input-background text-card-text placeholder:text-placeholder outline-none focus:border-border-active focus:ring-[3px] focus:ring-border-active/20 transition-[border-color,box-shadow]";

  return (
    <Modal onClose={onClose} className="max-w-110 px-6 pb-6 pt-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <BillerLogo
            logo={biller.logo}
            name={biller.name}
            fallbackColor={biller.fallbackColor}
            size={44}
            rounded="rounded-xl"
          />
          <div>
            <p className="font-semibold text-card-text">{biller.name}</p>
            <p className="text-xs text-text">{biller.desc}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg text-text hover:text-card-text hover:bg-border/40 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-text mb-1.5">
            {biller.inputLabel}
          </label>
          <input
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder={biller.inputPlaceholder}
            className={inputClasses}
          />
        </div>

        {biller.packages ? (
          <div>
            <label className="block text-xs font-medium text-text mb-1.5">
              Select Package
            </label>
            <div className="relative">
              <select
                value={packageIdx}
                onChange={(e) =>
                  setPackageIdx(e.target.value === "" ? "" : Number(e.target.value))
                }
                className={cn(inputClasses, "appearance-none pr-10 cursor-pointer")}
              >
                <option value="">Choose a package</option>
                {biller.packages.map((p, i) => (
                  <option key={p.name} value={i}>
                    {p.name} — {formatNaira(p.price)}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-placeholder pointer-events-none" />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-medium text-text mb-1.5">
              Amount (₦)
            </label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))}
              placeholder="Enter amount"
              inputMode="numeric"
              className={inputClasses}
            />
            {biller.quickAmounts && (
              <div className="flex flex-wrap gap-2 mt-2.5">
                {biller.quickAmounts.map((qa) => (
                  <button
                    key={qa}
                    type="button"
                    onClick={() => setAmount(String(qa))}
                    className={cn(
                      "px-3 py-1.5 text-xs rounded-lg border transition-colors",
                      amount === String(qa)
                        ? "border-Green bg-Green/10 text-Green font-medium"
                        : "border-border text-text hover:border-border-active",
                    )}
                  >
                    ₦{qa.toLocaleString()}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-card-secondary border border-border">
          <span className="text-xs text-text">Total</span>
          <span className="text-sm font-semibold text-card-text">
            {finalAmount > 0 ? formatNaira(finalAmount) : "—"}
          </span>
        </div>

        <Button className="w-full" disabled={!canPay} onClick={handlePay}>
          {paying ? (
            <span className="flex items-center gap-2">
              <LoaderCircle className="size-4 animate-spin" /> Processing...
            </span>
          ) : (
            `Pay ${finalAmount > 0 ? formatNaira(finalAmount) : ""}`
          )}
        </Button>
      </div>
    </Modal>
  );
}
