import { FormHeaderProps } from "@/lib/types/form-header-types";

export function FormHeader({ title, subtitle, icon, className }: FormHeaderProps) {
  return (
    <div className={`${className} " p-6 text-center space-y-4 "`}>
      {icon && <div className="flex justify-center mb-2">{icon}</div>}
      <h1 className="font-bold text-[36px] text-forground leading-11">{title}</h1>
      {subtitle && <p className="text-text text-[16px] leading-6">{subtitle}</p>}
    </div>
  )
}