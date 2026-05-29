import { cn } from "@/lib/utils";
import { Input } from "./input";
import { Label } from "./label";
import { ErrorField } from "./field-error";
import { FormFieldProps } from "@/lib/types/form-types";

export function FormField({
  id,
  label,
  type = "text",
  placeholder,
  icon: Icon,
  register,
  error,
  disabled,
  value,
  onChange,
  className,
  readOnly
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {label && <Label label={label} />}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-placeholder" />
        )}
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            Icon ? "pl-10 pr-4" : "px-4",
            // Use opacity-0 instead of hidden to keep the functionality
            type === "date" &&
              "[&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer",
          )}
          value={value}
          onChange={onChange}
          {...(register ? register(id) : {})}
          readOnly={readOnly}
        />
      </div>
      {error && <ErrorField message={error.message} />}
    </div>
  );
}
