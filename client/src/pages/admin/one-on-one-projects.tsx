import { useState, useRef } from "react"
import { ProjectManagement } from "@/components/admin/project-management"
import { AdminBackButton } from "@/components/admin/AdminBackButton"
import type { ProjectManagementRef } from "@/components/admin/project-management"
import { PageHeader } from "@/components/admin/page-header"

export default function OneOnOneProjectsPage() {
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
        title={<>1:1 프로젝트 관리{activeViewLabel && <span className="ml-3 text-xl font-semibold text-pink-600">/ {activeViewLabel}</span>}</>}
        description="1:1 비공개 프로젝트를 관리하세요"
      />
      
      <ProjectManagement
        ref={projectRef}
        filterType="1:1"
        onActiveViewChange={setActiveViewLabel}
        onDetailModeChange={setShowBackButton}
      />
    </div>
  )
}
