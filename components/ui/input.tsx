import { cn } from "@/lib/utis"
import * as React from "react"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-placeholder selection:bg-input-background selection:text-primary-foreground border-input flex h-10 w-full min-w-0 rounded-lg border bg-input-background px-4 py-2.5 text-[14px] shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-input-background file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-border-active focus-visible:ring-border-active/50 focus-visible:ring-[3px]",
        "not-placeholder-shown:border-border-active",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
