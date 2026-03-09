import { ChevronDown, LucideIcon } from "lucide-react";
import { ErrorField } from "./field-error";

interface SelectFieldProps {
  icon?: LucideIcon;
  placeholder: string;
  options: { label: string; value: string }[];
  error?: { message: string };
  registration?: any;
}

export const SelectField = ({
  icon: Icon,
  placeholder,
  options,
  error,
  registration,
}: SelectFieldProps) => (
  <div>
    <div className="relative flex items-center">
      {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-placeholder" />
      )}
      <select
        className={`border-input flex h-9 w-full min-w-0 rounded-lg border bg-transparent px-4 py-2.5 text-[14px] shadow-xs appearance-none cursor-pointer ${Icon ? "pl-10 pr-4" : "px-4"}`}
        defaultValue=""
        {...registration}
      >
        <option className="font-normal text-[14px] leading-6" value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((o) => (
          <option className="" key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <span className="absolute right-3 text-placeholder pointer-events-none flex items-center">
        <ChevronDown />
      </span>
    </div>
    <ErrorField message={error?.message} />
  </div>
);
