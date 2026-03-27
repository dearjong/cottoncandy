import { useState, useRef } from "react"
import { ProjectManagement } from "@/components/admin/project-management"
import { AdminBackButton } from "@/components/admin/AdminBackButton"
import type { ProjectManagementRef } from "@/components/admin/project-management"

interface ProjectsPageProps {
  initialProjectId?: string | null
}

export default function ProjectsPage({ initialProjectId = null }: ProjectsPageProps) {
  const [activeViewLabel, setActiveViewLabel] = useState("")
  const [showBackButton, setShowBackButton] = useState(!!initialProjectId)
  const projectRef = useRef<ProjectManagementRef>(null)
  return (
    <div className="space-y-6 p-6">
      <div>
        {showBackButton && (
          <div className="mb-3">
            <AdminBackButton onClick={() => projectRef.current?.clearSelection()} />
          </div>
        )}
        <h1 className="text-2xl font-bold text-foreground">
          전체 프로젝트
          {activeViewLabel && (
            <span className="ml-3 text-xl font-semibold text-pink-600">
              / {activeViewLabel}
            </span>
          )}
        </h1>
        <p className="text-muted-foreground">등록된 모든 프로젝트를 검토하고 승인/반려 처리하세요</p>
      </div>
      
      <ProjectManagement
        ref={projectRef}
        initialProjectId={initialProjectId}
        excludeConsultingInAll
        onActiveViewChange={setActiveViewLabel}
        onDetailModeChange={setShowBackButton}
      />
    </div>
  )
}