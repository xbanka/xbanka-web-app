import { cn } from "@/lib/utils";
import { FormHeaderProps } from "@/lib/types/form-header-types";

export function FormHeader({
  title,
  subtitle,
  icon,
  className,
}: FormHeaderProps) {
  return (
    <div className={cn("space-y-4 text-center", className)}>
      {icon && <div className="flex justify-center mb-2">{icon}</div>}
      <h1 className="font-bold text-[36px] max-sm:text-[28px] text-forground leading-11 max-sm:leading-[30px]">
        {title}
      </h1>
      {subtitle && (
        <p className="text-text text-[16px] max-sm:text-[14px] max-sm:leading-[28px] leading-6">
          {subtitle}
        </p>
      )}
    </div>
  );
}
