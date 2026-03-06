import { ChevronDown } from "lucide-react";
import { ErrorField } from "./field-error";

interface SelectFieldProps {
  icon?: React.ComponentType;
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
        <span className="absolute left-3 text-placeholder pointer-events-none z-10 flex items-center">
          <Icon />
        </span>
      )}
      <select
        className={`border-input flex h-9 w-full min-w-0 rounded-lg border bg-transparent px-4 py-2.5 text-base shadow-xs appearance-none cursor-pointer ${Icon ? "pl-10 pr-9" : "px-4 pr-9"}`}
        defaultValue=""
        {...registration}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
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
