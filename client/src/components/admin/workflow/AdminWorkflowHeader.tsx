import { ReactNode } from "react"
import { BackToListButton } from "@/components/BackToListButton"

export function AdminWorkflowHeader({
  title,
  description,
  right,
  backHref = "/admin/project_list",
}: {
  title: string
  description?: string
  right?: ReactNode
  backHref?: string
}) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
      <div className="min-w-0">
        <h1 className="text-xl font-bold text-foreground truncate">{title}</h1>
        {description ? (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{description}</p>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        {right}
        <BackToListButton href={backHref} className="rounded-lg font-medium" />
      </div>
    </div>
  )
}

