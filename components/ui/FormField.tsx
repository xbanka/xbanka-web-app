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
  readOnly,
}: FormFieldProps) {
  const registration = register ? register(id) : {};

  return (
    <div className={cn("min-w-0 space-y-1", className)}>
      {label && <Label label={label} />}
      <div className="relative min-w-0">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-placeholder" />
        )}
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "truncate",
            Icon ? "pl-10 pr-4" : "px-4",
            // Normalize iOS/Safari date inputs so they keep the h-10 height and
            // left-align the value instead of rendering taller than other fields.
            type === "date" &&
              "appearance-none [&::-webkit-date-and-time-value]:text-left [&::-webkit-date-and-time-value]:m-0 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer",
          )}
          value={value}
          {...registration}
          onChange={onChange ?? registration.onChange}
          readOnly={readOnly}
        />
      </div>
      {error && <ErrorField message={error.message} />}
    </div>
  );
}
