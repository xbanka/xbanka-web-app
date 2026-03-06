import { IdCard } from "lucide-react";
import { FormField } from "../ui/FormField";

function Step2({ register, errors }) {
  return (
    <>
      <div className="text-center space-y-2">
        <h1 className="text-[26px] font-bold text-card-text">Verify Your BVN</h1>
        <p className="text-sm text-text leading-relaxed">
          Your BVN helps us confirm your name and date of birth. We'll never share it with anyone.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <FormField
          id="bvn"
          icon={IdCard}
          placeholder="Enter BVN"
          error={errors.bvn}
          register={register}
        />
      </div>
    </>
  );
}

export default Step2;