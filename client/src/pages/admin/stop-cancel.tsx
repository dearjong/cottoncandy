import { useState, useRef } from "react"
import { ProjectManagement } from "@/components/admin/project-management"
import { AdminBackButton } from "@/components/admin/AdminBackButton"
import type { ProjectManagementRef } from "@/components/admin/project-management"

export default function StopCancelPage() {
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
          중단/취소
          {activeViewLabel && (
            <span className="ml-3 text-xl font-semibold text-pink-600">
              / {activeViewLabel}
            </span>
          )}
        </h1>
        <p className="text-muted-foreground">중단·취소된 프로젝트를 검토하세요</p>
      </div>
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
