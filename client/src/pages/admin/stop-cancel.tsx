import { useState, useRef } from "react"
import { ProjectManagement } from "@/components/admin/project-management"
import { AdminBackButton } from "@/components/admin/AdminBackButton"
import type { ProjectManagementRef } from "@/components/admin/project-management"
import { PageHeader } from "@/components/admin/page-header"

export default function StopCancelPage() {
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
        title={<>중단/취소{activeViewLabel && <span className="ml-3 text-xl font-semibold text-pink-600">/ {activeViewLabel}</span>}</>}
        description="중단·취소된 프로젝트를 검토하세요"
      />
      <ProjectManagement
        ref={projectRef}
        defaultStatuses={["STOPPED", "CANCELLED", "COMPLETE", "ADMIN_CONFIRMED"]}
        excludeConsultingInAll
        onActiveViewChange={setActiveViewLabel}
        onDetailModeChange={setShowBackButton}
      />
    </div>
  )
}
