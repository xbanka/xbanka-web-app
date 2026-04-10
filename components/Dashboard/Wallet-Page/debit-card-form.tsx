import { FormField } from "@/components/ui/FormField";

interface DebitCardProps {
  register: any, 
  errors: any
}

export const DebitCard = ({register, errors}: DebitCardProps) => {
  return (
    <div>
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
        <label htmlFor="saveCard" className="text-sm text-text cursor-pointer">
          Save card for future payments
        </label>
      </div>
    </div>
  );
};
