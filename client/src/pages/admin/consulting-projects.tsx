import { useEffect, useMemo, useRef, useState } from "react"
import { useLocation } from "wouter"
import { ProjectManagement } from "@/components/admin/project-management"
import { AdminBackButton } from "@/components/admin/AdminBackButton"
import type { ProjectManagementRef } from "@/components/admin/project-management"
import { PageHeader } from "@/components/admin/page-header"
import { loadAllStoredWorkProjects } from "@/lib/work-consulting-projects"

export default function ConsultingProjectsPage() {
  const [, setLocation] = useLocation()
  const projectRef = useRef<ProjectManagementRef>(null)
  const [activeViewLabel, setActiveViewLabel] = useState("")
  const [showBackButton, setShowBackButton] = useState(false)

  const initialProjectId = useMemo(() => {
    if (typeof window === "undefined") return null
    return new URLSearchParams(window.location.search).get("selectedProjectId")
  }, [])

  const consultingProjectIdSet = useMemo(() => {
    if (typeof window === "undefined") return new Set<string>()
    const list = loadAllStoredWorkProjects().filter((p) => p.type === "컨설팅")
    return new Set(list.map((p) => p.id))
  }, [])

  useEffect(() => {
    if (initialProjectId) {
      if (consultingProjectIdSet.has(initialProjectId)) {
        setLocation(`/admin/consulting/${encodeURIComponent(initialProjectId)}`)
      } else {
        // selectedProjectId가 컨설팅 타입이 아닐 때는 상세 페이지로 들어가도 정보가 없습니다.
        // 잘못된 진입을 방지하기 위해 목록으로 보냅니다.
        setLocation("/admin/consulting")
      }
    }
  }, [initialProjectId, consultingProjectIdSet, setLocation])

  return (
    <div className="space-y-6 p-6">
      {showBackButton && (
        <div className="mb-3">
          <AdminBackButton onClick={() => projectRef.current?.clearSelection()} />
        </div>
      )}
      <PageHeader
        title={<>컨설팅 문의 관리{activeViewLabel && <span className="ml-3 text-xl font-semibold text-pink-600">/ {activeViewLabel}</span>}</>}
        description="컨설팅 문의를 관리하세요"
      />

      <ProjectManagement
        ref={projectRef}
        filterType="컨설팅"
        showConsultingOutcomeInList
        hideTypeColumn
        hideWorkflowTabs
        consultingOpenDetailAsRoute
        onActiveViewChange={setActiveViewLabel}
        onDetailModeChange={setShowBackButton}
      />
    </div>
  )
}
