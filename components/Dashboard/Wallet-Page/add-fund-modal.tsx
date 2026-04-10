"use client";
import { useState } from "react";
import { FormField } from "@/components/ui/FormField";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import { CloseBtn } from "./verify-bvn-modal";
import {
  UseFundFiatWallet,
  UseGetFiatWalletSavedCards,
} from "@/lib/services/wallet.service";
import { SavedCardsList } from "./saved-card-lists";

export interface AddFundModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const addFundsSchema = z.object({
  amount: z.string("Please enter a valid amount"),
  saveCard: z.boolean(),
});

export type AddFundsData = z.infer<typeof addFundsSchema>;

export function AddFundModal({ open, onClose, onSuccess }: AddFundModalProps) {
  const [step, setStep] = useState<"amount" | "saved-cards">(
    "amount",
  );

  const [amount, setAmount] = useState<number>();

  if (!open) return null;

  const { mutate, error, isPending } = UseFundFiatWallet();
  const {
    data: savedCardsData,
    error: savedCardsError,
    isPending: savedCardsPending,
  } = UseGetFiatWalletSavedCards();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<AddFundsData>({
    resolver: zodResolver(addFundsSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      amount: "",
      saveCard: false,
    },
  });

  const handleClose = () => {
    setStep("amount");
    onClose();
  };

  const handleSuccess = () => {
    onSuccess?.();
    handleClose();
  };

  const onSubmit = (data: AddFundsData) => {
    const parsedAmount = Number(data.amount);
    setAmount(parsedAmount);

    if (savedCardsData.length > 0) {
      setStep("saved-cards");
    } else {
      const payload = {
        amount: Number(data.amount),
        saveCard: data.saveCard,
      };

      mutate(payload, {
        onSuccess: (res) => {
          reset();
        },
      });
    }
    console.log("clicked", data);
  };

  return (
    <Modal onClose={onClose}>
      <div className="space-y-3">
        <div className="py-6">
          <div className="">
            <h1 className="font-semibold leading-8 text-2xl text-card-text">
              Add Funds
            </h1>
            <p className="text-[16px] font-normal text-text">
              Select an amount to fund to your wallet.
            </p>
          </div>
          <CloseBtn onClose={onClose} />
        </div>
        {step === "amount" && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-2">
              <FormField
                label="Amount"
                id="amount"
                register={register}
                error={errors.amount}
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="saveCard"
                  {...register("saveCard")}
                  className="cursor-pointer"
                />
                <label
                  htmlFor="saveCard"
                  className="text-sm text-text cursor-pointer"
                >
                  Save card for future payments
                </label>
              </div>
            </div>
            <div className="flex w-full gap-4">
              <Button variant={"outline"} type="button" className="flex-2">
                Cancel
              </Button>
              <Button type="submit" className="flex-4">
                {isPending ? "Continuing..." : "Continue to payment"}
              </Button>
            </div>
          </form>
        )}
        {/* STEP 2: SAVED CARDS */}
        {step === "saved-cards" && (
          <SavedCardsList
            cards={savedCardsData}
            amount={amount ?? 0}
            onBack={() => setStep("amount")}
            onAddNew={() => setStep("amount")}
          />
        )}
      </div>
    </Modal>
  );
}
