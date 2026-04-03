import { useRef, useState } from "react"
import { ProjectManagement } from "@/components/admin/project-management"
import { AdminBackButton } from "@/components/admin/AdminBackButton"
import type { ProjectManagementRef } from "@/components/admin/project-management"
import { PageHeader } from "@/components/admin/page-header"

export default function ConsultingRelatedProjectsPage() {
  const projectRef = useRef<ProjectManagementRef>(null)
  const [activeViewLabel, setActiveViewLabel] = useState("")
  const [showBackButton, setShowBackButton] = useState(false)

  return (
    <div className="space-y-6 p-6">
      {showBackButton && (
        <div className="mb-3">
          <AdminBackButton onClick={() => projectRef.current?.clearSelection()} />
        </div>
      )}
      <PageHeader
        title={<>관련 프로젝트{activeViewLabel && <span className="ml-3 text-xl font-semibold text-pink-600">/ {activeViewLabel}</span>}</>}
        description="컨설팅 문의와 연결된 공고·1:1 프로젝트 목록입니다"
      />

      <ProjectManagement
        ref={projectRef}
        filterConsultingLinked
        excludeConsultingInAll
        openProjectDetailInNewWindow
        onActiveViewChange={setActiveViewLabel}
        onDetailModeChange={setShowBackButton}
      />
    </div>
  )
}
