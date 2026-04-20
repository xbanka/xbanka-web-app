import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/Modal";
import { ModalHeader } from "@/components/ui/modal-header";
import { SelectField } from "@/components/ui/select";
import { BANK_OPTIONS } from "@/lib/schema/bank-schema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const addCardSchema = z.object({
  cardholderName: z.string().min(2, "Name required"),
  cardNumber: z.string().regex(/^\d{16}$/, "Must be 16 digits"),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Use MM/YY"),
  cvv: z.string().regex(/^\d{3,4}$/, "3-4 digits"),
});
type AddCardForm = z.infer<typeof addCardSchema>;
 
export function AddNewCardStep({
  onBack, onClose, onSaved,
}: {
  onBack: () => void;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<AddCardForm>({
    resolver: zodResolver(addCardSchema),
    mode: "onTouched",
  });
  const [isPending, setIsPending] = useState(false);
  const [saveCard, setSaveCard] = useState(true);
 
  const onSubmit = async () => {
    setIsPending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsPending(false);
    onSaved();
  };
 
  return (
    <Modal onClose={onClose}>
      <ModalHeader title="Add Funds" onBack={onBack} onClose={onClose} />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField id="cardholderName" label="Cardholder Name" placeholder="John Doe"
          register={register} error={errors.cardholderName} />
 
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-card-text">Card Number</label>
          <Input
            placeholder="0000 0000 0000 0000"
            aria-invalid={!!errors.cardNumber}
            {...register("cardNumber", {
              onChange: (e) => {
                e.target.value = e.target.value.replace(/\D/g, "").slice(0, 16);
              },
            })}
          />
          {errors.cardNumber && <p className="text-xs text-[var(--input-border-error)]">{errors.cardNumber.message}</p>}
        </div>
 
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-card-text">Expiry Date</label>
            <Input placeholder="MM/YY" aria-invalid={!!errors.expiry} {...register("expiry")} />
            {errors.expiry && <p className="text-xs text-[var(--input-border-error)]">{errors.expiry.message}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-card-text">CVV</label>
            <Input type="password" placeholder="···" aria-invalid={!!errors.cvv} {...register("cvv")} />
            {errors.cvv && <p className="text-xs text-[var(--input-border-error)]">{errors.cvv.message}</p>}
          </div>
        </div>
 
        <label className="flex items-center justify-between cursor-pointer py-1">
          <span className="text-sm text-card-text">Securely save card for future use</span>
          <button type="button" role="switch" aria-checked={saveCard}
            onClick={() => setSaveCard(v => !v)}
            className={cn("relative w-10 h-5 rounded-full transition-colors", saveCard ? "bg-Green" : "bg-border")}>
            <span className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform", saveCard ? "translate-x-5" : "translate-x-0.5")} />
          </button>
        </label>
 
        <div className="flex gap-3 pt-1">
          <Button type="button" variant="outline" size="lg" className="flex-1" onClick={onBack}>Back</Button>
          <Button type="submit" size="lg" className="flex-1" disabled={!isValid || isPending}
            variant={!isValid || isPending ? "disabled" : "default"}>
            {isPending ? "Processing..." : "Continue"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}