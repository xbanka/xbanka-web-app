"use client"
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/Modal";
import { CardForm, cardSchema } from "@/lib/schema/bank-schema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function DebitCardForm({
  onBack,
  onClose,
  onSuccess,
}: {
  onBack: () => void;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<CardForm>({
    resolver: zodResolver(cardSchema),
    mode: "onTouched",
    defaultValues: { saveCard: true },
  });
 
  const [isPending, setIsPending] = useState(false);
  const [showCvv, setShowCvv] = useState(false);
  const saveCard = watch("saveCard");
 
  const onSubmit = async () => {
    setIsPending(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsPending(false);
    onSuccess();
  };
 
  // Auto-format card number with spaces for display (stored raw)
  const formatCardInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    e.target.value = raw;
  };
 
  // Auto-format expiry MM/YY
  const formatExpiry = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2);
    e.target.value = v;
  };
 
  return (
    <Modal onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Cardholder name */}
        <FormField
          id="cardholderName"
          placeholder="John Doe"
          register={register}
          error={errors.cardholderName}
          label="Cardholder Name"
        />
 
        {/* Card number */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-card-text">Card Number</label>
          <div className="relative">
            <Input
              placeholder="0000 0000 0000 0000"
              aria-invalid={!!errors.cardNumber}
              {...register("cardNumber")}
              onChange={(e) => {
                formatCardInput(e);
                register("cardNumber").onChange(e);
              }}
            />
            {/* Card icon placeholder */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text opacity-50">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          {errors.cardNumber && (
            <p className="text-xs text-[var(--input-border-error)]">{errors.cardNumber.message}</p>
          )}
        </div>
 
        {/* Expiry + CVV */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-card-text">Expiry Date</label>
            <Input
              placeholder="MM/YY"
              aria-invalid={!!errors.expiry}
              {...register("expiry")}
              onChange={(e) => {
                formatExpiry(e);
                register("expiry").onChange(e);
              }}
            />
            {errors.expiry && (
              <p className="text-xs text-[var(--input-border-error)]">{errors.expiry.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-card-text">CVV</label>
            <div className="relative">
              <Input
                type={showCvv ? "text" : "password"}
                placeholder="123"
                aria-invalid={!!errors.cvv}
                {...register("cvv")}
              />
              <button
                type="button"
                onClick={() => setShowCvv(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text hover:text-card-text transition-colors"
              >
                {showCvv ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            {errors.cvv && (
              <p className="text-xs text-[var(--input-border-error)]">{errors.cvv.message}</p>
            )}
          </div>
        </div>
 
        {/* Save card toggle */}
        <label className="flex items-center justify-between cursor-pointer py-1">
          <span className="text-sm text-card-text">Securely save card for future use</span>
          <button
            type="button"
            role="switch"
            aria-checked={saveCard}
            onClick={() => setValue("saveCard", !saveCard)}
            className={cn(
              "relative w-10 h-5 rounded-full transition-colors shrink-0",
              saveCard ? "bg-Green" : "bg-border"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform",
                saveCard ? "translate-x-5" : "translate-x-0.5"
              )}
            />
          </button>
        </label>
 
        <div className="flex gap-3 pt-1">
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
            type="submit"
            size="lg"
            className="flex-1"
            disabled={!isValid || isPending}
            variant={!isValid || isPending ? "disabled" : "default"}
          >
            {isPending ? "Processing..." : "Continue"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}