import { ChevronDown, LucideIcon } from "lucide-react";
import { ErrorField } from "./field-error";
import { FieldError, UseFormRegister } from "react-hook-form";

interface SelectFieldProps {
  id: string;
  icon?: LucideIcon;
  placeholder: string;
  options: { label: string; value: string }[];
  error?: FieldError;
  register?: UseFormRegister<any>;
  onChange?: any;
  value?: string | null
}

export const SelectField = ({
  id,
  icon: Icon,
  placeholder,
  options,
  error,
  register,
  onChange,
  value
}: SelectFieldProps) => (
  <div>
    <div className="relative flex items-center">
      {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-placeholder" />
      )}
      <select
        className={`border-input flex h-10 items-center w-full min-w-0 rounded-lg border bg-input-background px-4 py-2.5 text-[14px] shadow-xs appearance-none cursor-pointer ${Icon ? "pl-10 pr-4" : "px-4"}`}
        defaultValue=""
        {...(register && register(id))}
        value={value ?? ""}
        onChange={onChange}
      >
        <option className="text-[14px]" value="" disabled hidden>
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
