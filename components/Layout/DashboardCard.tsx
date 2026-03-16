import { cardProps } from "@/lib/types/card-types"
import { ReactNode } from "react"

export const DashboardCard = ({children}: cardProps) => {
  return (
    <div className="bg-card-background border border-border rounded-xl p-5 space-y-4">{children}</div>
  )
}
