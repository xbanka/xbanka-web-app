import { cardProps } from '@/lib/types/card-types'
import { cn } from '@/lib/utis'

export const Card = ({className, children}: cardProps) => {
  return (
    <div className={cn('bg-card-background space-y-6 text-center border border-border rounded-lg p-10 max-w-150 mx-auto', className)}>
        {children}
    </div>
  )
}
