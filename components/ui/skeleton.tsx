import { cn } from '@/lib/utils'

export const Skeleton = ({
  className,
  inset,
}: {
  className?: string
  /**
   * Use inside panels painted `bg-border` or `bg-card-secondary`. In dark mode
   * those resolve to the same hex as the default bar, so an un-inset skeleton
   * placed on them is invisible.
   */
  inset?: boolean
}) => {
  return (
    <div
      className={cn(
        "h-3 w-full rounded",
        inset ? "bg-input" : "bg-border",
        className,
      )}
    />
  )
}
