import { useState, useRef } from "react"
import { ProjectManagement } from "@/components/admin/project-management"
import { AdminBackButton } from "@/components/admin/AdminBackButton"
import type { ProjectManagementRef } from "@/components/admin/project-management"
import { PageHeader } from "@/components/admin/page-header"

export default function PendingApprovalPage() {
  const [activeViewLabel, setActiveViewLabel] = useState("")
  const [showBackButton, setShowBackButton] = useState(false)
  const projectRef = useRef<ProjectManagementRef>(null)
  return (
    <div className="space-y-6 p-6">
      {showBackButton && (
        <div className="mb-3">
          <AdminBackButton onClick={() => projectRef.current?.clearSelection()} />
        </div>
      )}
      <PageHeader
        title={<>승인 대기{activeViewLabel && <span className="ml-3 text-xl font-semibold text-pink-600">/ {activeViewLabel}</span>}</>}
        description="운영자 승인이 필요한 프로젝트를 검토하고 처리하세요"
      />
      <ProjectManagement
        ref={projectRef}
        defaultStatus="REQUESTED"
        hideWorkflowTabs
        onActiveViewChange={setActiveViewLabel}
        onDetailModeChange={setShowBackButton}
      />
    </div>
  )
}
