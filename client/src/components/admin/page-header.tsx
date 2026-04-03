import { ReactNode } from "react"
import { PeriodFilter } from "@/components/admin/period-filter"

interface PageHeaderProps {
  title: ReactNode
  description?: string
  hidePeriodFilter?: boolean
}

export function PageHeader({ title, description, hidePeriodFilter }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      {!hidePeriodFilter && <PeriodFilter />}
    </div>
  )
}
