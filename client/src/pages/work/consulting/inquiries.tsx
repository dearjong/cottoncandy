import Layout from "@/components/layout/layout"
import WorkSidebar from "@/components/work/sidebar"
import { ProjectManagement } from "@/components/admin/project-management"
import type { ProjectManagementRef } from "@/components/admin/project-management"
import { useLocation } from "wouter"
import { useMemo, useRef, useState } from "react"

export default function WorkConsultingInquiries() {
  const [,] = useLocation()
  const projectRef = useRef<ProjectManagementRef>(null)
  const [activeViewLabel, setActiveViewLabel] = useState("")

  const initialProjectId = useMemo(() => {
    if (typeof window === "undefined") return null
    return new URLSearchParams(window.location.search).get("selectedProjectId")
  }, [])

  return (
    <Layout>
      <div className="work-container">
        <div className="work-content">
          <div className="flex gap-6">
            <WorkSidebar />
            <div className="flex-1">
              <div className="mb-6">
                <h1 className="work-title">컨설팅 문의</h1>
                {activeViewLabel && <p className="work-subtitle">/ {activeViewLabel}</p>}
              </div>

              <div>
              <ProjectManagement
                ref={projectRef}
                filterType="컨설팅"
                hideTypeColumn
                localOnly
                consultingDetailMode="admin"
                hideWorkflowTabs
                consultingWorkInquiryDetail
                initialProjectId={initialProjectId}
                onActiveViewChange={setActiveViewLabel}
              />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
