import { Button } from "@/components/ui/button";
import { ErrorField } from "@/components/ui/field-error";
import { Modal } from "@/components/ui/Modal";
import { ModalHeader } from "@/components/ui/modal-header";
import { UseFundFiatWallet } from "@/lib/services/wallet.service";
import { cn } from "@/lib/utils";
import { QUICK_AMOUNTS } from "@/lib/wallet-page";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

export const addFundsSchema = z.object({
  amount: z.string("Please enter a valid amount"),
  saveCard: z.boolean(),
});

export type AddFundsData = z.infer<typeof addFundsSchema>;

export function AddNewCardStep({
  onBack,
  onClose,
  onSaved,
}: {
  onBack: () => void;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [amount, setAmount] = useState<number | null>(null);
  const [saveCard, setSaveCard] = useState(false);

  const isValid = (amount ?? 0) >= 1000;

  const { mutate, error, isPending } = UseFundFiatWallet();
  // const {
  //   data: savedCardsData,
  //   error: savedCardsError,
  //   isPending: savedCardsPending,
  // } = UseGetFiatWalletSavedCards();

  const onSubmit = () => {
    const parsedAmount = Number(amount);
    const payload = {
      amount: parsedAmount,
      saveCard: saveCard,
    };
    console.log("payload", payload);

    mutate(payload);
  };

  return (
    <Modal className="p-0" onClose={onClose}>
      <ModalHeader
        className="px-10 py-6"
        title="Add Funds"
        onBack={onBack}
        onClose={onClose}
      />
      <div className="px-10 pb-10 pt-6 space-y-8">
        <div className="space-y-10">
          <div className="space-y-4">
            {/* Amount input */}
            <div className="">
              <div className="flex items-center gap-2 py-3 px-4 border rounded-xl border-input h-17.5">
                <span className="text-2xl font-bold text-card-text">₦</span>
                <input
                  type="text"
                  value={amount ? amount.toLocaleString() : ""}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, "");
                    setAmount(raw ? Number(raw) : null);
                  }}
                  placeholder="0.00"
                  className="flex-1 bg-transparent text-2xl font-bold text-card-text outline-none placeholder:text-text/30 min-w-0"
                />
                <ErrorField message={error?.message} />
              </div>
              <div className="flex items-center justify-between text-[10px] text-text mt-2">
                <span className="font-normal text-xs leading-4.5">
                  Minimum transfer: ₦1,000
                </span>
                <span className="font-normal text-xs leading-4.5 bg-input-background py-2.5 px-4 rounded-lg">
                  ₦30,000 remaining today
                </span>
              </div>
            </div>

            {/* Quick amounts */}
            <div className="flex flex-wrap gap-2">
              {QUICK_AMOUNTS.map((q) => (
                <button
                  key={q}
                  onClick={() => setAmount(q)}
                  className={cn(
                    "px-4 py-2.5 rounded-lg text-xs font-normal leading-6 border transition-colors",
                    amount === q
                      ? "border-Green bg-Green/10 text-Green"
                      : "border-input text-text hover:border-border-active",
                  )}
                >
                  ₦{q.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
        </div>

        <label className="flex items-center justify-between cursor-pointer">
          <p className="font-normal text-xs leading-4.5 text-text">
            Securely save card for future use
          </p>
          <button
            type="button"
            role="switch"
            aria-checked={saveCard}
            onClick={() => setSaveCard((v) => !v)}
            className={cn(
              "relative w-10 h-5 rounded-full transition-colors",
              saveCard ? "bg-Green" : "bg-border",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform",
                saveCard ? "translate-x-0.5" : "-translate-x-4",
              )}
            />
          </button>
        </label>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={onBack}
          >
            Back
          </Button>
          <Button
            size="lg"
            className="flex-3"
            disabled={!isValid || isPending}
            variant={isValid ? "default" : isPending ? "disabled" : "disabled"}
            onClick={onSubmit}
          >
            {isPending ? "Processing..." : "Continue"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
