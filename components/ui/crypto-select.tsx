import { ChevronDown, LucideIcon } from "lucide-react";
import { CryptoSelectFieldProps } from "@/lib/types/form-types";

export const CryptoSelectField = ({
  id,
  icon: Icon,
  placeholder,
  options,
  register,
  onChange,
  value
}: CryptoSelectFieldProps) => (
  <div>
    <div className="relative flex items-center gap-3 w-full">
      {Icon && (
          <Icon className=" h-4 w-4 text-placeholder" />
      )}
      <select
        className={`flex h-10 items-center w-full min-w-0 rounded-lg px-4 py-2.5 text-[14px] shadow-xs appearance-none cursor-pointer ${Icon ? "pl-10 pr-4" : "px-4"}`}
        defaultValue=""
        {...((register && id) && register(id))}
        value={value ?? ""}
        onChange={onChange}
      >
        { placeholder && <option className="text-[14px]" value="" disabled hidden>
          {placeholder}
        </option>}
        {options.map((o) => (
          <option className="" key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {id && <span className="text-placeholder pointer-events-none flex items-center">
        <ChevronDown />
      </span>}
    </div>
  </div>
);
