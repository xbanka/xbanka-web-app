import { cn } from '@/lib/utils'

export const Skeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn("h-3 w-full bg-border rounded", className)} />
  )
}
