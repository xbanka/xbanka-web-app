import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/FormField";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { RECENT_CONTACTS } from "../Wallet-Page/wallet-mock-data";
import { ProgressBar } from "../Wallet-Page/progress-bar";
import { ModalHeader } from "@/components/ui/modal-header";

const recipientSchema = z.object({
  address: z.string().min(4, "Enter a valid wallet address or XBanka UID"),
});
type RecipientForm = z.infer<typeof recipientSchema>;

export function RecipientStep({
  onBack,
  onClose,
  onNext,
}: {
  onBack: () => void;
  onClose: () => void;
  onNext: (address: string, name?: string) => void;
}) {
  const [tab, setTab] = useState<"recent" | "favorites">("recent");
  const [search, setSearch] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<RecipientForm>({
    resolver: zodResolver(recipientSchema),
    mode: "onChange",
  });

  return (
    <Modal className="p-0" onClose={onClose}>
      <ModalHeader
        className="px-8"
        title="Send Crypto"
        subtitle="Transfer assets to external wallets or XBanka users."
        onBack={onBack}
        onClose={onClose}
      />
      <div className="px-8 pb-3">
        <ProgressBar step="recipient" />
      </div>

      <form
        onSubmit={handleSubmit((d) => onNext(d.address))}
        className="px-8 pt-4 pb-8 space-y-8"
      >
        <div className="space-y-4">
          {/* Manual input */}
          <FormField
            label="Provide wallet address"
            id="address"
            placeholder="Or paste wallet address / XBanka UID"
            register={register}
            error={errors.address}
          />
          {/* Tabs */}
          <div className="flex gap-1 border-b border-border">
            {(["recent", "favorites"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={cn(
                  "pb-2 px-3 text-xs font-medium capitalize border-b-2 transition-colors -mb-px",
                  tab === t
                    ? "border-Green text-Green"
                    : "border-transparent text-text hover:text-card-text",
                )}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Search */}
          {/* <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-placeholder" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, wallet address or UID"
              className="w-full h-10 pl-9 pr-4 text-sm border border-input rounded-xl bg-transparent text-card-text placeholder:text-placeholder outline-none focus:border-border-active transition-colors"
            />
          </div> */}

          {/* Contact list */}
          <div className="">
            {RECENT_CONTACTS.map((c, i) => (
              <button
                key={i}
                type="button"
                onClick={() =>
                  setValue("address", c.full, { shouldValidate: true })
                }
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:border-border-active transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-full bg-Green flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {c.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-5 text-card-text">
                    {c.name}
                  </p>
                  <p className="text-xs font-normal leading-5.5 text-text">
                    {c.uid}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

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
            type="submit"
            size="lg"
            className="flex-3"
            disabled={!isValid}
            variant={isValid ? "default" : "disabled"}
          >
            Continue
          </Button>
        </div>
      </form>
    </Modal>
  );
}
