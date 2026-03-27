import { useState, useRef } from "react"
import { ProjectManagement } from "@/components/admin/project-management"
import { AdminBackButton } from "@/components/admin/AdminBackButton"
import type { ProjectManagementRef } from "@/components/admin/project-management"

export default function BiddingProjectsPage() {
  const [activeViewLabel, setActiveViewLabel] = useState("")
  const [showBackButton, setShowBackButton] = useState(false)
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
          공고프로젝트 관리
          {activeViewLabel && (
            <span className="ml-3 text-xl font-semibold text-pink-600">
              / {activeViewLabel}
            </span>
          )}
        </h1>
        <p className="text-muted-foreground">공개 공고로 등록된 프로젝트를 관리하세요</p>
      </div>
      
      <ProjectManagement
        ref={projectRef}
        filterType="공고"
        onActiveViewChange={setActiveViewLabel}
        onDetailModeChange={setShowBackButton}
      />
    </div>
  )
}
