import { ProjectManagement } from "@/components/project-management"

export default function ProjectsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">프로젝트 관리</h1>
        <p className="text-muted-foreground">등록된 프로젝트를 검토하고 승인/반려 처리하세요</p>
      </div>
      
      <ProjectManagement />
    </div>
  )
}