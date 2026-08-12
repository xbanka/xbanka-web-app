import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-Green hover:bg-Green/90 active:bg-Green/80 active:scale-[0.99] border border-abstract-green text-[#FFFFFF]",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 active:bg-destructive/80 active:scale-[0.99] focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border border-input bg-card-background shadow-xs text-text hover:bg-background/90 hover:text-accent-foreground active:bg-background active:scale-[0.99]",
        secondary:
          "bg-background text-card-text hover:bg-background/80 active:bg-background/70 active:scale-[0.99]",
        ghost:
          "hover:bg-accent hover:text-accent-foreground active:bg-accent/70 dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        // No hover/active feedback: this variant is for buttons that cannot be
        // pressed, so it must not look interactive.
        disabled:
          "bg-border text-disabled-text cursor-not-allowed hover:bg-border",
        red: "bg-error-bg-button border border-error-border-button text-white hover:bg-error-bg-button/90 active:bg-error-bg-button/80 active:scale-[0.99]",
        notification:
          "bg-background text-Green hover:bg-background/90 active:bg-background/80 active:scale-[0.99]",
      },
      size: {
        default: "h-12 py-2 px-3",
        // default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: "h-10 rounded-md gap-1.5 px-3 py-2",
        // sm: 'h-10 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: "h-12 rounded-md p-[10px]",
        // lg: 'h-12 rounded-md px-6 has-[>svg]:px-4',
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
